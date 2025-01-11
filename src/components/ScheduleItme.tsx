// ScheduleItem.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import ScheduleStyles from '../style/ScheduleStyles.tsx';

interface ScheduleItemProps {
    schedule: {
        scheduleId: number;
        trainerName: string;
        customerName: string;
        startTime: string;
        endTime: string;
        status: string;
        agenda?: string[]; // Include agenda as optional
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
    const [isProcessing, setIsProcessing] = useState(false); // 작업 중인지 확인


    // 상태에 따른 배경 스타일
    const getStatusStyle = (status: string) => {
        switch (status) {
            case '예약':
                return { backgroundColor: '#ffebcc' };
            case '확정':
                return { backgroundColor: '#d4edda' };
            case '거절':
                return { backgroundColor: '#f8d7da' };
            default:
                return { backgroundColor: '#ffffff' };
        }
    };


    const handleApprove = () => {
        setIsProcessing(true);
        Alert.alert('확정 처리 중입니다...');
        if (onApprove) {
            onApprove();
            Alert.alert('확정되었습니다!');
        }
        setIsProcessing(false);
    };

    const handleReject = () => {
        setIsProcessing(true);
        Alert.alert('거절 처리 중입니다...');
        if (onReject) {
            onReject();
            Alert.alert('거절되었습니다!');
        }
        setIsProcessing(false);
    };

    // schedule이 undefined일 경우 기본값 설정
    if (!schedule) {
        console.error('ScheduleItem received undefined schedule:', schedule);
        return (
            <View style={ScheduleStyles.scheduleCard}>
                <Text style={ScheduleStyles.scheduleText}>Invalid schedule data</Text>
            </View>
        );
    }

    return (
        <View style={[ScheduleStyles.scheduleCard, getStatusStyle(schedule.status)]}>
            <Text style={ScheduleStyles.scheduleText}>Trainer: {schedule.trainerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>Customer: {schedule.customerName}</Text>
            <Text style={ScheduleStyles.scheduleText}>
                Time: {schedule.startTime} - {schedule.endTime}
            </Text>
            <Text style={ScheduleStyles.scheduleText}>Status: {schedule.status}</Text>

            {/* Display agenda list */}
            {schedule.agenda && schedule.agenda.length > 0 && (
                <View>
                    <Text style={ScheduleStyles.scheduleText}>Agenda:</Text>
                    {schedule.agenda.map((item, index) => (
                        <Text key={index} style={ScheduleStyles.scheduleDetailText}>
                            - {item}
                        </Text>
                    ))}
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
            {/* {schedule.status === '예약' && (
                    <>
                        {onApprove && (
                            <TouchableOpacity
                                style={[
                                    ScheduleStyles.approveButton,
                                    isProcessing ? ScheduleStyles.disabledButton : null,
                                ]}
                                onPress={handleApprove}
                                disabled={isProcessing}
                            >
                                <Text style={ScheduleStyles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                        )}
                        {onReject && (
                            <TouchableOpacity
                                style={[
                                    ScheduleStyles.rejectButton,
                                    isProcessing ? ScheduleStyles.disabledButton : null,
                                ]}
                                onPress={handleReject}
                                disabled={isProcessing}
                            >
                                <Text style={ScheduleStyles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )} */}
                {schedule.status === '예약' && (
                    <>
                        {onApprove && (
                            <TouchableOpacity
                                style={[
                                    ScheduleStyles.approveButton,
                                    isProcessing ? ScheduleStyles.disabledButton : null,
                                ]}
                                onPress={handleApprove}
                                disabled={isProcessing}
                            >
                                <Text style={ScheduleStyles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                        )}
                        {onReject && (
                            <TouchableOpacity
                                style={[
                                    ScheduleStyles.rejectButton,
                                    isProcessing ? ScheduleStyles.disabledButton : null,
                                ]}
                                onPress={handleReject}
                                disabled={isProcessing}
                            >
                                <Text style={ScheduleStyles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        )}
                    </>
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