import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
    exercise_id : number;
    id : number;
    name : string;
    name_en : string;
    target : string;
    target_en : string;
    bodypart : string;
    bodypart_en : string;
    equipment : string | null;
    equipment_en : string | null;
    secondarymuscles : string | null;
    secondarymuscles_en : string | null;
    instructions : string | null;
    gifUrl : string | null;
}

export interface ExerciseContextData {
    exercises : Exercise[];
    fetchExerciseData : () => Promise<boolean>;
};

export const ExerciseContext = createContext<ExerciseContextData>(
    {} as ExerciseContextData
);

export const ExerciseProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const fetchExerciseData = async() : Promise<boolean> => {
        try {
            // AsyncStorage에서 userId,userType 값을 가져오기
            const access_token = await AsyncStorage.getItem('token');

            if (!access_token) {
                console.error('No token found in AsyncStorage.');
                setIsLoading(false);
                return false;
            }

            const result = await axios.get(`${Config.API_URL}/api/data/exercise`, {
                headers : {
                    'Content-Type': 'exercise/get-data',
                    Authorization : access_token,
                },
            });

            //console.log(result);

            setExercises(result.data);
            
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    return <ExerciseContext.Provider
                value={{ fetchExerciseData, exercises }}>
                {children}
            </ExerciseContext.Provider>;
};