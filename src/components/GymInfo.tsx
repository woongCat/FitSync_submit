import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import React, { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { Gym, Trainer } from "../context/GymContext";
import SearchGym from "./SearchGym";

interface GymInforops {
    gym : Gym | null;
    onPressChangeGymItem : (selectedGymId : number) => void;
}

const GymInfo : React.FC<GymInforops> = React.memo(({ gym, onPressChangeGymItem }) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

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
                        {/* 트레이너 선택 드롭다운 */}
                        {gym.gymTrainers.length > 0 && (
                            <View style={styles.trainerSelectContainer}>
                                <Text style={styles.trainerLabel}>Available Trainers:</Text>
                                
                                {/* 드롭다운 바로 아래에 표시될 수 있도록 */}
                                <RNPickerSelect
                                    onValueChange={(value) => setSelectedTrainer(value)}
                                    items={gym.gymTrainers.map((trainer) => ({
                                        label: trainer.trainerName,
                                        value: trainer,
                                    }))}
                                    value={selectedTrainer}
                                    placeholder={{ label: "Click here to see", value: null }}
                                    style={pickerSelectStyles}
                                />

                                
                            </View>
                        )}

                        {/* 선택된 트레이너 정보 표시 */}
                        {selectedTrainer && (
                            <View style={styles.trainerInfoContainer}>
                                <Text style={styles.trainerInfoLabel}>- Speciality: {selectedTrainer.trainerSpeciality}</Text>
                                <Text style={styles.trainerInfoLabel}>- Recent Award: {selectedTrainer.trainerRecentAward}</Text>
                            </View>
                        )}
                        
                    </View>
                    
                    <View>
                        <Text style={styles.locationLabel}>Location:</Text>
                        {/* TODO: }Add location using map  */} 
                    </View>
                </View>
            ) : (
                <View style={styles.centeredTextContainer}>
                    <Text style={styles.centeredText}>No Gym Information Available</Text>
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
        fontSize: 16,
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
    locationLabel : {
        fontSize: 16,
        fontWeight: 'bold',
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