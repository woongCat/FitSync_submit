import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Button,
    Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTrainerSchedule } from "../context/TrainerPTScheduleContext";
import styles from "../style/styles";

const TrainerPTScheduleScreen: React.FC = () => {
    const { schedules, fetchTrainerSchedules, updateTrainerSchedule } =
        useTrainerSchedule(); // Context에서 필요한 데이터와 함수 가져오기

    const [selectedDate, setSelectedDate] = useState<string | null>(null); // 선택한 날짜
    const [filteredSchedules, setFilteredSchedules] = useState([]); // 선택된 날짜의 스케줄
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태
    const [markedDates, setMarkedDates] = useState<any>({}); // 캘린더 마킹 상태
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null); // 선택한 스케줄
    const [modalVisible, setModalVisible] = useState(false); // 모달 상태

    // **추가된 fetchSchedulesByDate 함수**
    const fetchSchedulesByDate = async (sessionDate: string) => {
        try {
            setIsLoading(true); // 로딩 시작
            const access_token = await AsyncStorage.getItem('token'); // Access token 가져오기
            if (!access_token) {
                console.error("Access token is missing.");
                setIsLoading(false);
                return;
            }

            // API 요청
            const response = await axios.post(
                `${Config.API_URL}/schedule/read`, // API URL
                { sessionDate }, // 요청 본문에 날짜 전달
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`, // 인증 헤더 추가
                    },
                }
            );

            if (response.status === 200) {
                setFilteredSchedules(response.data.schedules); // 선택된 날짜의 스케줄 설정
                console.log("Fetched schedules for:", sessionDate);
            } else {
                console.error("Failed to fetch schedules for the selected date.");
            }
        } catch (error: any) {
            console.error("Error fetching schedules:", error.response?.data || error.message);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (day: { dateString: string }) => {
        const sessionDate = day.dateString; // 선택한 날짜 가져오기
        setSelectedDate(sessionDate); // 선택한 날짜 상태 업데이트
        fetchSchedulesByDate(sessionDate); // 선택한 날짜의 데이터 요청
    };

    // 예약 상세 보기
    const handleScheduleClick = (schedule: any) => {
        setSelectedSchedule(schedule);
        setModalVisible(true); // 모달 열기
    };

    return (
        <View style={styles.contentContainer}>
            {/* 헤더 */}
            <View style={styles.topHeader}>
                <Text style={styles.headerText}>트레이너 스케줄</Text>
            </View>

            {/* 로딩 스피너 */}
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

            {/* 캘린더 */}
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                    ...markedDates,
                    [selectedDate || ""]: {
                        selected: true,
                        marked: true,
                        selectedColor: "blue",
                    },
                }}
            />

            {/* 스케줄 리스트 */}
            <Text style={styles.sectionTitle}>선택한 날짜의 스케줄</Text>
            <FlatList
                data={filteredSchedules}
                keyExtractor={(item) => item.scheduleId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.scheduleCard}
                        onPress={() => handleScheduleClick(item)}
                    >
                        <Text style={styles.scheduleText}>
                            고객 이름: {item.customerName}
                        </Text>
                        <Text style={styles.scheduleText}>
                            시간: {item.startTime} ~ {item.endTime}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        선택한 날짜에 스케줄이 없습니다.
                    </Text>
                }
            />

            {/* 예약 상세 정보 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedSchedule && (
                            <>
                                <Text style={styles.modalText}>
                                    고객 이름: {selectedSchedule.customerName}
                                </Text>
                                <Text style={styles.modalText}>
                                    트레이너 이름: {selectedSchedule.trainerName}
                                </Text>
                                <Text style={styles.modalText}>
                                    시간: {selectedSchedule.startTime} ~{" "}
                                    {selectedSchedule.endTime}
                                </Text>
                                <Text style={styles.modalText}>
                                    상태: {selectedSchedule.status}
                                </Text>
                            </>
                        )}
                        <Button
                            title="닫기"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TrainerPTScheduleScreen;