import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';


interface ExerciseContextData {
    name : string;
    name_en : string;
    target : string;
    target_en : string;
    bodyPart : string;
    bodyPart_en : string;
    equipment : string | null;
    equipment_en : string | null;
    secondaryMuscles : string | null;
    secondaryMuscles_en : string | null;
    instructions : string | null;
    gifUrl : string | null;
    fetchExerciseData : (exerciseId : number) => Promise<Boolean>;
};

export const ExerciseContext = createContext<ExerciseContextData>(
    {} as ExerciseContextData
);

export const ExerciseProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [exerciseData, setExerciseData] = useState<ExerciseContextData[]>([]);
    const [name, setName] = useState('');
    const [name_en, setNameEN] = useState('');
    const [target, setTarget] = useState('');
    const [target_en, setTargetEN] = useState('');
    const [bodyPart, setBodyPart] = useState('');
    const [bodyPart_en, setBodyPartEN] = useState('');
    const [equipment, setEquipment] = useState('');
    const [equipment_en, setEquipmentEN] = useState('');
    const [secondaryMuscles, setSecondaryMuscles] = useState('');
    const [secondaryMuscles_en, setSecondaryMusclesEN] = useState('');
    const [instructions, setInstructions] = useState('');
    const [gifUrl, setGifUrl] = useState('');

    const fetchExerciseData = async(exerciseId : number) : Promise<Boolean> => {
        try {

            return true;
        } catch {

            return false;
        }
    };

    return <ExerciseContext.Provider
            value={{ name, name_en,
                    target, target_en, bodyPart, bodyPart_en, equipment, equipment_en,
                    secondaryMuscles, secondaryMuscles_en, instructions, gifUrl, fetchExerciseData }}>
            {children}
        </ExerciseContext.Provider>;
};