// src/context/ExerciseContext.js

import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import Config from 'react-native-config';


// Context와 Provider 설정
interface RoutineContextData {
    userId : number;
    token : string;
    isLoading : boolean;
    recordId : number;
    session_date : string;
    exercise_id : number[];
    sets : number[];
    reps : number[];
    weight : number[];
    note : string;
    fetchExerciseData : (userId : number, session_date : String) => Promise<boolean>;
};

export const RoutineContext = createContext<RoutineContextData>(
    {} as RoutineContextData
);

export const RoutineProvider : React.FC<{children : ReactNode}> = ({children}) => {
  const [recordData, setRecordData] = useState<RoutineContextData[]>([]);
  const [loading, setLoading] = useState(false);

  // 운동 기록 가져오기 (Read)
  const fetchExerciseData = async(userId : number, session_date : String) : Promise<boolean> => {
    if (!userId || !session_date) return false;

    setLoading(true);

    try {
        const response = await axios.post(`${Config.API_URL}` + '/getRecord', {
            userId,
            session_date,
        });
        
        return true;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        setLoading(false);
    }
  };

  // 운동 기록 생성하기 (Create)
  const createExerciseData = async (date, exercise) => {
    setLoading(true);
    try {
      const response = await axios.post(`${Config.API_URL}` + '/create', {
        userId,
        date,
        exercise,
      });
      setRecordData((prevData) => [...prevData, response.data]); // 새 운동 기록 추가
    } catch (err) {
      setError('Failed to create exercise record');
    } finally {
      setLoading(false);
    }
  };

  // 운동 기록 업데이트하기 (Update)
  const updateExerciseData = async (id, updatedExercise) => {
    setLoading(true);
    try {
      const response = await axios.put(`${Config.API_URL}` + `/update/${id}`, updatedExercise);
      setRecordData((prevData) =>
        prevData.map((item) => (item.id === id ? response.data : item))
      ); // 업데이트된 운동 기록으로 데이터 갱신
    } catch (err) {
      setError('Failed to update exercise record');
    } finally {
      setLoading(false);
    }
  };

  // 운동 기록 삭제하기 (Delete)
  const deleteExerciseData = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${Config.API_URL}` + `/delete/${id}`);
      setRecordData((prevData) => prevData.filter((item) => item.id !== id)); // 삭제된 기록 제외
    } catch (err) {
      setError('Failed to delete exercise record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        exerciseData,
        loading,
        error,
        fetchExerciseData,
        createExerciseData,
        updateExerciseData,
        deleteExerciseData,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
