import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../style/styles'; // 스타일 가져오기
import { PTSchedule } from '../context/CustomerPTScheduleContext';

interface ScheduleItemProps {
    schedule: PTSchedule;
    onDelete: (scheduleId: number) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onDelete }) => {
    return (
        <View style={styles.scheduleCard}>
            <Text style={styles.scheduleText}>
                Trainer: {schedule.trainerId}
            </Text>
            <Text style={styles.scheduleText}>
                Date: {schedule.sessionDate.split('T')[0]}
            </Text>
            <Text style={styles.scheduleText}>
                Time: {schedule.startTime} - {schedule.endTime}
            </Text>
            <Text style={styles.scheduleText}>
                Status: {schedule.status}
            </Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(schedule.scheduleId)}
            >
                <Text style={styles.deleteButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ScheduleItem;
