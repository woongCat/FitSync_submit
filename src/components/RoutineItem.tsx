import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Button } from "react-native";
import styles from "../style/styles";
import React from "react";
import FastImage from 'react-native-fast-image';
import { Routine } from "../context/RecordContext";

interface RoutineItemProps {
    routine: Routine;
    addNewSet: () => void;
}

const RoutineItem : React.FC<RoutineItemProps> = React.memo(({ routine, addNewSet }) => {
    
    return (
        <View style={styles.RoutineCard}>
            <Text style={styles.RoutineExerciseName}>{routine.exercise_name}</Text>
            <Text>Sets: {routine.sets}</Text>
            <Text>Reps: {routine.reps.join(', ')}</Text>
            <Text>Weight: {routine.weight.join(', ')}</Text>
            <Text>Comment: {routine.comment}</Text>
        </View>
    );
});

export default RoutineItem;