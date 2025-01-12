
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
    comment : string | null;
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
    updateRecordDate : (recordId:number, sessionDate : string, routines : Routine[]) => Promise<boolean>;
    updateRecordUserId : (recordId:number, sessionDate : string, sharedUserId : number) => Promise<boolean>;
    deleteRecordData : (recordId:number, sessionDate : string ) => Promise<boolean>;
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

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("reading records");

            // 요청 보내기
            const response = await axios.get(`${Config.API_URL}/record/read`, {headers: { Authorization: access_token }});

            // 응답 처리
            if (response.status) {
                // 응답 데이터를 Record[] 형태로 변환하기 전에 확인 및 변환 필요
                const data = response.data.data.map((item: any) => {
                    const updatedItem = {
                        ...item,
                        routines: item.routines.map((routine: any) => {
                            const updatedRoutine = {
                                ...routine,
                                reps: Array.isArray(routine.reps) ? routine.reps : [routine.reps],  // reps가 배열이 아닐 경우 배열로 변환
                                weight: Array.isArray(routine.weight) ? routine.weight : [routine.weight],  // weight가 배열이 아닐 경우 배열로 변환
                            };
                            return updatedRoutine;
                        }),
                    };
                    
                    return updatedItem;
                });

                setRecords(data);
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

    // Record 데이터를 생성하는 함수 (Create)
    const createRecordData = async (date : Date, time : Date, relatedName : string, routine : Routine[]) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("creating records");

            // SessionDate 데이터 생성
            const sessionDate = date.toISOString().split('T')[0] + ' '+ time.toTimeString().split(' ')[0];

            // routine 세부 내역 콘솔에 띄우기
            console.log("Routine Details:", routine);

            // 요청 보내기
            const response = await axios.post(`${Config.API_URL}/record/create`, { relatedName, sessionDate, routine }, {headers : { Authorization: access_token}});

            console.log(response.status);
            // 응답 처리
            if (response.status === 201) {
                Alert.alert("Success", "The record is successfully created.");
            } else {
                Alert.alert("Error", "Fail to create selected record.");
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
            return false;
        }
    };

    const updateRecordDate = async(recordId:number, sessionDate : string, routine : Routine[]) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("updating records");

            // routine 세부 내역 콘솔에 띄우기
            console.log("Routine Details:", routine);

            // 요청 보내기
            const response = await axios.put(`${Config.API_URL}/record/update`, { sessionDate, recordId, routine }, {headers : { Authorization: access_token}});

            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The record is successfully updated.");
            } else {
                Alert.alert("Error", "Fail to update selected record.");
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

    const updateRecordUserId = async(recordId:number, sessionDate : string, sharedUserId : number) : Promise<boolean> => {
        setIsLoading(true);

        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            console.log("updating record related ID");


            // 요청 보내기
            const response = await axios.put(`${Config.API_URL}/record/update/id`, { sessionDate, recordId, sharedUserId }, {headers : { Authorization: access_token}});

            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The record is successfully updated.");
            } else {
                Alert.alert("Error", "Fail to update selected record.");
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

    const deleteRecordData = async(recordId:number, sessionDate : string ) : Promise<boolean> => {
        setIsLoading(true);
        
        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
            }

            console.log("deleting record");

            // 요청 보내기
            const response = await axios.delete(`${Config.API_URL}/record/delete`, { data : { sessionDate, recordId }, headers : { Authorization: access_token}});
        
            // 응답 처리
            if (response.status === 200) {
                Alert.alert("Success", "The record is successfully deleted.");
            } else {
                Alert.alert("Error", "Fail to delete selected record.");
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
        <RecordContext.Provider
            value={{
                isLoading,
                records,
                fetchRecordData,
                createRecordData,
                updateRecordDate,
                updateRecordUserId,
                deleteRecordData,
            }}
        >
            {children}
        </RecordContext.Provider>
    );
};