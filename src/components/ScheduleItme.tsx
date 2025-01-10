// ScheduleItem.tsx
import React, { useState } from 'react';
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
    onEdit?: (scheduleId: number) => void; // 새로운 prop 추가
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
    schedule,
    onDelete,
    onApprove,
    onReject,
    onEdit,
}) => {
    const [showDetails, setShowDetails] = useState(false);

    // 상태에 따른 배경 스타일
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending':
                return { backgroundColor: '#ffebcc' };
            case 'Approved':
                return { backgroundColor: '#d4edda' };
            case 'Rejected':
                return { backgroundColor: '#f8d7da' };
            default:
                return { backgroundColor: '#ffffff' };
        }
    };

    return (
        <View style={[ScheduleStyles.scheduleCard, getStatusStyle(schedule.status)]}>
            <Text style={ScheduleStyles.scheduleText}>Trainer: {schedule.trainerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>Customer: {schedule.customerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>
                Time: {schedule.startTime} - {schedule.endTime}
            </Text>
            <Text style={ScheduleStyles.scheduleText}>Status: {schedule.status}</Text>

            {/* 상세 정보 표시 */}
            {showDetails && (
                <View>
                    <Text style={ScheduleStyles.scheduleDetailText}>Schedule ID: {schedule.scheduleId}</Text>
                    <Text style={ScheduleStyles.scheduleDetailText}>
                        Duration: {new Date(schedule.endTime).getTime() - new Date(schedule.startTime).getTime()} mins
                    </Text>
                </View>
            )}

            {/* 토글 버튼 */}
            <TouchableOpacity
                style={ScheduleStyles.toggleDetailsButton}
                onPress={() => setShowDetails((prev) => !prev)}
            >
                <Text style={ScheduleStyles.buttonText}>
                    {showDetails ? 'Hide Details' : 'View Details'}
                </Text>
            </TouchableOpacity>

            {/* 기능 버튼 */}
            <View style={ScheduleStyles.buttonGroup}>
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
                {onEdit && (
                    <TouchableOpacity style={ScheduleStyles.editButton} onPress={() => onEdit(schedule.scheduleId)}>
                        <Text style={ScheduleStyles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ScheduleItem;