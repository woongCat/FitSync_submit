import React, { useEffect, useContext } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { PTScheduleContext } from '../context/PTScheduleContext'; // Context 사용
import styles from '../style/styles'; // 스타일 가져오기

const ScheduleScreen: React.FC = () => {
    const { schedules, fetchSchedules, addSchedule, deleteSchedule } = useContext(PTScheduleContext);

    // 초기 데이터 로드
    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    // 스케줄 삭제 핸들러
    const handleDeleteSchedule = (recordId: string) => {
        Alert.alert('Delete Schedule', 'Are you sure you want to delete this schedule?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => deleteSchedule(recordId),
            },
        ]);
    };

    // 스케줄 추가 핸들러 (예제용)
    const handleAddSchedule = () => {
        addSchedule({
            trainerId: '1',
            customerId: '2',
            sessionDate: '2025-01-09T14:00:00Z',
            notes: 'New PT Session',
        });
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
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.recordId} // recordId가 string이므로 그대로 사용
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
                            Notes: {item.notes}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDeleteSchedule(item.recordId)} // string 타입 그대로 사용
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