import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
import { Gym } from "../context/GymContext";

interface GymItemProps {
    gym : Gym | null;
    onPressChangeGymItem : () => void;
}

const GymItem : React.FC<GymItemProps> = React.memo(({ gym, onPressChangeGymItem }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // gym null 상태 항상 확인
    return (
        <View>
            <Text>Gym Item</Text>
        </View>

    );
});

const styles = StyleSheet.create({
    GymCard : {
        backgroundColor : '#ffffff',
        borderRadius : 8,
        padding : 16,
        marginHorizontal : 16,
        marginVertical : 8,
        shadowColor : '#000',
        shadowOffset : {
            width : 0,
            height : 2
        },
        shadowOpacity : 0.1,
        shadowRadius : 4,
        elevation : 5,
    },
});

export default GymItem;