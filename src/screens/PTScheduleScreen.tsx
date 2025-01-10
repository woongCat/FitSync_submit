import React, { useEffect, useState, useContext, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { PTScheduleContext } from '../context/PTScheduleContext';
import { Calendar } from 'react-native-calendars';
import ScheduleItem from '../components/ScheduleItme.tsx'; // Trainer/Customer 공통 ScheduleItem
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
    } = useContext(PTScheduleContext); // PTSchedule Context 사용

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
    const [trainerName, setTrainerName] = useState<string>(''); // 고객용 검색 기능
    const [filteredSchedules, setFilteredSchedules] = useState<typeof schedules>([]); // 검색된 스케줄
    const [trainerId, setTrainerId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [startPickerVisible, setStartPickerVisible] = useState(false);
    const [endPickerVisible, setEndPickerVisible] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        console.log('Today:', today); // 디버깅용
        setSelectedDate(today);
        setMarkedDates({
            [today]: {
                selected: true,
                marked: true,
                selectedColor: '#007bff',
            },
        });
        fetchSchedules(today);
    }, []);

    useEffect(() => {
        console.log('UserType:', userType); // 현재 userType 확인
    }, [userType]);

    const handleDateSelect = async (day: { dateString: string }) => {
        const sessionDate = day.dateString;
    
        console.log('Selected Date:', sessionDate); // 디버깅 로그 추가
        setSelectedDate(sessionDate);
    
        // `markedDates`를 최적화된 방식으로 업데이트
        setMarkedDates((prev) => {
            const updatedMarkedDates = { ...prev };
    
            // 기존 선택된 날짜를 초기화
            if (selectedDate) {
                updatedMarkedDates[selectedDate] = { marked: true, selected: false };
            }
    
            // 새로 선택된 날짜를 마킹
            updatedMarkedDates[sessionDate] = {
                selected: true,
                marked: true,
                selectedColor: '#007bff',
            };
    
            return updatedMarkedDates;
        });
    
        try {
            await fetchSchedules(sessionDate);
            console.log('Fetch Schedules called for:', sessionDate); // 디버깅 로그 추가
        } catch (error) {
            console.error('Failed to fetch schedules for date:', sessionDate, error);
        }
    };

    const handleSearch = () => {
        if (trainerName.trim()) {
            const result = schedules.filter((schedule) =>
                schedule.trainerName.toLowerCase().includes(trainerName.toLowerCase())
            );
            setFilteredSchedules(result);
        } else {
            setFilteredSchedules([]);
        }
    };

    const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
        setStartPickerVisible(false);
        if (selectedTime) {
            setStartTime(selectedTime.toTimeString().slice(0, 5));
        }
    };

    const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
        setEndPickerVisible(false);
        if (selectedTime) {
            setEndTime(selectedTime.toTimeString().slice(0, 5));
        }
    };

    const handleAddSchedule = () => {
        if (!selectedDate || !trainerId || !startTime || !endTime) {
            Alert.alert('Error', 'Please complete all fields.');
            return;
        }
        addSchedule(selectedDate, {
            trainerId,
            startTime,
            endTime,
        }).then((success) => {
            if (success) {
                Alert.alert('Success', 'Reservation added successfully!');
                fetchSchedules(selectedDate);
            } else {
                Alert.alert('Error', 'Failed to add reservation.');
            }
        });
    };

    const handleCancelSchedule = (scheduleId: number) => {
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
    };

    return (
        <View style={ScheduleStyles.contentContainer}>
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

            <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                    ...markedDates,
                    [selectedDate || '']: { selected: true, selectedColor: 'blue' },
                }}
            />

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
                            onChange={handleStartTimeChange}
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
                            onChange={handleEndTimeChange}
                        />
                    )}

                    <TouchableOpacity style={ScheduleStyles.addButton} onPress={handleAddSchedule}>
                        <Text style={ScheduleStyles.addButtonText}>Add Reservation</Text>
                    </TouchableOpacity>
                </>
            )}

            <FlatList
                data={filteredSchedules.length > 0 ? filteredSchedules : schedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <ScheduleItem
                        schedule={item}
                        onDelete={userType === 'customer' ? handleCancelSchedule : undefined}
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
            />
        </View>
    );
};

export default UnifiedScheduleScreen;