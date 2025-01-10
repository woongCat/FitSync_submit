// ScheduleItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ScheduleStyles from '../style/ScheduleStyles.tsx';

interface ScheduleItemProps {
    schedule: {
        scheduleId: number;
        trainerName: string;
        customerName: string;
        startTime: string;
        endTime: string;
        status: string;
    };
    onDelete?: (scheduleId: number) => void;
    onApprove?: () => void;
    onReject?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
    schedule,
    onDelete,
    onApprove,
    onReject,
}) => {
    return (
        <View style={ScheduleStyles.scheduleCard}>
            <Text style={ScheduleStyles.scheduleText}>Trainer: {schedule.trainerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>Customer: {schedule.customerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>
                Time: {schedule.startTime} - {schedule.endTime}
            </Text>
            <Text style={ScheduleStyles.scheduleText}>Status: {schedule.status}</Text>

            {onApprove && (
                <TouchableOpacity style={ScheduleStyles.approveButton} onPress={onApprove}>
                    <Text style={ScheduleStyles.buttonText}>Approve</Text>
                </TouchableOpacity>
            )}
            {onReject && (
                <TouchableOpacity style={ScheduleStyles.rejectButton} onPress={onReject}>
                    <Text style={ScheduleStyles.buttonText}>Reject</Text>
                </TouchableOpacity>
            )}
            {onDelete && (
                <TouchableOpacity style={ScheduleStyles.deleteButton} onPress={() => onDelete(schedule.scheduleId)}>
                    <Text style={ScheduleStyles.buttonText}>Delete</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ScheduleItem;