import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 스케줄 상세 정보
interface ScheduleDetail {
    scheduleId: number; // 스케줄 ID
    trainerId: number; // 트레이너 ID
    trainerName: string; // 트레이너 이름
    customerId: number; // 고객 ID
    customerName: string; // 고객 이름
    startTime: string; // 운동 시작 시간
    endTime: string; // 운동 종료 시간
    status: string; // 상태 (예: 예약, 완료)
}

// 전체 스케줄 구조
interface Schedule {
    userType: string; // 사용자 유형 (예: trainer, customer)
    schedules: ScheduleDetail[]; // 스케줄 배열
}

// 컨텍스트 프로퍼티
interface TrainerPTScheduleContextProps {
    schedules: ScheduleDetail[]; // 스케줄 배열 (userType은 별도로 관리)
    fetchTrainerSchedules: (sessionDate: string) => Promise<void>; // 특정 날짜의 스케줄을 가져오는 함수
    updateTrainerSchedule: (scheduleId: number, newStatus: "확정" | "거절") => Promise<boolean>; // 특정 스케줄 상태 업데이트 함수
}

// 컨텍스트 생성
const TrainerPTScheduleContext = createContext<TrainerPTScheduleContextProps | undefined>(undefined);

// 컨텍스트 프로바이더 구현
export const TrainerPTScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [schedules, setSchedules] = useState<ScheduleDetail[]>([]); // 스케줄 상태

    // 특정 날짜의 스케줄 가져오기
    const fetchTrainerSchedules = async (sessionDate: string): Promise<void> => {
        try {
            const access_token = await AsyncStorage.getItem('token'); // Access token 가져오기
            if (!access_token) {
                console.error("Access token is missing.");
                return;
            }

            // API 요청
            const response = await axios.post(
                `${Config.API_URL}/schedule/read`, 
                { sessionDate }, // 요청 본문에 날짜 전달
                {
                    headers: {
                        Authorization: `${access_token}`, // 인증 헤더 추가
                    },
                }
            );

            if (response.status === 200) {
                setSchedules(response.data.schedules); // 스케줄 상태 업데이트
            } else {
                console.error("Failed to fetch schedules");
            }
        } catch (error: any) {
            console.error("Error fetching schedules:", error.response?.data || error.message);
        }
    };

    // 특정 스케줄 상태 업데이트
    const updateTrainerSchedule = async (scheduleId: number, newStatus: "확정" | "거절"): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                throw new Error("Access token is missing.");
            }

            const updateData = { scheduleId, status: newStatus };

            // API 요청
            const response = await axios.put(`${Config.API_URL}/record/update`, updateData, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            return response.status === 200;
        } catch (error: any) {
            console.error("Error updating schedule:", error.response?.data || error.message);
            return false;
        }
    };

    return (
        <TrainerPTScheduleContext.Provider
            value={{
                schedules,
                fetchTrainerSchedules,
                updateTrainerSchedule,
            }}
        >
            {children}
        </TrainerPTScheduleContext.Provider>
    );
};

// 커스텀 훅
export const useTrainerSchedule = () => {
    const context = useContext(TrainerPTScheduleContext);
    if (!context) {
        throw new Error("useTrainerSchedule must be used within a TrainerPTScheduleProvider");
    }
    return context;
};