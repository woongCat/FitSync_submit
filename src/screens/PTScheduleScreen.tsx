import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { PTScheduleContext } from '../context/PTScheduleContext';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import ScheduleItem from '../components/ScheduleItme.tsx';
import ScheduleStyles from '../style/ScheduleStyles';
import styles from '../style/styles';

const availableTimes = [
    '00:00:00','01:00:00','02:00:00','03:00:00','04:00:00','05:00:00',
    '06:00:00','07:00:00','08:00:00','09:00:00','10:00:00','11:00:00',
    '12:00:00','13:00:00','14:00:00','15:00:00','16:00:00','17:00:00',
    '18:00:00','19:00:00','20:00:00','21:00:00','22:00:00','23:00:00'
  ];

interface Props {
    weekView?: boolean;
}

const UnifiedScheduleScreen: React.FC<Props> = (props: Props) => {
    const {weekView} = props;

    const {
        schedules,
        userType,
        fetchMonthlySchedules,
        fetchSchedules,
        updateSchedule,
        addSchedule,
        deleteSchedule,
    } = useContext(PTScheduleContext);
    
    const theme = useRef({
        todayButtonTextColor: '#007bff',
      });

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({}); // 마킹된 날짜들
    const [isLoading, setIsLoading] = useState(false);
    const [agendaSections, setAgendaSections] = useState<any[]>([]); // AgendaList에 사용될 섹션 데이터 상태
    const [showAddModal, setShowAddModal] = useState(false);

    // 초기화
    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const todayString = today.toISOString().split('T')[0];

        setSelectedDate(todayString);

        // 한 달의 예약 정보 가져오기
        fetchMonthlySchedules(currentYear, currentMonth)
            .catch((error) => console.error('Failed to fetch monthly schedules:', error));

        // 오늘 날짜의 예약 정보 가져오기
        fetchSchedules(todayString)
            .then((list) => {
                setAgendaSections([
                    { title: todayString, data: list.length > 0 ? list : [] }
                ]);
            })
            .catch((error) => console.error('Failed to fetch today\'s schedules:', error));
    },[]);

    // 날짜 선택 처리
    const handleDateSelect = useCallback(
        async (day: { dateString: string }) => {
            const sessionDate = day.dateString;
            setIsLoading(true); // 로딩 상태 활성화
    
            try {
                // 선택된 날짜를 상태로 설정
                setSelectedDate(sessionDate);
    
                // 캘린더 마킹 초기화 후 업데이트
                setMarkedDates({
                    [sessionDate]: {
                        marked: true,
                        selected: true,
                        selectedColor: '#007bff',
                    },
                });
    
                // 해당 날짜의 스케줄을 가져와서 업데이트
                const schedules = await fetchSchedules(sessionDate); // 비동기 데이터 가져오기
    
                // agendaSections 업데이트
                setAgendaSections([
                    { title: sessionDate, data: schedules.length > 0 ? schedules : [] }
                ]);
            } catch (error) {
                console.error('Error in handleDateSelect:', error);
                Alert.alert(
                    'Error',
                    'Failed to fetch schedules for the selected date. Please try again.'
                );
            } finally {
                setIsLoading(false); // 로딩 상태 비활성화
            }
        },
    );

    // 예약 추가 함수 
    const handleAddSchedule = useCallback(
        (date: string, trainerId: number, sTime: string, eTime: string) => {
        if (!date || !sTime || !eTime) {
            Alert.alert('Error', 'Please complete all fields.');
            return;
        }
        console.log(date, trainerId, sTime)
        addSchedule(date, {
            trainerId,
            startTime: sTime,
            endTime: eTime,
        }).then((success) => {
            if (success) {
            Alert.alert('Success', 'Reservation added successfully!');
            fetchSchedules(date);
            } else {
            Alert.alert('Error', 'Failed to add reservation.');
            }
        });
        },
        [addSchedule, fetchSchedules]
    );

    const handleDeleteSchedule = useCallback(
        (scheduleId: number) => {
            Alert.alert('Cancel Reservation', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteSchedule(scheduleId).then((success) => {
                            if (success && selectedDate) {
                                fetchSchedules(selectedDate);
                            } else {
                                Alert.alert('Error', 'Failed to cancel reservation.');
                            }
                        });
                    },
                },
            ]);
        },
        [deleteSchedule, fetchSchedules, selectedDate]
    );

    return (
        <CalendarProvider
            date={agendaSections.length > 0 ? agendaSections[0].title : new Date().toISOString().split('T')[0]}
            showTodayButton
            theme={theme.current}
        >
        {weekView ? (
        <WeekCalendar markedDates={markedDates} firstDay={1} />
        ) : (
        <>
            <ExpandableCalendar
            markedDates={markedDates}
            onDayPress={(day) => {
                if (!isLoading) {
                handleDateSelect(day); 
                }
            }}
            onMonthChange={(date) => {
                if (!isLoading) {
                const year = date.year;
                const month = date.month;
                setIsLoading(true);
                fetchMonthlySchedules(year, month)
                    .catch((error) =>
                    console.error(`Failed to fetch data for ${year}-${month}:`, error)
                    )
                    .finally(() => setIsLoading(false));
                }
            }}
            theme={{
                selectedDayBackgroundColor: '#007bff',
                todayTextColor: '#007bff',
                arrowColor: '#007bff',
            }}
            firstDay={1}
            />
        </>
        )}
            
            <AgendaList
            sections={
                agendaSections.length > 0
                ? agendaSections
                : [{ title: 'No Data', data: [] }]
            }
            renderItem={({ item }) => (
                <ScheduleItem
                schedule={{
                    scheduleId: item.scheduleId,
                    trainerName: item.trainerName,
                    customerName: item.customerName,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    status: item.status,
                    agenda: item.agenda || [],
                }}
                onDelete={userType === 'customer' ? handleDeleteSchedule : undefined}
                onApprove={
                    userType === 'trainer'
                    ? () =>
                        updateSchedule(
                            item.scheduleId,
                            '확정',
                            selectedDate || '',
                            item.trainerId,
                            item.customerId,
                            item.startTime,
                            item.endTime
                        )
                    : undefined
                }
                onReject={
                    userType === 'trainer'
                    ? () =>
                        updateSchedule(
                            item.scheduleId,
                            '거절',
                            selectedDate || '',
                            item.trainerId,
                            item.customerId,
                            item.startTime,
                            item.endTime
                        )
                    : undefined
                }
                />
            )}
            sectionStyle={ScheduleStyles.section}
            ListEmptyComponent={<Text>No schedules available.</Text>}
            />
            {userType === 'customer' && (
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                        // 모달 열기
                        if (!selectedDate) {
                            Alert.alert('Error', 'Please select a date first.');
                            return;
                        }
                        setShowAddModal(true);
                    }}
                >
                    <Text style={{ color: 'white' }}>+ Add Schedule</Text>
                </TouchableOpacity>
            )}

            <Modal
                visible={showAddModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>Add New Schedule</Text>
                        <Text style={{ marginBottom: 8, color: '#666' }}>Date: {selectedDate}</Text>

                        <ScheduleItem
                            userType="customer"
                            schedule={{
                                scheduleId: -1,
                                trainerName: 'Unknown',
                                customerName: 'Customer',
                                startTime: '',
                                endTime: '',
                                status: '예약',
                                agenda: [],
                            }}
                            onSelectTime={(_id, start, end) => {
                                handleAddSchedule(selectedDate || '', 1, start, end);
                                setShowAddModal(false);
                            }}
                        />

                        {/* 추가로 "취소" 버튼도 하나 넣고 싶으면 여기에 */}
                        <TouchableOpacity
                            style={[styles.cancelButton, { marginTop: 10 }]}
                            onPress={() => setShowAddModal(false)}
                        >
                            <Text style={{ color: '#fff' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </CalendarProvider>
    );
};
export default UnifiedScheduleScreen;