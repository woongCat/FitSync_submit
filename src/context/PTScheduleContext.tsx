import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import Config from "react-native-config";
import { Alert } from 'react-native';

// Schedule 인터페이스 정의
export interface PTSchedule {
    scheduleId: string; // 스케쥴 고유 ID
    trainerId: string; // 트레이너 ID
    customerId: string; // 고객 ID
    sessionDate: string; // PT 세션 날짜 및 시간 (ISO 형식)
    startTime: string // 세션 시작 시간
    endTime: string // 세션 종료 시간
    status: string; // 상태 (예: 예약, 완료)
}

// Context 데이터 구조 정의
export interface PTScheduleContextData {
    schedules: PTSchedule[];
    fetchSchedules: () => Promise<boolean>;
    addSchedule: (newSchedule: Omit<PTSchedule, "scheduleId">) => Promise<boolean>;
    deleteSchedule: (scheduleId: string) => Promise<boolean>;
}

// Context 생성
export const PTScheduleContext = createContext<PTScheduleContextData>(
    {} as PTScheduleContextData
);

// Provider 구현
export const PTScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [schedules, setSchedules] = useState<PTSchedule[]>([]);

    // 스케줄 데이터를 가져오는 함수
    const fetchSchedules = async (): Promise<boolean> => {
        try {
            const result = await axios.get(`${Config.API_URL}/ptSchedule`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setSchedules(result.data);
            return true;
        } catch (error) {
            console.error("Error fetching schedules:", error);
            return false;
        }
    };

    // 새로운 스케줄을 추가하는 함수
    const addSchedule = async (newSchedule: Omit<PTSchedule, "scheduleId">): Promise<boolean> => {
        try {
            const result = await axios.post(`${Config.API_URL}/ptSchedule`, newSchedule, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // 새로 추가된 스케줄을 로컬 상태에 업데이트
            setSchedules((prevSchedules) => [...prevSchedules, result.data]);
            return true;
        } catch (error) {
            console.error("Error adding schedule:", error);
            Alert.alert("Error", "Failed to add the schedule. Please try again.");
            return false;
        }
    };

    // 스케줄을 삭제하는 함수
    const deleteSchedule = async (scheduleId: string): Promise<boolean> => {
        try {
            await axios.delete(`${Config.API_URL}/ptSchedule/${scheduleId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // 삭제된 스케줄을 로컬 상태에서 제거
            setSchedules((prevSchedules) =>
                prevSchedules.filter((schedule) => schedule.scheduleId !== scheduleId)
            );
            return true;
        } catch (error) {
            console.error("Error deleting schedule:", error);
            Alert.alert("Error", "Failed to delete the schedule. Please try again.");
            return false;
        }
    };

    return (
        <PTScheduleContext.Provider
            value={{ schedules, fetchSchedules, addSchedule, deleteSchedule }}
        >
            {children}
        </PTScheduleContext.Provider>
    );
};

// Context를 사용하는 Hook
export const usePTSchedule = (): PTScheduleContextData => {
    const context = useContext(PTScheduleContext);
    if (!context) {
        throw new Error("usePTSchedule must be used within a PTScheduleProvider");
    }
    return context;
};
