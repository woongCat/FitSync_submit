import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
import { Gym } from "../context/GymContext";

interface RegistrationItemProps {

    onPressChangeGym : () => void;
    onPressChangeTrainer : () => void;
}

const RegistrationItem : React.FC<RegistrationItemProps> = React.memo(({ gym, onPressChangeGym }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 추가
    
    // Option 버튼 클릭 시 모달 열기
    const handleChangenPress = () => {
        setIsModalVisible(true);
    };
    
    return (
        <View style={styles.RegistrationCard}>
            <Text style={styles.RegistrationHeader}> {gym?.name} </Text>
            <Text style={styles.RegistrationDescription}> {gym?.location} </Text>
            <Text style={styles.RegistrationDescription}> {gym?.phoneNumber} </Text>
            <TouchableOpacity style={styles.GymChangeBtn} onPress={onPressChangeGym}>
                <Text style={styles.GymChangeBtnText}>Change</Text>
            </TouchableOpacity>
        </View>

    );
});

const styles = StyleSheet.create({
    RegistrationCard : {
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
    RegistrationHeader : {
        fontSize : 16,
        fontWeight : 'bold',
        marginBottom : 5,
    },
    RegistrationDescription : {
        fontSize : 14,
        color: '#aaa',
    },
    GymChangeBtn : {
        position : 'absolute',
        top : 25,
        right : 10,
        backgroundColor : '#056edd',
        paddingHorizontal : 5,
        paddingVertical : 5,
        borderRadius : 4,
    },
    GymChangeBtnText : {
        color : '#fff',
        fontWeight : 'bold',
        fontSize : 14,
    },
});

export default RegistrationItem;