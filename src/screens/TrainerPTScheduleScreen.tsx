import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Button,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTrainerSchedule } from "../context/TrainerPTScheduleContext";
import styles from "../style/styles"; // 스타일 가져오기

const TrainerPTScheduleScreen: React.FC = () => {
    const {
        schedules,
        fetchTrainerSchedules,
        acceptSchedule,
        rejectSchedule,
    } = useTrainerSchedule();

    const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택한 날짜
    const [confirmedSchedules, setConfirmedSchedules] = useState([]); // 확정된 스케줄
    const [pendingSchedules, setPendingSchedules] = useState([]); // 예약 요청 스케줄

    // 스케줄 데이터 초기 로드
    useEffect(() => {
        fetchTrainerSchedules;
    }, []);

    // 날짜 선택 핸들러
    const handleDateSelect = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
        filterSchedules(day.dateString);
    };

    // 선택한 날짜에 따라 스케줄 필터링
    const filterSchedules = (date: string) => {
        const confirmed = schedules.filter(
            (schedule) =>
                schedule.sessionDate === date && schedule.status === "확정"
        );
        const pending = schedules.filter(
            (schedule) =>
                schedule.sessionDate === date && schedule.status === "신청"
        );
        setConfirmedSchedules(confirmed);
        setPendingSchedules(pending);
    };

    // 예약 요청 수락
    const handleAccept = async (scheduleId: number) => {
        const success = await acceptSchedule(scheduleId);
        if (success) {
            Alert.alert("예약 수락 완료", "예약이 확정되었습니다.");
            filterSchedules(selectedDate!);
        }
    };

    // 예약 요청 거절
    const handleReject = async (scheduleId: number) => {
        const success = await rejectSchedule(scheduleId);
        if (success) {
            Alert.alert("예약 거절 완료", "예약이 거절되었습니다.");
            filterSchedules(selectedDate!);
        }
    };

    return (
        <View style={styles.contentContainer}>
            {/* 헤더 */}
            <View style={styles.topHeader}>
                <Text style={styles.headerText}>트레이너 스케줄</Text>
            </View>

            {/* 캘린더 */}
            <Calendar
                onDayPress={handleDateSelect} // 날짜 클릭 시 실행
                markedDates={{
                    [selectedDate || ""]: {
                        selected: true,
                        marked: true,
                        selectedColor: "blue",
                    },
                }}
            />

            {/* 확정된 예약 섹션 */}
            <Text style={styles.sectionTitle}>확정된 예약</Text>
            <FlatList
                data={confirmedSchedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.scheduleCard}>
                        <Text style={styles.scheduleText}>
                            고객 ID: {item.customerId}
                        </Text>
                        <Text style={styles.scheduleText}>
                            시간: {item.startTime} ~ {item.endTime}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        확정된 예약이 없습니다.
                    </Text>
                }
            />

            {/* 예약 요청 섹션 */}
            <Text style={styles.sectionTitle}>예약 요청</Text>
            <FlatList
                data={pendingSchedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.scheduleCard}>
                        <Text style={styles.scheduleText}>
                            고객 ID: {item.customerId}
                        </Text>
                        <Text style={styles.scheduleText}>
                            시간: {item.startTime} ~ {item.endTime}
                        </Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAccept(item.scheduleId)}
                            >
                                <Text style={styles.buttonText}>수락</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectButton}
                                onPress={() => handleReject(item.scheduleId)}
                            >
                                <Text style={styles.buttonText}>거절</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        대기 중인 예약 요청이 없습니다.
                    </Text>
                }
            />
        </View>
    );
};

export default TrainerPTScheduleScreen;