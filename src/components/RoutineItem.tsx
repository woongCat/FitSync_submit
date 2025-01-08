import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Button } from "react-native";
import styles from "../style/styles";
import React from "react";
import FastImage from 'react-native-fast-image';
import { Routine } from "../context/RecordContext";

interface RoutineItemProps {
    routine: Routine;
    index : number;
    addNewSet: () => void;
}

const RoutineItem : React.FC<RoutineItemProps> = React.memo(({ routine, index, addNewSet }) => {
    
    return (
        <View style={styles.RoutineCard}>
            <View style={styles.RoutineCardRow}>
                <View style={styles.RoutineHeader}>
                    <Text style={styles.RoutineExerciseName}>{index+1}. {routine.exercise_name}</Text>
                    <Text>Reps&</Text>
                </View>     
                    {/* TODO: 나중에 uri 수정*/}
                <FastImage source={{ uri: "https://mir-s3-cdn-cf.behance.net/projects/original/fe8318108677535.Y3JvcCw5MDAsNzAzLDAsMTkz.gif", priority: FastImage.priority.normal, }} style={styles.RoutineExerciseImage} resizeMode={FastImage.resizeMode.stretch}/>
            </View>
                
            <Text>Sets: {routine.sets}</Text>
            
            <Text>Weight: {routine.weight.join(', ')}</Text>
            <Text style={styles.RoutineLabel}>Comment: </Text>
            <TextInput style={styles.RoutineComment} placeholder="Add comment" value={routine.comment}/>
            <TouchableOpacity style={styles.addSetsBtn} onPress={addNewSet}>
                <Text style={styles.addSetsText}>+ add new set</Text>
            </TouchableOpacity>
        </View>
    );
});

export default RoutineItem;