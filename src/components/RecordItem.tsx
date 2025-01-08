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

    return (
        <TouchableOpacity style={styles.RecordCard} onPress={onPressRecordItem}>
            <View style={styles.RecordContents}>
                <Text style={styles.RecordHeader}> {record?.sessionDate} </Text>
                <Text style={styles.RecordDescription}> with {record?.trainerName} & {record?.customerName} </Text>
            </View>
            <TouchableOpacity style={styles.RecordDeleteBtn} onPress={onPressDeleteRecordItem}>
                <Text style={styles.RecordDeleteBtnText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
});

export default RecordItem;
