// ScheduleItem.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ScheduleStyles from '../style/ScheduleStyles.tsx';
import { PTScheduleContext } from '../context/PTScheduleContext'; // Context import

const availableTimes = [
    '00:00:00','01:00:00','02:00:00','03:00:00','04:00:00','05:00:00',
    '06:00:00','07:00:00','08:00:00','09:00:00','10:00:00','11:00:00',
    '12:00:00','13:00:00','14:00:00','15:00:00','16:00:00','17:00:00',
    '18:00:00','19:00:00','20:00:00','21:00:00','22:00:00','23:00:00'
  ];

interface ScheduleItemProps {
    userType?: string;
    schedule: {
        scheduleId: number;
        trainerName: string;
        customerName: string;
        startTime: string;
        endTime: string;
        status: string;
        agenda?: string[]; // Include agenda as optional
    };
    onSelectTime?: (scheduleId: number, start: string, end: string) => void;
    onDelete?: (scheduleId: number) => void;
    onApprove?: () => void;
    onReject?: () => void;
    onEdit?: (scheduleId: number) => void; // 새로운 prop 추가
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
    userType,
    schedule,
    onSelectTime,
    onDelete,
    onApprove,
    onReject,
    onEdit,
}) => {

    const [isProcessing, setIsProcessing] = useState(false); // 작업 중인지 확인
    // 시간 선택 UI용 상태
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);

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


    const handleApprove = async () => {
        try {
            setIsProcessing(true);
            Alert.alert('확정 처리 중입니다...');
    
            if (onApprove) {
                await onApprove();
                Alert.alert('확정되었습니다!');
            }
        } catch (error) {
            console.error('Error approving schedule:', error);
            Alert.alert('Error', '확정 처리 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleReject = async () => {
        try {
            setIsProcessing(true);
            Alert.alert('거절 처리 중입니다...');
    
            if (onReject) {
                await onReject();
                Alert.alert('거절되었습니다!');
            }
        } catch (error) {
            console.error('Error rejecting schedule:', error);
            Alert.alert('Error', '거절 처리 중 오류가 발생했습니다.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTimeClick = (time: string) => {
        if (!selectedStartTime) {
          setSelectedStartTime(time);
        } else if (!selectedEndTime) {
          if (time > selectedStartTime) {
            setSelectedEndTime(time);
          } else {
            Alert.alert('Error', 'End time must be after start time.');
          }
        } else {
          // 이미 둘 다 선택됐다면 다시 누르면 초기화
          setSelectedStartTime(null);
          setSelectedEndTime(null);
        }
    };
    
    // 시간 선택 확정 버튼
    const handleConfirmTime = () => {
        if (!onSelectTime) return;
        if (!selectedStartTime || !selectedEndTime) {
        Alert.alert('Error', 'Start/End time is missing.');
        return;
        }
        onSelectTime(schedule.scheduleId, selectedStartTime, selectedEndTime);
        console.log(schedule.scheduleId, selectedStartTime, selectedEndTime)
        setSelectedStartTime(null);
        setSelectedEndTime(null);
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


            {/* 기능 버튼 */}
            <View style={ScheduleStyles.buttonGroup}>
                {isProcessing ? (
                    <ActivityIndicator size="large" color="#007bff" />
                        ) : (
                            <>
                                {schedule.status === '예약' && (
                                    <>
                                        {onApprove && (
                                            <TouchableOpacity
                                                style={[
                                                    ScheduleStyles.approveButton,
                                                    isProcessing ? ScheduleStyles.disabledButton : null,
                                                ]}
                                                onPress={handleApprove}
                                                disabled={isProcessing} // 버튼 비활성화
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
                                                disabled={isProcessing} // 버튼 비활성화
                                            >
                                                <Text style={ScheduleStyles.buttonText}>Reject</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
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

                {userType === 'customer' && (
                <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {availableTimes.map((time) => {
                    const isSelected =
                        selectedStartTime === time ||
                        (selectedStartTime &&
                        selectedEndTime &&
                        time >= selectedStartTime &&
                        time <= selectedEndTime);

                    return (
                        <TouchableOpacity
                        key={time}
                        style={[
                            {
                            margin: 4,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 4,
                            backgroundColor: isSelected ? '#007bff' : '#eee',
                            },
                        ]}
                        onPress={() => handleTimeClick(time)}
                        >
                        <Text style={{ color: isSelected ? '#fff' : '#333' }}>
                            {time.slice(0, 2)}
                        </Text>
                        </TouchableOpacity>
                    );
                    })}
                </View>
                {selectedStartTime && selectedEndTime && (
                    <TouchableOpacity
                    style={ScheduleStyles.approveButton}
                    onPress={handleConfirmTime}
                    >
                    <Text style={ScheduleStyles.buttonText}>
                        Confirm ({selectedStartTime} ~ {selectedEndTime})
                    </Text>
                    </TouchableOpacity>
                )}
                </View>
            )}
            </View>
        </View>
    );
};

export default ScheduleItem;