import { View, Text, TouchableOpacity } from "react-native";
import { Exercise } from "../context/ExerciseContext";
import styles from "../style/styles";
import React from "react";
import FastImage from 'react-native-fast-image';

interface ExerciseItemProps {
    exercise : Exercise
    onPress : () => void;
}

const ExerciseItem : React.FC<ExerciseItemProps> = React.memo(({ exercise, onPress }) => {
    return (
        <TouchableOpacity style={styles.exerciseCard} onPress={onPress}>
            {/* TODO: 나중에 uri 수정*/}
            <FastImage source={{ uri: "https://mir-s3-cdn-cf.behance.net/projects/original/fe8318108677535.Y3JvcCw5MDAsNzAzLDAsMTkz.gif", priority: FastImage.priority.normal, }} style={styles.searchExerciseImage} resizeMode={FastImage.resizeMode.stretch}/>
            <View style={styles.exerciseCardContent}>    
                <Text style={styles.exerciseName} numberOfLines={1}> {exercise?.name} </Text>
                <Text style={styles.exercisePart}> {exercise?.bodypart_en} - {exercise?.target_en}  </Text>
            </View>
        </TouchableOpacity>

    );
});

export default ExerciseItem;