import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Gym {
    gymId : number;
    gymName : string;
    gymLocation : string;
    gymPhoneNumber : string;
}
export interface GymContextData {
    gyms : Gym[];
    fetchGymData : () => Promise<boolean>;
};

export const GymContext = createContext<GymContextData>(
    {} as GymContextData
);

export const GymProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [gyms, setGyms] = useState<Gym[]>([]);

    const fetchGymData = async() : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 token 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("reading gym data")

            const result = await axios.get(`${Config.API_URL}/gym/read`, {
                headers : {
                    'Content-Type': 'gym/get-data',
                    Authorization: access_token,
                },
            });

            // 응답 처리
            if (result.status === 200) {
                const data = result.data;
                setGyms(data.data);
            }

            setIsLoading(false);
            return true;
        } catch (error : any) {
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

    return  <GymContext.Provider
                value={{ gyms, fetchGymData, }}>
                {children}
            </GymContext.Provider>;
};