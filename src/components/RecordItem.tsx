import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Button, Modal } from "react-native";
import styles from "../style/styles";
import React, { useContext, useEffect, useState } from "react";
import { Record } from "../context/RecordContext";
import { AuthContext } from "../context/AuthContext";

interface RecordItemProps {
    record : Record;
    onPressRecordItem : () => void;
    onPressShareRecordItem : () => void;
    onPressDeleteRecordItem : () => void;
}

const RecordItem : React.FC<RecordItemProps> = React.memo(({ record, onPressRecordItem, onPressShareRecordItem, onPressDeleteRecordItem }) => {
    const {userName} = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 추가

    // trainerName, customerName 중에 빈 값 있는지 확인
    const isNameExist = record?.trainerName && record?.customerName;
    // trainerName과 customerName이 같을 때 하나만 표시하도록 처리
    const isNameSame = record?.trainerName === record?.customerName && record?.trainerName === userName;

    // Option 버튼 클릭 시 모달 열기
    const handleOptionPress = () => {
        setIsModalVisible(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <TouchableOpacity style={styles.RecordCard} onPress={onPressRecordItem}>
            <View style={styles.RecordContents}>
                <Text style={styles.RecordHeader}> {record?.sessionDate} </Text>
                <Text style={styles.RecordDescription}> 
                with {
                    // 1. trainerName, customerName, userName이 모두 같을 경우 userName만 띄우기
                    (isNameExist && isNameSame)
                    ? userName
                    : // 2. trainerName이 userName과 같으면 customerName만 표시
                    (record?.trainerName === userName)
                    ? record?.customerName
                    : // 3. customerName이 userName과 같으면 trainerName만 표시
                    (record?.customerName === userName)
                    ? record?.trainerName
                    : ''
                }
                </Text>
            </View>
            <TouchableOpacity style={styles.RecordOptionBtn} onPress={handleOptionPress}>
                <Text style={styles.RecordOptionBtnText}>Option</Text>
            </TouchableOpacity>

            {/* Option 모달 */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                onPressShareRecordItem();
                                handleCloseModal();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                onPressDeleteRecordItem();
                                handleCloseModal();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
                            <Text style={styles.modalCloseButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    );
});

export default RecordItem;
