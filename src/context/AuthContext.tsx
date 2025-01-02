import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState, ReactNode, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import Config from "react-native-config";

const DB_API_URL = "https://onederthesea.pythonanywhere.com/"; //Config.API_URL;

interface AuthContextData {
    token : string | null;
    isLoading : boolean;
    userId : string| null;
    isAuthenticated: boolean;
    signUp : (name : string, email : string, password : string, userType : string) => Promise<boolean>;
    signIn : (email : string, password : string, userType : string) => Promise<boolean>;
    signOut : () => Promise<void>;
    checkAuth : () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextData> ( 
    {} as AuthContextData
);

export const AuthProvider : React.FC<{children : ReactNode}> = ({children}) => {

    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setisAuthenticated] = useState(false);

    const checkAuth = async(): Promise<boolean> => {
        try {
            const getStoredToken = await AsyncStorage.getItem('token');
            const getStoredUserId = await AsyncStorage.getItem('userId');

            if (getStoredToken && getStoredUserId) {
                setToken(getStoredToken);
                setUserId(getStoredUserId);
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
    }
    useEffect(() => {
        checkAuth();
    })

    const signUp = async(name : string, email:string, password:string, userType : string) : Promise<boolean> => {
        console.log(email, password, name, userType)
        try {
            let result;

            result = await axios.post(`${DB_API_URL}/signup`, {email, password, name, userType});

            console.log(result, 'result')

            if (result.status === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
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
            const result = await axios.post(`${DB_API_URL}/login`, {email, password, userType}); //TODO: URL 확인
            
            console.log(result, 'result')

            if (result.status === 200) {
                Alert.alert('Success', `Welcome ${result.data.name}!`);
                //await AsyncStorage.setItem('token', token);
                //setToken(token);
                //await AsyncStorage.setItem('userId', result.data.userId);
                //setUserId(userId);
                setisAuthenticated(true);
                return true;
            } else {
                return false;
            }

        } catch (error) {
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
            await AsyncStorage.removeItem('userId');
            setToken(null);
            setUserId(null);
            setisAuthenticated(false);
        }catch (e) {
            console.error(e);
        }
    };

    if (isLoading) return <ActivityIndicator size={'large'} color={'red'}/>

    return <AuthContext.Provider 
                value={{token, userId, isLoading, isAuthenticated, signIn, signUp, signOut, checkAuth}}>
                {children}
            </AuthContext.Provider>;
}