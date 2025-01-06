import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../style/styles";
import React from "react";
import FastImage from 'react-native-fast-image';
import { Routine } from "../context/RoutineContext";
import { Exercise } from "../context/ExerciseContext";

interface RoutineItemProps {
    exercise_name : string;
    exercise_gif : string | null;
    //routine : Routine
}

const RoutineItem : React.FC<RoutineItemProps> = React.memo(({ exercise_name, exercise_gif }) => {
    return (
        <View>
            <Text>
                {exercise_name}
            </Text>
            <Text>
                {exercise_gif}
            </Text>
        </View>
    );
});

export default RoutineItem;