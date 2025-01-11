import React, { createContext, useState, ReactNode} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 스케줄 상세 정보
export interface ScheduleDetail {
    scheduleId: number; // 스케줄 ID
    trainerId: number; // 트레이너 ID
    trainerName: string; // 트레이너 이름
    customerId: number; // 고객 ID
    customerName: string; // 고객 이름
    startTime: string; // 운동 시작 시간
    endTime: string; // 운동 종료 시간
    status: string; // 상태 (예: 예약, 완료)
}

// 컨텍스트 프로퍼티
export interface PTScheduleContextProps {
    userType: string; // 사용자 유형 (예: trainer, customer)
    schedules: ScheduleDetail[]; // 스케줄 배열
    fetchMonthlySchedules: (year: number, month: number) => Promise<void>;
    fetchSchedules: (sessionDate: string) => Promise<ScheduleDetail[]>;
    addSchedule: (sessionDate : string, reservationInfo: {
        trainerId: number;
        startTime: string;
        endTime: string;
    }) => Promise<boolean>;
    updateSchedule: (
        scheduleId: number,
        newStatus: '확정' | '거절',
        sessionDate: string,
        trainerId: number,
        customerId: number,
        startTime: string,
        endTime: string
    ) => Promise<boolean>; // 매개변수 확장
    deleteSchedule: (scheduleId: number) => Promise<boolean>;
    isLoading: boolean;
    markedDates: Record<string, any>;
}

// 컨텍스트 생성
export const PTScheduleContext = createContext<PTScheduleContextProps>(
    {} as PTScheduleContextProps
);

