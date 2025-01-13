// CustomerItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../style/styles';
import { Schedule } from '../context/CustomerPTScheduleContext';

interface ScheduleItemProps {
    schedule: Schedule;
    onDelete: (scheduleId: number) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, onDelete }) => {
    const startDate = schedule.startTime?.split('T')[0] || 'N/A';
    const startTime = schedule.startTime?.split('T')[1]?.slice(0, 5) || 'N/A';
    const endTime = schedule.endTime?.split('T')[1]?.slice(0, 5) || 'N/A';

    const handleDelete = () => {
        Alert.alert('Confirm', 'Are you sure you want to cancel this reservation?', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => onDelete(schedule.scheduleId) },
        ]);
    };

    return (
        <View style={styles.scheduleCard}>
            <Text style={styles.scheduleText}><Text style={styles.label}>Trainer:</Text> {schedule.trainerName || 'Unknown'}</Text>
            <Text style={styles.scheduleText}><Text style={styles.label}>Customer:</Text> {schedule.customerName || 'Unknown'}</Text>
            <Text style={styles.scheduleText}><Text style={styles.label}>Date:</Text> {startDate}</Text>
            <Text style={styles.scheduleText}><Text style={styles.label}>Time:</Text> {startTime} - {endTime}</Text>
            <Text style={styles.scheduleText}><Text style={styles.label}>Status:</Text> {schedule.status || 'Unknown'}</Text>
            <TouchableOpacity
                style={[styles.deleteButton, schedule.status === 'Completed' && styles.disabledButton]}
                onPress={handleDelete}
                disabled={schedule.status === 'Completed'}
            >
                <Text style={styles.deleteButtonText}>{schedule.status === 'Completed' ? 'Completed' : 'Cancel'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ScheduleItem;