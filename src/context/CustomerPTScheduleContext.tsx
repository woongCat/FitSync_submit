import React, { createContext, useEffect, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "react-native-config";
import { Alert } from "react-native";

// Schedule 인터페이스 정의
export interface Schedule {
    scheduleId: number; // 스케줄 ID
    trainerId: number; // 트레이너 ID
    trainerName: string; // 트레이너 이름
    customerId: number; // 고객 ID
    customerName: string; // 고객 이름
    startTime: string; // 운동 시작 시간
    endTime: string; // 운동 종료 시간
    status: string; // 상태 (예: 예약, 완료)
}


// Context 데이터 구조 정의
export interface CustomerScheduleContextData {
    schedules: Schedule[];
    userType: string | null; // userType 추가
    fetchSchedules: (sessionDate : string) => Promise<boolean>;
    addSchedule: (sessionDate : string, reservationInfo: {
        trainerId: number;
        startTime: string;
        endTime: string;
    }) => Promise<boolean>;
    updateSchedule : (scheduleId: number, sessionDate : string, schedules : Schedule[]) => void;
    deleteSchedule: (scheduleId: number) => Promise<boolean>;
}

// Context 생성
export const CustomerScheduleContext = createContext<CustomerScheduleContextData>(
    {} as CustomerScheduleContextData
);

// Provider 구현
export const CustomerScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [userType, setUserType] = useState<string | null>(null); // userType 상태 추가

    useEffect(() => {
        const fetchUserType = async () => {
            const access_token = await AsyncStorage.getItem("token");
            if (access_token) {
                // 서버에서 userType 가져오기 (예제)
                const response = await axios.get(`${Config.API_URL}/customer/schedule/read`, {
                    headers: {
                        Authorization: `${access_token}`,
                    },
                });

                if (response.status === 200) {
                    setUserType(response.data.userType); // userType 설정
                } else {
                    console.error("Failed to fetch user type");
                }
            }
        };
        fetchUserType();
    }, []);

    // 1. 스케줄 데이터를 가져오는 함수
    const fetchSchedules = async (sessionDate : string): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                console.error("Access token is missing");
                return false;
            }

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
                const { userType, schedules } = response.data;
                setSchedules(response.data); // 서버에서 가져온 데이터를 상태에 저장
                console.log("User Type:", userType); // 필요 시 userType 출력
                return true;
            } else {
                console.error("Failed to fetch schedules");
                return false;
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
            return false;
        }
    };

    // 2. 새로운 스케줄을 추가하는 함수
    const addSchedule = async (sessionDate : string, reservationInfo: {
        trainerId: number;
        startTime: string;
        endTime: string;}): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                console.error("Access token is missing");
                return false;
            }

            const response = await axios.post(`${Config.API_URL}/customer/schedule/create`, schedules, {
                headers: {
                    Authorization: `${access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) { // 201: Created
                setSchedules((prevSchedules) => [...prevSchedules, response.data]); // 상태 업데이트
                Alert.alert("Success", "Your reservation has been added.");
                return true;
            } else {
                console.error("Failed to add schedule");
                return false;
            }
        } catch (error) {
            console.error("Error adding schedule:", error);
            Alert.alert("Error", "Failed to add the reservation. Please try again.");
            return false;
        }
    };

    const updateSchedule = async (
        scheduleId: number,
        sessionDate: string,
        schedules: Schedule[]
    ): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                console.error("Access token is missing");
                return false;
            }

            const data = {
                scheduleId,
                sessionDate,
                schedules,
            };

            const response = await axios.put(`${Config.API_URL}/customer/schedules/${scheduleId}`, data, {
                headers: {
                    Authorization: `${access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                // 로컬 상태 업데이트
                const updatedSchedules = schedules.map((schedule) =>
                    schedule.scheduleId === scheduleId
                        ? { ...schedule, ...data }
                        : schedule
                );
                setSchedules(updatedSchedules);
                Alert.alert("Success", "Your reservation has been updated.");
                return true;
            } else {
                console.error("Failed to update schedule");
                return false;
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
            Alert.alert("Error", "Failed to update the reservation. Please try again.");
            return false;
        }
    };

    // 4. 스케줄을 삭제하는 함수
    const deleteSchedule = async (scheduleId: number): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                console.error("Access token is missing");
                return false;
            }

            const response = await axios.delete(`${Config.API_URL}/customer/schedules/${scheduleId}`, {
                headers: {
                    Authorization: `${access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setSchedules((prevSchedules) =>
                    prevSchedules.filter((schedule) => schedule.scheduleId !== scheduleId)
                );
                Alert.alert("Success", "Your reservation has been canceled.");
                return true;
            } else {
                console.error("Failed to delete schedule");
                return false;
            }
        } catch (error) {
            console.error("Error deleting schedule:", error);
            Alert.alert("Error", "Failed to cancel the reservation. Please try again.");
            return false;
        }
    };

    // Context Provider
    return (
        <CustomerScheduleContext.Provider
            value={{
                schedules,
                userType,
                fetchSchedules,
                updateSchedule,
                addSchedule,
                deleteSchedule,
            }}
        >
            {children}
        </CustomerScheduleContext.Provider>
    );
};

// Custom Hook
export const useCustomerSchedule = (): CustomerScheduleContextData => {
    const context = useContext(CustomerScheduleContext);
    if (!context) {
        throw new Error("useCustomerSchedule must be used within a CustomerScheduleProvider");
    }
    return context;
};