// 트레이너 컨텍스트 프로바이더 구현
export const PTScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [scheduleData, setScheduleData] = useState<ScheduleDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [markedDates, setMarkedDates] = useState<Record<string, any>>({}); // 캘린더 마킹 데이터
    const [userType, setUserType] = useState(''); // userType 상태 추가
    const [schedules, setSchedules] =  useState<ScheduleDetail[]>([]);

    // 한달 치 예약 점으로 박을 수 있도록 날짜 가져오기
    const fetchMonthlySchedules = async (year: number, month: number): Promise<void> => {
        setIsLoading(true); // 로딩 상태 시작
        try {
            const access_token = await AsyncStorage.getItem('token'); // 토큰 가져오기
            if (!access_token) {
                Alert.alert('Error', 'Access token is missing.');
                setIsLoading(false);
                return;
            }

            // API 호출
            const response = await axios.get(`${Config.API_URL}/schedule/monthly_schedule`, {
                params: { year, month },
                headers: {
                    Authorization: `${access_token}`, // 인증 토큰 추가
                },
            });

            if (response.status === 200) {
                setMarkedDates(response.data.markedDates); // 캘린더 마킹 업데이트 (dot 정보)
            } else {
                Alert.alert('Error', 'Failed to fetch monthly schedules.');
            }
        } catch (error: any) {
            console.error('Error fetching monthly schedules:', error.response?.data || error.message);
            Alert.alert('Error', 'An error occurred while fetching monthly schedules.');
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    // 1. 특정 날짜의 스케줄 가져오기
    const fetchSchedules = async (sessionDate: string): Promise<ScheduleDetail[]> => {
        setIsLoading(true); // 로딩 시작
        try {
            const access_token = await AsyncStorage.getItem('token'); // 토큰 가져오기
            if (!access_token) {
                Alert.alert('Error', 'Access token is missing.');
                setIsLoading(false);
                return[];
            }

            const response = await axios.get(`${Config.API_URL}/schedule/read`, {
                params: { sessionDate },
                headers: {
                    Authorization: `${access_token}`, // 토큰 추가
                },
            });

            if (response.status === 200) {
                setUserType(response.data.userType); // 정확한 위치로 userType 설정
                return response.data.schedules; // 스케줄 데이터 반환
            } else {
                Alert.alert('Error', 'Failed to fetch schedules.');
                return[];
            }
        } catch (error: any) {
            console.error('Error fetching schedules:', error.message || error.response?.data);
            Alert.alert('Error', 'An error occurred while fetching schedules.');
            return[];
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    // 2. 새로운 스케줄을 추가하는 함수
    const addSchedule = async (sessionDate : string,
        reservationInfo: {
            trainerId: number;
            startTime: string;
            endTime: string;
          }): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) {
                console.error("Access token is missing");
                return false;
            }
            
            const { trainerId, startTime, endTime } = reservationInfo;

            console.log(sessionDate);
            console.log(reservationInfo);

            const createData = {
                sessionDate,
                reservationInfo: {
                    trainerId,
                    startTime,
                    endTime,
                },
            };

            const response = await axios.post(`${Config.API_URL}/schedule/create`, createData, {
                headers: {
                    Authorization: `${access_token}`
                },
            });

            if (response.status === 201) { // 201: Created
                const createdSchedule = response.data;
                setSchedules((prevSchedules) => [...prevSchedules, createdSchedule]);
                Alert.alert("Success", "Your reservation has been added.");
                return true;
            } else {
                console.error("Failed to add schedule");
                return false;
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.response) {
                // 서버가 오류 응답을 보냈을 때
                console.error('Server responded with error:', error.response.status); // 500 상태 코드
                console.error('Response data:', error.response.data); // 서버에서 반환한 데이터
            } else if (error.request) {
                // 요청이 서버로 전송되지 않았을 때
                console.error('No response received:', error.request);
            } else {
                // 요청을 설정하는 중에 오류가 발생했을 때
                console.error('Error setting up the request:', error.message);
            }
            return false;
        }
    };

    // 3. 특정 스케줄 상태 업데이트
    const updateSchedule = async (
        scheduleId: number,
        newStatus: '확정' | '거절',
        sessionDate: string,       // 스크린에서 전달받은 날짜
        trainerId: number,         // 스크린에서 전달받은 트레이너 ID
        customerId: number,        // 스크린에서 전달받은 고객 ID
        startTime: string,         // 스크린에서 전달받은 시작 시간
        endTime: string            // 스크린에서 전달받은 종료 시간
    ): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem('token');
            if (!access_token) {
                throw new Error('Access token is missing.');
            }

            // 요청 데이터 구성
            const updateData = {
                scheduleId,
                access_token,
                sessionDate,
                schedules: {
                    trainerId,
                    customerId,
                    startTime,
                    endTime,
                    status: newStatus,
                },
            };

            // API 요청
            const response = await axios.put(`${Config.API_URL}/schedule/update`, updateData, {
                headers: { Authorization: `${access_token}` },
            });

            return response.status === 200; // 성공 여부 반환
        } catch (error: any) {
            if (error.response?.status === 401) {
                Alert.alert('Error', 'Authentication failed. Please log in again.');
            } else if (error.response?.status === 500) {
                Alert.alert('Error', 'Server error. Please try again later.');
            } else {
                Alert.alert('Error', 'An unexpected error occurred.');
            }
            console.error('Error updating schedule:', error.response?.data || error.message);
            return false;
        }
    };

    // 4. 스케줄을 삭제하는 함수
    const deleteSchedule = async (scheduleId: number): Promise<boolean> => {
        try {
            const access_token = await AsyncStorage.getItem("token");
            if (!access_token) throw new Error('Access token is missing.');
            console.log(scheduleId);
            const response = await axios.delete(`${Config.API_URL}/schedule/delete`,{
                data : {scheduleId},
                headers: {
                    Authorization: `${access_token}`,
                },
            });

            if (response.status === 200) {
                setSchedules((prevSchedules) =>
                    prevSchedules.filter((schedule) => schedule.scheduleId !== scheduleId)
                );
                Alert.alert('Success', 'Your reservation has been canceled.');
                return true;
            } else {
                console.error('Failed to delete schedule');
                return false;
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.response) {
                // 서버가 오류 응답을 보냈을 때
                console.error('Server responded with error:', error.response.status); // 500 상태 코드
                console.error('Response data:', error.response.data); // 서버에서 반환한 데이터
            } else if (error.request) {
                // 요청이 서버로 전송되지 않았을 때
                console.error('No response received:', error.request);
            } else {
                // 요청을 설정하는 중에 오류가 발생했을 때
                console.error('Error setting up the request:', error.message);
            }
            return false;
        }
    };

    return (
        <PTScheduleContext.Provider
            value={{
                userType,
                schedules,
                fetchMonthlySchedules,
                fetchSchedules,
                addSchedule,
                updateSchedule,
                deleteSchedule,
                isLoading,
                markedDates,
            }}
        >
            {children}
        </PTScheduleContext.Provider>
    );
};