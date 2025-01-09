import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../style/styles'; // 스타일 가져오기
import { Schedule } from '../context/CustomerPTScheduleContext';

interface ScheduleItemProps {
    schedule: Schedule;
    onDelete: (scheduleId: number) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onDelete }) => {
    return (
        <View style={styles.scheduleCard}>
            <Text style={styles.scheduleText}>
                Trainer: {schedule.trainerName}
            </Text>
            <Text style={styles.scheduleText}>
                Customer: {schedule.customerName}
            </Text>
            <Text style={styles.scheduleText}>
                Date: {schedule.startTime.split('T')[0]}
            </Text>
            <Text style={styles.scheduleText}>
                Time: {schedule.startTime.split('T')[1]} - {schedule.endTime.split('T')[1]}
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
