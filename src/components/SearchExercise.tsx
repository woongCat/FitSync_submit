import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView } from "react-native";
import styles from "../style/styles";
import { icon } from "../constants/icons";
import React, { useContext, useEffect, useState } from "react";
import { ExerciseContext } from "../context/ExerciseContext";
import ExerciseItem from "./ExerciseItem";

interface SearchExerciseProps {
    bodypartfilter : string;
    // TODO: 나중에 targetfilter 도 추가하면 좋을 듯
    onCancel : () => void; 
}

type bodypartfilter = ['허리', '상완부', '어깨', '허벅지 위쪽', '하완부', '가슴', ''];

const SearchExercise : React.FC<SearchExerciseProps> = ({bodypartfilter, onCancel}) => {
    const [exerciseName, setExerciseName] = useState('');
    const {fetchExerciseData, exercises} = useContext(ExerciseContext);
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');

    useEffect(() => {
        fetchExerciseData();
    }, []);

    useEffect(() => {
        // exerciseName과 selectedBodyPart를 기준으로 필터링
        const filtered = exercises.filter((exercise) => {
            // exerciseName 필터링
            const matchesExerciseName = exercise.name.toLowerCase().includes(exerciseName.toLowerCase());

            // selectedBodyPart 필터링
            const matchesBodyPart = selectedBodyPart ? exercise.bodypart === selectedBodyPart : true;

            return matchesExerciseName && matchesBodyPart; // 두 조건을 모두 만족하는 항목만 반환
        });

        setFilteredExercises(filtered); // 필터링된 결과 상태에 저장
    }, [exerciseName, selectedBodyPart, exercises]);

    // bodypartfilter 목록 (필요한 필터 항목들을 추가하세요)
    const bodyPartOptions = ['허리', '상완부', '어깨', '허벅지 위쪽', '하완부', '가슴'];

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
                            onPress={() => setSelectedBodyPart(bodyPart)}
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
                keyExtractor={(item) => item?.exercise_id.toString()}
                renderItem={({item}) => <ExerciseItem exercise={item}/>}
            />

        </View>
    );
};

export default SearchExercise;