import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import { PTScheduleContext } from '../context/PTScheduleContext.tsx'; // 경로를 맞춰주세요
import { Calendar } from 'react-native-calendars';

const TrainerPTScheduleScreen: React.FC = () => {
    const {
        schedules,
        fetchSchedules,
        updateSchedule,
        isLoading,
    } = useContext(PTScheduleContext);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

    const handleDateSelect = async (day: { dateString: string }) => {
        const sessionDate = day.dateString;
        setSelectedDate(sessionDate);

        setMarkedDates({
            [sessionDate]: {
                selected: true,
                marked: true,
                selectedColor: '#007bff',
            },
        });

        try {
            await fetchSchedules(sessionDate);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch schedules.');
        }
    };

    const handleUpdateStatus = async (
        scheduleId: number,
        newStatus: '확정' | '거절',
        sessionDate: string,
        trainerId: number,
        customerId: number,
        startTime: string,
        endTime: string
    ) => {
        const success = await updateSchedule(
            scheduleId,
            newStatus,
            sessionDate,
            trainerId,
            customerId,
            startTime,
            endTime
        );

        if (success) {
            Alert.alert('Success', 'Schedule updated successfully!');
            fetchSchedules(sessionDate);
        } else {
            Alert.alert('Error', 'Failed to update schedule.');
        }
    };

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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>트레이너 스케줄</Text>
            </View>

            {/* Calendar */}
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={markedDates}
                theme={{
                    selectedDayBackgroundColor: '#007bff',
                    todayTextColor: '#007bff',
                    arrowColor: '#007bff',
                }}
            />

            {/* Loading Indicator */}
            {isLoading && <ActivityIndicator size="large" color="#007bff" />}

            {/* Schedule List */}
            <Text style={styles.scheduleTitle}>
                {selectedDate}의 스케줄
            </Text>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.scheduleCard}>
                        <Text style={styles.scheduleCustomer}>
                            고객: {item.customerName}
                        </Text>
                        <Text style={styles.scheduleTime}>
                            시간: {item.startTime} ~ {item.endTime}
                        </Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.approveButton}
                                onPress={() =>
                                    handleUpdateStatus(
                                        item.scheduleId,
                                        '확정',
                                        selectedDate || '',
                                        item.trainerId,
                                        item.customerId,
                                        item.startTime,
                                        item.endTime
                                    )
                                }
                            >
                                <Text style={styles.buttonText}>확정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectButton}
                                onPress={() =>
                                    handleUpdateStatus(
                                        item.scheduleId,
                                        '거절',
                                        selectedDate || '',
                                        item.trainerId,
                                        item.customerId,
                                        item.startTime,
                                        item.endTime
                                    )
                                }
                            >
                                <Text style={styles.buttonText}>거절</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        선택한 날짜에 스케줄이 없습니다.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343a40',
    },
    scheduleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#495057',
        marginVertical: 10,
    },
    scheduleCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scheduleCustomer: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212529',
        marginBottom: 5,
        textAlign: 'center',
    },
    scheduleTime: {
        fontSize: 14,
        color: '#868e96',
        textAlign: 'center',

    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center', // 버튼을 가운데 정렬
        alignItems: 'center',
        marginTop: 10,
        gap: 10, // 버튼 간의 간격
    },
    approveButton: {
        backgroundColor: '#28a745',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    rejectButton: {
        backgroundColor: '#dc3545',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#adb5bd',
        marginTop: 20,
    },
    
});

export default TrainerPTScheduleScreen;