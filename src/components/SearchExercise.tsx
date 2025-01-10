import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView } from "react-native";
import styles from "../style/styles";
import { icon } from "../constants/icons";
import React, { useContext, useEffect, useState } from "react";
import { Exercise, ExerciseContext } from "../context/ExerciseContext";
import ExerciseItem from "./ExerciseItem";

interface SearchExerciseProps {
    onCancel : () => void; 
    onExerciseSelect: (exercise: Exercise) => void;  // exercise 선택 시 호출될 콜백 함수 추가
}

const SearchExercise : React.FC<SearchExerciseProps> = ({ onCancel, onExerciseSelect }) => {
    const [exerciseName, setExerciseName] = useState('');
    const {fetchExerciseData, exercises} = useContext(ExerciseContext);
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

    useEffect(() => {
        fetchExerciseData();
    },[]);

    useEffect(() => {
        // On-promise 기준
        // exerciseName과 selectedBodyPart를 기준으로 필터링
        const filtered = exercises.filter((exercise) => {
            // exerciseName 필터링
            const matchesExerciseName = exercise.name_en.toLowerCase().includes(exerciseName.toLowerCase());

            // selectedBodyPart 필터링
            const matchesBodyPart = selectedBodyPart ? exercise.bodypart_en === selectedBodyPart : true;

            return matchesExerciseName && matchesBodyPart; // 두 조건을 모두 만족하는 항목만 반환
        });   

        // 중복된 exercise_id를 제거하여 고유한 exercise만 남기기
        const uniqueExercises = filtered.filter((value, index, self) => 
            index === self.findIndex((t) => (
                t.exercise_id === value.exercise_id
            ))
        );
        setFilteredExercises(uniqueExercises); // 필터링된 결과 상태에 저장

        // RDS 기준
        // exerciseName과 selectedBodyPart를 기준으로 필터링
        // const filtered = exercises.filter((exercise) => {
        //     // exerciseName 필터링
        //     const matchesExerciseName = exercise.name.toLowerCase().includes(exerciseName.toLowerCase());

        //     // selectedBodyPart 필터링
        //     const matchesBodyPart = selectedBodyPart ? exercise.bodypart === selectedBodyPart : true;

        //     return matchesExerciseName && matchesBodyPart; // 두 조건을 모두 만족하는 항목만 반환
        // });   

        // // 중복된 exercise_id를 제거하여 고유한 exercise만 남기기
        // const uniqueExercises = filtered.filter((value, index, self) => 
        //     index === self.findIndex((t) => (
        //         t.id === value.id
        //     ))
        // );
        // setFilteredExercises(uniqueExercises); // 필터링된 결과 상태에 저장

    }, [exerciseName, selectedBodyPart, exercises]);

    // bodypartfilter 목록 (필요한 필터 항목들을 추가하세요)
    const bodyPartOptions = ['waist', 'upper arms', 'lower arms', 'shoulders', 'upper legs', 'lower legs', 'chest', 'back'];

    return (
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <TouchableOpacity
                    onPress={onCancel}
                >
                    {icon.Back({ color: '#050505' })}
                </TouchableOpacity>

                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search Exercise..."
                    keyboardType='default' 
                    autoCapitalize='none'
                    value={exerciseName}
                    onChangeText={setExerciseName}
                />
            </View>

            {/* Body part filter를 수평 스크롤로 보여주기 */}
            <View style={styles.bodyPartFilterContainer}>
                <Text style={styles.bodyPartFilterText}> Target : </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bodyPartOptions.map((bodyPart) => (
                        <TouchableOpacity
                            key={bodyPart}
                            style={[
                                styles.bodyPartButton,
                            ]}
                            onPress={() => setSelectedBodyPart(prev => prev === bodyPart ? '' : bodyPart)}
                        >
                        <Text
                            style={[
                                styles.bodyPartText,
                                selectedBodyPart === bodyPart && styles.selectedBodyPartText,
                            ]}
                        >
                            {bodyPart}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            
            <FlatList 
                data={filteredExercises}
                keyExtractor={(item) => item?.id + item?.exercise_id + item?.name}
                renderItem={({item}) => <ExerciseItem exercise={item} onPress={() => onExerciseSelect(item)} />}
            />

        </View>
    );
};

export default SearchExercise;