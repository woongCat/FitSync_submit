import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { usePTSchedule } from '../context/PTScheduleContext'; // Context 사용
import { useCustomerSchedule } from '../context/CustomerPTScheduleContext.tsx'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import ScheduleItem from '../components/CustomerItem';
import styles from '../style/styles'; // 스타일 가져오기

const CustomerScheduleScreen: React.FC = () => {
    // const {schedules, fetchSchedules, addSchedule, updateSchedule, deleteSchedule, isLoading, markedDates} = usePTSchedule();
    const {schedules,userType,fetchSchedules,updateSchedule,addSchedule,deleteSchedule} = useCustomerSchedule();
    const [trainerName, setTrainerName] = useState<string>(''); // 검색어
    const [filteredSchedules, setFilteredSchedules] = useState<typeof schedules>([]); // 검색된 스케줄
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택된 날짜 저장
    const [trainerId, setTrainerId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<string>(''); // Start time 세팅
    const [endTime, setEndTime] = useState<string>(''); // End time 세팅
    const [startPickerVisible, setStartPickerVisible] = useState(false);
    const [endPickerVisible, setEndPickerVisible] = useState(false);


    // 초기 데이터 로드
    useEffect(() => {
        const loadSchedules = async () => {
            if (selectedDate) {
                const success = await fetchSchedules(selectedDate);
                if (!success) {
                    Alert.alert('Error', 'Failed to load schedules.');
                }
            }
        };
        loadSchedules();
    }, [selectedDate]);

    // 트레이너 검색 핸들러
    const handleSearch = () => {
        const result = schedules.filter(schedule =>
            schedule.trainerName.toLowerCase().includes(trainerName.toLowerCase())
        );
        setFilteredSchedules(result);
    };
    
    // 피티 예약 시작 시간
    const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
        setStartPickerVisible(false);
        if (selectedTime) {
            setStartTime(selectedTime.toTimeString().slice(0, 5)); // Format to HH:mm
        }
    };

    // 피티 예약 끝나는 시간
    const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
        setEndPickerVisible(false);
        if (selectedTime) {
            setEndTime(selectedTime.toTimeString().slice(0, 5));
        }
    };

    // 예약 추가 핸들러
    const handleAddSchedule = () => {
        if (!selectedDate || !trainerId || !startTime || !endTime) {
            Alert.alert('Error', 'Please select a date, trainer, start time, and end time.');
            return;
        }
        addSchedule(selectedDate, {
            trainerId,
            startTime,
            endTime,
        }).then((success) => {
            if (success) {
                Alert.alert('Success', 'Reservation added successfully!');
                fetchSchedules(selectedDate); // 새로고침
            } else {
                Alert.alert('Error', 'Failed to add reservation.');
            }
        });
    };

    // 예약 취소 핸들러
    const handleCancelSchedule = (scheduleId: number) => {
        Alert.alert('Cancel Reservation', 'Are you sure you want to cancel this reservation?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: () => {
                    deleteSchedule(scheduleId).then((success) => {
                        if (success) {
                            Alert.alert('Success', 'Reservation canceled successfully!');
                            if (selectedDate) fetchSchedules(selectedDate); // 새로고침
                        } else {
                            Alert.alert('Error', 'Failed to cancel reservation.');
                        }
                    });
                },
            },
        ]);
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
        fetchSchedules(day.dateString); // 선택한 날짜로 데이터 로드
    };

    // 캘린더 표시 데이터
    const markedDates = schedules.reduce((acc, schedule) => {
        const color =
            schedule.status === '예약 대기'
                ? 'orange'
                : schedule.status === '예약 완료'
                ? 'green'
                : undefined;

        if (color) {
            acc[schedule.startTime.split('T')[0]] = {
                marked: true,
                dotColor: color,
            };
        }
        return acc;
    }, {} as Record<string, any>);

    return (
        <View style={styles.contentContainer}>
            {/* 검색 */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Trainer by Name"
                    value={trainerName}
                    onChangeText={setTrainerName}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {/* 캘린더 */}
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                    ...markedDates,
                    [selectedDate || '']: {
                        selected: true,
                        selectedColor: 'blue',
                    },
                }}
            />

            {/* 시간 선택 */}
             <TouchableOpacity onPress={() => setStartPickerVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Select Start Time</Text>
            </TouchableOpacity>
            {startPickerVisible && (
                <DateTimePicker
                    mode="time"
                    value={new Date()}
                    onChange={handleStartTimeChange}
                />
            )}

            <TouchableOpacity onPress={() => setEndPickerVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Select End Time</Text>
            </TouchableOpacity>
            {endPickerVisible && (
                <DateTimePicker
                    mode="time"
                    value={new Date()}
                    onChange={handleEndTimeChange}
                />
            )}

            {/* 예약 추가 */}
            {selectedDate && trainerName && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
                    <Text style={styles.addButtonText}>Add Reservation</Text>
                </TouchableOpacity>
            )}

            {/* 예약 리스트 */}
            <FlatList
                data={filteredSchedules.length > 0 ? filteredSchedules : schedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <ScheduleItem
                        schedule={item}
                        onDelete={handleCancelSchedule}
                    />
                )}
            />
        </View>
    );
};

export default CustomerScheduleScreen;