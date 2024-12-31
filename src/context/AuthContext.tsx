import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState, ReactNode, useEffect } from "react";
import { ActivityIndicator } from "react-native";

const API_URL = 'https://onederthesea.pythonanywhere.com/api/data/';

interface AuthContextData {
    //
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
        //console.log(email, password)
        try {
            let result;

            if (userType === 'trainer') {
                result = await axios.post('${API_URL/trainer}', {name, email, password}); //TODO: URL 확인
            } else {
                result = await axios.post('${API_URL/customer}', {name, email, password}); 
            }    
            console.log(result, 'result')

            if (result.data.status === 'success') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error: ', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details: ', error.response?.data);
            }
        };
        return false;
    };

    const signIn = async(email:string, password:string, userType : string) : Promise<boolean> => {
        try {
            const result = await axios.post('${API_URL/}', {email, password, userType}); //TODO: URL 확인
            console.log(result, 'result')

            const {token, userId, success} = result.data;
            if (success) {
                await AsyncStorage.setItem('token', token);
                setToken(token);
                await AsyncStorage.setItem('userId', userId);
                setUserId(userId);
                setisAuthenticated(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error: ', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details: ', error.response?.data);
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