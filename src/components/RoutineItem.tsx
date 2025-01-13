import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Button, Alert } from "react-native";
import styles from "../style/styles";
import React, { useEffect, useState } from "react";
import FastImage from 'react-native-fast-image';
import { Routine } from "../context/RecordContext";

interface RoutineItemProps {
    routine: Routine;
    index : number;
    onUpdate : (updatedRoutine : Routine) => void; // 현재 랜더링 된 routine이 업데이트되면 부모에게 알리는 콜백
    onDelete: (exercise_id: number) => void; // 삭제된 운동을 부모에게 알리는 콜백
}

const getMaxRepsFromRoutine = (routine: Routine): number => {
    // reps 배열에서 가장 큰 값을 찾기
    const maxRep = Math.max(...routine.reps);

    return Math.max(maxRep);
};

const getMaxWeightFromRoutine = (routine: Routine): number => {
    // weight 배열에서 가장 큰 값을 찾기
    const maxWeight = Math.max(...routine.weight);

    return Math.max(maxWeight);
};

const RoutineItem : React.FC<RoutineItemProps> = React.memo(({ routine, index, onUpdate, onDelete }) => {
    
    const [maxRep, setMaxRep] = useState(getMaxRepsFromRoutine(routine));  // maxRep 상태 추가
    const [maxWeight, setMaxWeight] = useState(getMaxWeightFromRoutine(routine));  // maxWeight 상태 추가

    const [currentSets, setCurrentSets] = useState(routine.sets); // sets 수를 관리할 상태 추가
    const [reps, setReps] = useState<number[]>([...routine.reps]); // reps 상태 관리
    const [weight, setWeight] = useState<number[]>([...routine.weight]); // weight 상태 관리
    const [comment, setComment] = useState(routine.comment); // weight 상태 관리
    const [isChanged, setIsChanged] = useState(false); // 상세 내역 변경 확인 상태 관리

    const minValue = 0;  // 최소값
    const maxValue = 999; // 최대값
    const maxSets = 10; // 최대 세트 수 제한

    // routine의 세부 내용이 바뀌면 routine update
    useEffect(() => {
        const newRoutine : Routine = {
            exercise_id : routine.exercise_id,
            exercise_name : routine.exercise_name,
            sets : currentSets,
            reps : reps, 
            weight : weight,
            comment : comment,
            exercise_gifUrl : routine.exercise_gifUrl
        };

        onUpdate(newRoutine);
        setIsChanged(false);
    }, [isChanged]);

    // reps나 weight가 바뀔 때마다 maxRep와 maxWeight를 업데이트
    useEffect(() => {
        setMaxRep(getMaxRepsFromRoutine({ ...routine, reps }));  // 업데이트된 reps로 maxRep 계산
        setMaxWeight(getMaxWeightFromRoutine({ ...routine, weight }));  // 업데이트된 weight로 maxWeight 계산
    }, [reps, weight]); // reps와 weight가 변경될 때마다 호출

    const handleAddNewSet = () => {
        if (currentSets < maxSets) {  // 현재 세트 수가 최대 세트 수보다 적을 경우에만 추가
            setCurrentSets(prevSets => prevSets + 1); // sets 수를 증가시킴
            setReps(prevReps => [...prevReps, 0]); // 새로운 set의 reps 추가
            setWeight(prevWeight => [...prevWeight, 0]); // 새로운 set의 weight 추가
        } else {
            // 최대 세트 수에 도달했을 때 알림을 표시하거나, 버튼을 비활성화 할 수 있음
            Alert.alert('Exceed maximum', `You cannot add more than ${maxSets} sets.`);
        }
        setIsChanged(true);
    };

    const updateValue = (setIndex: number, type: 'reps' | 'weight', value: number) => {
        if (type === 'reps') {
            const updatedReps = [...reps];
            updatedReps[setIndex] = value;
            setReps(updatedReps); // reps 상태를 업데이트
        } else {
            const updatedWeight = [...weight];
            updatedWeight[setIndex] = value;
            setWeight(updatedWeight); // weight 상태를 업데이트
        }
        setIsChanged(true);
    };

    const handleInputChange = (text: string, setIndex: number, type: 'reps' | 'weight') => {
        const newValue = parseInt(text);
        if (!isNaN(newValue)) {
            if (newValue < minValue) {
                // 값이 최소값보다 작을 경우
                updateValue(setIndex, type, minValue);
            } else if (newValue > maxValue) {
                // 값이 최대값보다 클 경우
                updateValue(setIndex, type, maxValue);
            } else {
                // 유효한 값이면 해당 값 업데이트
                updateValue(setIndex, type, newValue);
            }
        } else {
            updateValue(setIndex, type, 0);
        }
    };

    const handlePlusBtn = (setIndex: number, type: 'reps' | 'weight') => {
        const value = type === 'reps' ? reps[setIndex] : weight[setIndex];
        const newValue = Math.min(value + 1, maxValue);
        updateValue(setIndex, type, newValue); // 값 증가
    };

    const handleMinusBtn = (setIndex: number, type: 'reps' | 'weight') => {
        const value = type === 'reps' ? reps[setIndex] : weight[setIndex];
        const newValue = Math.max(value - 1, minValue); // 최소값을 0으로 설정
        updateValue(setIndex, type, newValue); // 값 감소
    };

    const handleDeleteSet = (setIndex: number) => {
        // reps와 weight 배열에서 해당 setIndex에 해당하는 값들을 삭제
        const updatedReps = reps.filter((_, index) => index !== setIndex);
        const updatedWeight = weight.filter((_, index) => index !== setIndex);
        
        setReps(updatedReps);  // reps 배열 상태 업데이트
        setWeight(updatedWeight);  // weight 배열 상태 업데이트

        setCurrentSets(prevSets => prevSets - 1);  // set 수 감소
        
        setIsChanged(true);
    }

    const handleDeleteExercise = () => {
        onDelete(routine.exercise_id); // 부모 컴포넌트에게 해당 운동을 삭제하도록 알림
    };

    return (
        <View style={styles.RoutineCard}>
            <View style={styles.RoutineCardRow}>
                <View style={styles.RoutineHeader}>
                    <Text style={styles.RoutineExerciseName}>{index+1}. {routine.exercise_name}</Text>
                    <Text style={styles.RoutineSubText}>Max. Reps : {maxRep} </Text>
                    <Text style={styles.RoutineSubText}>Max. Weight : {maxWeight} kg</Text>
                </View>     
                    {/* TODO: 나중에 uri 수정*/}
                <FastImage source={{ uri: routine.exercise_gifUrl, priority: FastImage.priority.normal, }} style={styles.RoutineExerciseImage} resizeMode={FastImage.resizeMode.stretch}/>
            </View>
                
            <View style={styles.RoutineCardRow}>
                <View style={styles.RoutineEmptyContainer}>
                    <Text style={styles.RoutineDetailText}></Text>
                </View>
                <View style={styles.RoutineSetContainer}>
                    <Text style={styles.RoutineDetailText}>Set</Text>
                </View>     
                <View style={styles.RoutineRepsContainer}>
                    <Text style={styles.RoutineDetailText}>Reps</Text>
                </View>
                <View style={styles.RoutineWeightContainer}>
                    <Text style={styles.RoutineDetailText}>Weight</Text>
                </View> 
            </View>

            {Array.from({ length: currentSets  }).map((_, setIndex) => (
                <View key={`${routine.exercise_id}-${setIndex}`} style={styles.RoutineCardRow}>
                    <View style={styles.RoutineEmptyContainer}>
                        <TouchableOpacity style={styles.deleteSetsBtn} onPress={() => handleDeleteSet(setIndex)}>
                            <Text style={{fontSize : 14,color: '#d43108', marginRight : 5,}}>X</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.RoutineSetContainer}>
                        <Text style={{ fontSize: 15 }}>{setIndex + 1}</Text>
                    </View>

                    {/* Reps */}
                    <View style={styles.RoutineRepsContainer}>
                        <TouchableOpacity style={styles.editNumBtn} onPress={() => handleMinusBtn(setIndex, 'reps')}>
                            <Text style={styles.editNumBtnText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.RepsAndWeightInputBox}
                            placeholder="0"
                            value={reps[setIndex] !== undefined ? reps[setIndex].toString() : '0'}
                            keyboardType="numeric"
                            onChangeText={(text) => handleInputChange(text, setIndex, 'reps')}
                        />
                        <TouchableOpacity style={styles.editNumBtn} onPress={() => handlePlusBtn(setIndex, 'reps')}>
                            <Text style={styles.editNumBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Weight */}
                    <View style={styles.RoutineWeightContainer}>
                        <TouchableOpacity style={styles.editNumBtn} onPress={() => handleMinusBtn(setIndex, 'weight')}>
                            <Text style={styles.editNumBtnText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.RepsAndWeightInputBox}
                            placeholder="0"
                            value={weight[setIndex] !== undefined ? weight[setIndex].toString() : '0'}
                            keyboardType="numeric"
                            onChangeText={(text) => handleInputChange(text, setIndex, 'weight')}
                        />
                        <TouchableOpacity style={styles.editNumBtn} onPress={() => handlePlusBtn(setIndex, 'weight')}>
                            <Text style={styles.editNumBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.addSetsBtn} onPress={handleAddNewSet} disabled={currentSets > maxSets}>
                <Text style={{fontSize: 14, color: currentSets >= maxSets ? '#ccc' : '#056edd'}}>+ Add new set</Text>
            </TouchableOpacity>

            <Text style={styles.RoutineLabel}>Comment: </Text>
            <TextInput 
                style={styles.RoutineComment} 
                placeholder="Add comment" 
                value={comment ?? ''}
                keyboardType="default"
                onChangeText={(text) => { setComment(text); setIsChanged(true);}}
            />

            <TouchableOpacity style={styles.addSetsBtn} onPress={handleDeleteExercise}>
                <Text style={{fontSize : 14,color: '#d43108',}}>Delete this exercise</Text>
            </TouchableOpacity>

        </View>
    );
});

export default RoutineItem;