import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Button } from "react-native";
import styles from "../style/styles";
import React, { useContext, useEffect, useState } from "react";
import FastImage from 'react-native-fast-image';
import { Record } from "../context/RecordContext";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RecordItemProps {
    record : Record;
    onPressRecordItem : () => void;
    onPressDeleteRecordItem : () => void;
}

const RecordItem : React.FC<RecordItemProps> = React.memo(({ record, onPressRecordItem, onPressDeleteRecordItem }) => {
    const {userName} = useContext(AuthContext);
    // trainerName, customerName 중에 빈 값 있는지 확인
    const isNameExist = record?.trainerName && record?.customerName;
    // trainerName과 customerName이 같을 때 하나만 표시하도록 처리
    const isNameSame = record?.trainerName === record?.customerName && record?.trainerName === userName;

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
            <TouchableOpacity style={styles.RecordDeleteBtn} onPress={onPressDeleteRecordItem}>
                <Text style={styles.RecordDeleteBtnText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
});

export default RecordItem;
