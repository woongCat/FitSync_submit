import React, { useEffect, useContext, useState } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { PTScheduleContext } from '../context/CustomerPTScheduleContext'; // Context 사용
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { CustomerItem } from '../components/CustomerItem';
import { TrainerItem } from '../components/TrainerItem';
import styles from '../style/styles'; // 스타일 가져오기

const ScheduleScreen: React.FC = () => {
    const {schedules, fetchSchedules, addSchedule, deleteSchedule } = useContext(PTScheduleContext);
    
    const [userType, setUserType] = useState<'customer' | 'trainer'>('customer'); // 기본값 설정
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택된 날짜 저장


    // 초기 데이터 로드 
    useEffect(() => {
        fetchSchedules;
    }, [fetchSchedules]);

    // 스케줄 삭제 핸들러
    const handleDeleteSchedule = (scheduleId: string) => {
        Alert.alert('Delete Schedule', 'Are you sure you want to delete this schedule?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => deleteSchedule(scheduleId),
            },
        ]);
    };

    // 스케줄 추가 핸들러 (예제용)
    const handleAddSchedule = () => {
        addSchedule({
            trainerId: '1',
            customerId: '2',
            sessionDate: '2025-01-09T14:00:00Z',
            startTime: '14:00:00',
            endTime: '16:00:00',
            status: '예약',
        });
    };

     // 날짜 선택 핸들러
    const handleDateSelect = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <Text style={styles.headerText}>Schedule List</Text>
                <TouchableOpacity
                    onPress={handleAddSchedule}
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>Add Schedule</Text>
                </TouchableOpacity>
            </View>

            <Calendar //calander 기능 추가 필요
                onDayPress={handleDateSelect} // 날짜 클릭 이벤트
                markedDates={{
                    [selectedDate || '']: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                    },
                }}
            />
            
            {selectedDate && (
                <View style={styles.container}>
                    {userType === 'customer' ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddSchedule}
                        >
                            <Text style={styles.bottonText}>예약</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => Alert.alert('예약 확인', 'Reservation confirmed.')}
                        >
                            <Text style={styles.bottonText}>예약 확인</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <FlatList
                data={schedules}
                keyExtractor={(item) => item.scheduleId} // recordId가 string이므로 그대로 사용
                renderItem={({ item }) => (
                    <View style={styles.scheduleCard}>
                        <Text style={styles.scheduleText}>
                            Trainer ID: {item.trainerId}
                        </Text>
                        <Text style={styles.scheduleText}>
                            Customer ID: {item.customerId}
                        </Text>
                        <Text style={styles.scheduleText}>
                            Date: {item.sessionDate}
                        </Text>
                        <Text style={styles.scheduleText}>
                            Start Time: {item.startTime}
                        </Text>
                        <Text style={styles.scheduleText}>
                            End Time: {item.endTime}
                        </Text>
                        <Text style={styles.scheduleText}>
                            Reservation Status: {item.status}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDeleteSchedule(item.scheduleId)} // string 타입 그대로 사용
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteButtonText}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default ScheduleScreen;