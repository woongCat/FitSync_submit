
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';
import { Gym } from './GymContext';

// Context와 Provider 설정
export interface Customer {
    customerId : number;
    customerName : string;
    customerPTType : number;
};

export interface Trainer {
    trainerId : number;
    trainerName : string;
    trainerSpeciality : string;
    trainerRecentAward : string; // "Title (Date)" 형식
    trainerRecentCertification : string; // "Name (Date)" 형식
    trainerSelected : boolean;
};

export interface RegistrationContextData {
    isLoading : boolean;
    userType : string;
    gymTrainers : Trainer[];
    gymCustomers : Customer[];
    gym : Gym | null;
    fetchRegistrationInfo : () => Promise<boolean>;
    updateRegistrationInfo : (updateType:string, updateData : number) => Promise<boolean>;
};

export const RegistrationContext = createContext<RegistrationContextData>(
    {} as RegistrationContextData
);

export const RegistrationProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userType, setUserType] = useState('');
    const [gym, setGym] = useState<Gym|null>(null);
    const [gymTrainers, setGymTrainers] = useState<Trainer[]>([]);
    const [gymCustomers, setGymCustomers] = useState<Customer[]>([]);
    
    // Record 데이터를 가져오는 함수 (Fetch)
    const fetchRegistrationInfo = async() : Promise<boolean> => {
        
        setIsLoading(true);

        try {
            // AsyncStorage에서 token 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("reading registration");

            // 요청 보내기
            const response = await axios.get(`${Config.API_URL}/registration/read`, {headers: { Authorization: access_token }});

            // 응답 처리
            if (response.status === 200) {
                // 응답 데이터를 각각 저장
                setUserType(response.data.data.userType);
                setGym(response.data.data.gym);
                setGymTrainers(response.data.data.gymTrainers);
                setGymCustomers(response.data.data.gymCustomers);
            }

            setIsLoading(false);
            return true;

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

    const updateRegistrationInfo = async(updateType:string, updateData : number) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("updating registration");

            // 요청 보내기
            const response = await axios.put(`${Config.API_URL}/registration/update`, { updateType, updateData  }, { headers: { Authorization: access_token } });

            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The change is successfully updated.");
            } else {
                Alert.alert("Error", "Fail to update the change.");
            }

            setIsLoading(false);
            return true;
        } catch (error:any) {
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
        }
        return false;
    };

    return (
        <RegistrationContext.Provider
            value={{
                isLoading,
                userType,
                gymTrainers,
                gymCustomers,
                gym,
                fetchRegistrationInfo,
                updateRegistrationInfo,
            }}
        >
            {children}
        </RegistrationContext.Provider>
    );
};