import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export interface AnalyticsContextData {
    data : [];
    fetchAnalyticsData : (context:string) => Promise<boolean>;
};

export const AnalyticsContext = createContext<AnalyticsContextData>(
    {} as AnalyticsContextData
);

export const AnalyticsProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState([]);

    const fetchAnalyticsData = async(context:string) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 token 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("reading analytics data")

            const result = await axios.get(`${Config.API_URL}/analytics/read`, {
                headers : {
                    'Content-Type': `${context}/get-data`,
                    Authorization: access_token,
                },
            });

            // 응답 처리
            if (result.status === 200) {
                const data = result.data;
                setData(data);
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

    return  <AnalyticsContext.Provider
                value={{ data, fetchAnalyticsData, }}>
                {children}
            </AnalyticsContext.Provider>;
};