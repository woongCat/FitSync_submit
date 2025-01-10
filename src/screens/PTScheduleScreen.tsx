import React, { useEffect, useState, useContext, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { PTScheduleContext } from '../context/PTScheduleContext';
import { Calendar } from 'react-native-calendars';
import ScheduleItem from '../components/ScheduleItme.tsx';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScheduleStyles from '../style/ScheduleStyles';

const UnifiedScheduleScreen: React.FC = () => {
    const {
        schedules,
        userType,
        fetchSchedules,
        updateSchedule,
        addSchedule,
        deleteSchedule,
        isLoading,
    } = useContext(PTScheduleContext);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [trainerName, setTrainerName] = useState<string>(''); // 검색 기능
    const [filteredSchedules, setFilteredSchedules] = useState<typeof schedules>([]); // 필터된 스케줄
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [startPickerVisible, setStartPickerVisible] = useState(false);
    const [endPickerVisible, setEndPickerVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({}); // 마킹된 날짜들

    // 초기화
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    
        setMarkedDates({
            [today]: { selected: true, marked: true, selectedColor: '#007bff' },
        });
    
        fetchSchedules(today).catch((error) =>
            console.error('Error fetching schedules on initialization:', error)
        );
    }, []);

    useEffect(() => {
        // 예약된 날짜 마킹 처리
        const newMarkedDates = { ...markedDates };
    
        schedules.forEach((schedule) => {
            const sessionDate = schedule.startTime.split('T')[0]; // 날짜만 추출
            newMarkedDates[sessionDate] = {
                ...newMarkedDates[sessionDate],
                marked: true,
                dotColor: '#007bff', // 예약 날짜 점
            };
        });
    
        setMarkedDates(newMarkedDates);
    }, [schedules]);

    const handleDateSelect = async (day: { dateString: string }) => {
        const sessionDate = day.dateString;
    
        // 선택 날짜 업데이트
        setSelectedDate(sessionDate);
    
        // 마킹 데이터 업데이트
        setMarkedDates((prev) => {
            const updatedDates = { ...prev };
    
            // 모든 날짜의 선택 상태 초기화
            Object.keys(updatedDates).forEach((key) => {
                if (updatedDates[key].selected) {
                    delete updatedDates[key].selected;
                    delete updatedDates[key].selectedColor;
                }
            });
    
            // 새로운 선택 날짜 마킹
            updatedDates[sessionDate] = {
                ...updatedDates[sessionDate],
                selected: true,
                selectedColor: '#007bff',
            };
    
            return updatedDates;
        });
    
        try {
            await fetchSchedules(sessionDate);
        } catch (error) {
            console.error('Failed to fetch schedules for date:', sessionDate, error);
        }
    };

    const handleSearch = useCallback(() => {
        if (trainerName.trim()) {
            setFilteredSchedules(
                schedules.filter((schedule) =>
                    schedule.trainerName.toLowerCase().includes(trainerName.toLowerCase())
                )
            );
        } else {
            setFilteredSchedules([]);
        }
    }, [schedules, trainerName]);

    const handleAddSchedule = useCallback(() => {
        if (!selectedDate || !startTime || !endTime) {
            Alert.alert('Error', 'Please complete all fields.');
            return;
        }

        addSchedule(selectedDate, { trainerId: 1, startTime, endTime }).then((success) => {
            if (success) {
                Alert.alert('Success', 'Reservation added successfully!');
                fetchSchedules(selectedDate);
            } else {
                Alert.alert('Error', 'Failed to add reservation.');
            }
        });
    }, [selectedDate, startTime, endTime, addSchedule, fetchSchedules]);

    const handleDeleteSchedule = useCallback(
        (scheduleId: number) => {
            Alert.alert('Cancel Reservation', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteSchedule(scheduleId).then((success) => {
                            if (success && selectedDate) {
                                fetchSchedules(selectedDate);
                            } else {
                                Alert.alert('Error', 'Failed to cancel reservation.');
                            }
                        });
                    },
                },
            ]);
        },
        [deleteSchedule, fetchSchedules, selectedDate]
    );

    // 메모이제이션된 데이터
    const displayedSchedules = useMemo(
        () => (filteredSchedules.length > 0 ? filteredSchedules : schedules),
        [filteredSchedules, schedules]
    );

    return (
        <View style={ScheduleStyles.contentContainer}>
            {/* 검색 영역 */}
            {userType === 'customer' && (
                <View style={ScheduleStyles.searchContainer}>
                    <TextInput
                        style={ScheduleStyles.searchInput}
                        placeholder="Search Trainer by Name"
                        value={trainerName}
                        onChangeText={setTrainerName}
                    />
                    <TouchableOpacity onPress={handleSearch} style={ScheduleStyles.searchButton}>
                        <Text style={ScheduleStyles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 캘린더 */}
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={markedDates} // 이 부분이 핵심입니다.
                theme={{
                    selectedDayBackgroundColor: '#007bff',
                    todayTextColor: '#007bff',
                    arrowColor: '#007bff',
                }}
            />

            {/* 로딩 상태 */}
            {isLoading && <ActivityIndicator size="large" color="#007bff" />}

            {/* FlatList */}
            <FlatList
                data={displayedSchedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <ScheduleItem
                        schedule={item}
                        onDelete={userType === 'customer' ? handleDeleteSchedule : undefined}
                        onApprove={
                            userType === 'trainer'
                                ? () =>
                                      updateSchedule(
                                          item.scheduleId,
                                          '확정',
                                          selectedDate || '',
                                          item.trainerId,
                                          item.customerId,
                                          item.startTime,
                                          item.endTime
                                      )
                                : undefined
                        }
                        onReject={
                            userType === 'trainer'
                                ? () =>
                                      updateSchedule(
                                          item.scheduleId,
                                          '거절',
                                          selectedDate || '',
                                          item.trainerId,
                                          item.customerId,
                                          item.startTime,
                                          item.endTime
                                      )
                                : undefined
                        }
                    />
                )}
                ListEmptyComponent={<Text>No schedules available.</Text>}
            />

            {/* 예약 추가 */}
            {userType === 'customer' && (
                <>
                    <TouchableOpacity
                        onPress={() => setStartPickerVisible(true)}
                        style={ScheduleStyles.addButton}
                    >
                        <Text style={ScheduleStyles.addButtonText}>Select Start Time</Text>
                    </TouchableOpacity>
                    {startPickerVisible && (
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            onChange={(event, date) => {
                                setStartPickerVisible(false);
                                if (date) setStartTime(date.toISOString().split('T')[1]);
                            }}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => setEndPickerVisible(true)}
                        style={ScheduleStyles.addButton}
                    >
                        <Text style={ScheduleStyles.addButtonText}>Select End Time</Text>
                    </TouchableOpacity>
                    {endPickerVisible && (
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            onChange={(event, date) => {
                                setEndPickerVisible(false);
                                if (date) setEndTime(date.toISOString().split('T')[1]);
                            }}
                        />
                    )}

                    <TouchableOpacity style={ScheduleStyles.addButton} onPress={handleAddSchedule}>
                        <Text style={ScheduleStyles.addButtonText}>Add Reservation</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default UnifiedScheduleScreen;