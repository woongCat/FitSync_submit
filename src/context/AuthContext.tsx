import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import Config  from 'react-native-config'; // .env에서 변수를 가져옴

import { Platform } from 'react-native';
import RNFS from 'react-native-fs'; // ios 확인용 임포트


interface AuthContextData {
    token : string | null;
    isLoading : boolean;
    userId : string; //Trainer가 될 수도 있고, customer가 될 수도 있음
    dob : string;
    phoneNumber : string;
    userName : string;
    userType : string;
    isAuthenticated: boolean;
    signUp : (name : string, email : string, password : string, userType : string, dob : string, phoneNumber : string) => Promise<boolean>;
    signIn : (email : string, password : string, userType : string) => Promise<boolean>;
    signOut : () => Promise<void>;
    checkAuth : () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextData> ( 
    {} as AuthContextData
);

export const AuthProvider : React.FC<{children : ReactNode}> = ({children}) => {

    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setisAuthenticated] = useState(false);


    const checkAuth = async(): Promise<boolean> => {
        try {
            const getStoredToken = await AsyncStorage.getItem('token');
            const getStoredUserName = await AsyncStorage.getItem('userName');

            if (getStoredToken && getStoredUserName) {
                setToken(getStoredToken);
                setUserName(getStoredUserName);
                setisAuthenticated(true);
                return true;
            }
        } catch (e) {
            console.error(e);
            return false;
        } finally {
            setIsLoading(false);
        }
        return false;
    };

    useEffect(() => {
        checkAuth();
    });

    const signUp = async(name : string, email:string, password:string, userType : string, dob : string, phoneNumber : string) : Promise<boolean> => {
        try {
            const result = await axios.post(`${Config.API_URL}/signup`, {email, password, name, userType, dob, phoneNumber});

            if (result.status === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error:any) {
            console.error('Error: ', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details: ', error.response?.data);
            } else {
                const message = error.result?.data?.message || 'An unexpected error occurred.'
                console.error('Error: ', message)
            }
        };
        return false;
    };

    const signIn = async(email:string, password:string, userType : string) : Promise<boolean> => {
        try {
            const result = await axios.post(`${Config.API_URL}/login`, {email, password, userType}); 

            if (Platform.OS === 'ios') {
                console.log('AsyncStorage Directory:', `${RNFS.DocumentDirectoryPath}/RCTAsyncLocalStorage_V1`);
            }

            //console.log(result);
            if (result.status === 200) {
                Alert.alert('Success', `Welcome ${result.data.name}!`);
                // 여기 set 추가되는 만큼 logout에서 remove & null 처리 해줘야함
                setToken(result.data.access_token);
                await AsyncStorage.setItem('token', result.data.access_token);
                setUserName(result.data.name);
                await AsyncStorage.setItem('userName', result.data.name);
                setisAuthenticated(true);
                return true;
            } else {
                return false;
            }

        } catch (error: any) {
            console.error('An error occurred during sign-in:', error);
            console.log(Config.API_URL); 

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // 서버 응답이 있는 경우 (예: 4xx, 5xx 에러)
                    console.error('Server responded with an error:', error.response.data);
                    Alert.alert('Error', error.response.data?.message || 'Failed to sign in. Please try again.');
                } else if (error.request) {
                    // 요청은 보내졌으나 응답이 없는 경우
                    console.error('No response received from server:', error.request);
                    Alert.alert('Error', 'Unable to connect to the server. Please check your network connection.');
                } else {
                    // 요청 설정 중 문제가 발생한 경우
                    console.error('Error setting up the request:', error.message);
                    Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
                }
            } else {
                // Axios 외의 에러 처리
                console.error('An unknown error occurred:', error);
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
        }
        return false;
    };

    

    const signOut = async() : Promise<void> => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userName');
            setToken(null);
            setUserName('');
            setisAuthenticated(false);
        }catch (e) {
            console.error(e);
        }
    };

    if (isLoading) return <ActivityIndicator size={'large'} color={'red'}/>

    return <AuthContext.Provider 
                value={{token, userName, isLoading, isAuthenticated, signIn, signUp, signOut, checkAuth}}>
                {children}
            </AuthContext.Provider>;
}