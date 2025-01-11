
import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';
import { Gym } from './GymContext';

// Context와 Provider 설정
export interface Registration {
    gym : Gym;
    relatedName : string[];
    userType : string;
};

export interface RegistrationContextData {
    isLoading : boolean;
    registration : Registration;
};

export const RecordContext = createContext<RegistrationContextData>(
    {} as RegistrationContextData
);

export const RecordProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    return (
        <RecordContext.Provider
            value={{
                isLoading,
            }}
        >
            {children}
        </RecordContext.Provider>
    );
};