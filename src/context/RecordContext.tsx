
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

// Context와 Provider 설정
export interface Routine{
    exercise_id : number;
    exercise_name : string; 
    sets : number;
    reps : number[];
    weight : number[];
    comment : string;
};

export interface Record {
    recordId : number;
    customerName : string;
    trainerName : string;
    sessionDate : string;
    routines : Routine[];
};

export interface RecordContextData {
    isLoading : boolean;
    records : Record[];
    fetchRecordData : () => Promise<boolean>;
    createRecordData : (date : Date, time : Date, relatedName : string, routines : Routine[]) => Promise<boolean>;
    updateRecordDate : (recordId:number, sessionDate : string, routines : Routine[]) => void;
    deleteRecordData : (recordId:number, sessionDate : string ) => void;
};

export const RecordContext = createContext<RecordContextData>(
    {} as RecordContextData
);

export const RecordProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [records, setRecords] = useState<Record[]>([]);
    
    // Record 데이터를 가져오는 함수 (Fetch)
    const fetchRecordData = async() : Promise<boolean> => {
        
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            // 요청 보내기
            const response = await axios.get(`${Config.API_URL}/record/read`, {params: { access_token }});

            // 응답 처리
            if (response.status) {
                const data = response.data;
                // TODO: data 맞춰서 저장하기
                setRecords(prevRecords => [...prevRecords, response.data]);

                console.log(data);
                console.log(response.data.routines);
            }

            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching routine data:', error);
            return false;
        }
    };

    // Record 데이터를 생성하는 함수 (Create)
    const createRecordData = async (date : Date, time : Date, relatedName : string, routines : Routine[]) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            // SessionDate 데이터 생성
            const sessionDate = date.toISOString().split('T')[0] + time.toTimeString().split(' ')[0];

            // 요청 보내기
            const response = await axios.post(`${Config.API_URL}/record/create`, { access_token, relatedName, sessionDate, routines });

            // 응답 처리
            if (response.status === 200) {
                // TODO: data -> recordId, session_date 필요하면 저장하기
                Alert.alert("Success", "The record is successfully created.");
            } else {
                Alert.alert("Error", "Fail to create selected record.");
            }

            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating routine data:', error);
            return false;
        }
    };

    const updateRecordDate = async(recordId:number, sessionDate : string, routines : Routine[]) : Promise<void> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            // 요청 보내기
            const response = await axios.put(`${Config.API_URL}/record/update`, { access_token, sessionDate, recordId, routines });

            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The record is successfully updated.");
            } else {
                Alert.alert("Error", "Fail to update selected record.");
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating routine data:', error);
        }
    };

    const deleteRecordData = async(recordId:number, sessionDate : string ) : Promise<void> => {
        setIsLoading(true);
        
        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');
            // 요청 보내기
            const response = await axios.delete(`${Config.API_URL}/record/delete`, { params : {access_token, sessionDate, recordId }});
        
            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The record is successfully deleted.");
            } else {
                Alert.alert("Error", "Fail to delete selected record.");
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error deleting routine data:', error);
        }
    };

    return (
        <RecordContext.Provider
            value={{
                isLoading,
                records,
                fetchRecordData,
                createRecordData,
                updateRecordDate,
                deleteRecordData,
            }}
        >
            {children}
        </RecordContext.Provider>
    );
};