import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import Config from "react-native-config";
import { Alert } from "react-native";

export interface TrainerSchedule {
    scheduleId: number;
    customerId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    status: string; // "확정", "신청"
}

export interface TrainerScheduleContextData {
    schedules: TrainerSchedule[];
    fetchTrainerSchedules: () => Promise<boolean>;
    acceptSchedule: (scheduleId: number) => Promise<boolean>;
    rejectSchedule: (scheduleId: number) => Promise<boolean>;
}

export const TrainerScheduleContext = createContext<TrainerScheduleContextData>(
    {} as TrainerScheduleContextData
);

export const TrainerScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [schedules, setSchedules] = useState<TrainerSchedule[]>([]);

    // 트레이너의 스케줄 데이터 가져오기
    const fetchTrainerSchedules = async (): Promise<boolean> => {
        try {
            const response = await axios.get(`${Config.API_URL}/trainer/schedule`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setSchedules(response.data);
            return true;
        } catch (error) {
            console.error("Error fetching trainer schedules:", error);
            Alert.alert("Error", "Failed to fetch schedules.");
            return false;
        }
    };

    // 예약 수락
    const acceptSchedule = async (scheduleId: number): Promise<boolean> => {
        try {
            await axios.put(`${Config.API_URL}/trainer/schedule/accept`, { scheduleId });
            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule.scheduleId === scheduleId
                        ? { ...schedule, status: "확정" }
                        : schedule
                )
            );
            return true;
        } catch (error) {
            console.error("Error accepting schedule:", error);
            Alert.alert("Error", "Failed to accept the schedule.");
            return false;
        }
    };

    // 예약 거절
    const rejectSchedule = async (scheduleId: number): Promise<boolean> => {
        try {
            await axios.put(`${Config.API_URL}/trainer/schedule/reject`, { scheduleId });
            setSchedules((prevSchedules) =>
                prevSchedules.filter((schedule) => schedule.scheduleId !== scheduleId)
            );
            return true;
        } catch (error) {
            console.error("Error rejecting schedule:", error);
            Alert.alert("Error", "Failed to reject the schedule.");
            return false;
        }
    };

    return (
        <TrainerScheduleContext.Provider
            value={{ schedules, fetchTrainerSchedules, acceptSchedule, rejectSchedule }}
        >
            {children}
        </TrainerScheduleContext.Provider>
    );
};

// Hook
export const useTrainerSchedule = (): TrainerScheduleContextData => {
    const context = useContext(TrainerScheduleContext);
    if (!context) {
        throw new Error("useTrainerSchedule must be used within a TrainerScheduleProvider");
    }
    return context;
};