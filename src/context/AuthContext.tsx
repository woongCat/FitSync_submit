import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState, ReactNode, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import Config  from "react-native-config"; // .env에서 변수를 가져옴

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

        } catch (error:any) {
            console.error('Error: ', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details: ', error.response?.data);
            } else {
                const message = error.result?.data?.message || 'An unexpected error occurred.'
                console.error('Error: ', message);
            }
        };
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