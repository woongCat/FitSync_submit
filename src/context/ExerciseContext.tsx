import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';

export interface Exercise {
    exercise_id : number;
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
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const fetchExerciseData = async() : Promise<boolean> => {
        try {

            const result = await axios.get(`${Config.API_URL}/api/data/exercise`, {
                headers : {
                    'Content-Type': 'exercise/get-data',
                    // TODO: 인증 헤더나 추가적인 헤더가 필요하면 여기에 추가
                    // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
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