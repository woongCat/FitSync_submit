import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { Gym } from "../context/GymContext";
import SearchGym from "./SearchGym";
import { Trainer } from "../context/RegistrationContext";

interface GymInfoProps {
    gym : Gym | null;
    onPressChangeGymItem : (selectedGymId : number) => void;
}

const GymInfo : React.FC<GymInfoProps> = React.memo(({ gym, onPressChangeGymItem }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleGymSelect = (gym:Gym) => {
        onPressChangeGymItem(gym.gymId); 
        setIsModalVisible(false);
    };

    // gym null 상태 항상 확인
    return (
        <View style={{flex : 1}}>
            {gym ? (
                <View>
                    <View style={{flexDirection : 'row'}}>
                        <View>
                            <Text style={styles.gymTitle}>{gym.gymName}</Text>
                            <Text style={styles.gymPhoneNumber}>Tel. {gym.gymPhoneNumber}</Text>
                        </View>

                        <TouchableOpacity onPress={handleOpenModal} style={styles.changeButton}>
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={styles.locationLabel}>Location:</Text>
                        <Text style={styles.gymLocation}>{gym.gymLocation}</Text>
                        {/* TODO: }Add location using map  */} 
                    </View>
                </View>
            ) : (
                <View style={styles.centeredTextContainer}>
                    <Text style={styles.centeredText}>No Gym Information Available</Text>
                    <TouchableOpacity onPress={handleOpenModal} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Search gym to register</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* SearchGym 모달 */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <SearchGym 
                    onCancel={handleCloseModal} 
                    onGymSelect={(selectedGym:Gym) => handleGymSelect(selectedGym)} 
                />
            </Modal>
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
    gymTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    gymLocation: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    gymPhoneNumber: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    changeButton: {
        position : 'absolute',
        top : 15,
        right : 5,
        backgroundColor : '#056edd',
        paddingHorizontal : 10,
        paddingVertical : 5,
        borderRadius : 5,
    },
    changeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    addButton : {
        width : '60%',
        height : 40,
        backgroundColor : '#056edd',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,
        marginVertical : 10,
    },
    addButtonText : {
        fontSize : 16,
        fontWeight : 'bold',
        color: '#fff'
    },
    centeredTextContainer: {
        flex: 1, // View가 화면 전체를 차지하도록 함
        justifyContent: 'center', // 세로 방향으로 중앙 정렬
        alignItems: 'center', // 가로 방향으로 중앙 정렬
    },
    centeredText: {
        fontSize: 20,
        color: '#333',
    },
    trainerSelectContainer: {
        flexDirection: 'row', // 가로 방향으로 나란히 배치
        alignItems: 'center', // 세로 방향으로 가운데 정렬
        position: 'relative', // relative position을 사용하여 드롭다운 위치 조정
        zIndex: 1, // 드롭다운이 다른 컴포넌트 위에 표시되도록 zIndex 설정
    },
    trainerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10, // 라벨과 드롭다운 간 간격
    },
    trainerInfoContainer: {
        marginBottom : 20,
    },
    trainerInfoLabel: {
        fontSize: 14,
        marginVertical: 5,  // 각 정보 간 간격
    },
    customerInfoContainer : {
        marginVertical : 10,
    },
    locationLabel : {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
});

// pickerSelectStyles는 RNPickerSelect에서 사용하는 스타일입니다.
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        fontSize: 12,
        width: 230, // 드롭다운의 너비
    },
    inputAndroid: {
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        fontSize: 12,
        width: 230, // 드롭다운의 너비
    },
});

export default GymInfo;