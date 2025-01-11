import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from "react-native";
import React, { useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
import { Trainer, Customer } from "../context/RegistrationContext";
import SearchGym from "./SearchGym";

interface ManageInforops {
    userType : string;
    relatedTrainers : Trainer[];
    relatedCustomers : Customer[];
    onPressChangeTrainer : (trainerId : number) => void;
    onPressDeleteCustomer : (customerId : number) => void;
}

const ManageInfo: React.FC<ManageInforops> = React.memo(({ userType, relatedTrainers = [], relatedCustomers = [], onPressChangeTrainer, onPressDeleteCustomer }) => {

    // 조건에 맞는 데이터를 가져오기
    const trainersToShow = userType === 'customer' ? relatedTrainers : [];
    const customersToShow = userType === 'trainer' ? relatedCustomers : [];

    // 선택된 트레이너와 가능한 트레이너 구분
    const selectedTrainer = trainersToShow.find(trainer => trainer.trainerSelected === true);
    const availableTrainers = trainersToShow.filter(trainer => trainer.trainerSelected === false);

    // 트레이너 변경 핸들러
    const handleChangeTrainer = (trainerId: number) => {
        Alert.alert(
            "Change Trainer",
            "Are you sure you want to change to this trainer?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => onPressChangeTrainer(trainerId), // 선택한 trainerId 전달
                },
            ]
        );
    };

    // 트레이너 변경 핸들러
    const handleDeleteCustomer = (customerId: number) => {
        Alert.alert(
            "Delete Customer",
            "Are you sure you want to Delete to this customer?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => onPressDeleteCustomer(customerId), // 선택한 trainerId 전달
                },
            ]
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {userType === 'customer' && (
                <View style={{ flex : 1}}>
                    {/* 현재 선택된 트레이너 표시 */}
                    <Text style={styles.sectionTitle}>Current Trainer:</Text>
                    {selectedTrainer && (
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTextName}>{selectedTrainer.trainerName}</Text>
                            <Text style={styles.itemTextDetail}>Speciality: {selectedTrainer.trainerSpeciality}</Text>
                            <Text style={styles.itemTextDetail}>Recent Award: {selectedTrainer.trainerRecentAward}</Text>
                            <Text style={styles.itemTextDetail}>Recent Certification: {selectedTrainer.trainerRecentCertification}</Text>
                        </View>
                    )}

                    {/* 가능한 트레이너들 */}
                    <Text style={styles.sectionTitle}>Available Trainers:</Text>
                    <Text style={styles.sectionDetail}>* Select trainer to change</Text>
                    <FlatList
                        data={availableTrainers}
                        keyExtractor={(item) => item.trainerId.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => handleChangeTrainer(item.trainerId)}>
                                <Text style={styles.itemTextName}>{item.trainerName}</Text>
                                <Text style={styles.itemTextDetail}>Speciality: {item.trainerSpeciality}</Text>
                                <Text style={styles.itemTextDetail}>Recent Award: {item.trainerRecentAward}</Text>
                                <Text style={styles.itemTextDetail}>Certification: {item.trainerRecentCertification}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {userType === 'trainer' && (
                <View style={{ flex : 1}}>
                    <Text style={styles.sectionTitle}>Current Customers</Text>
                    <Text style={styles.sectionDetail}>* Select customer to delete</Text>
                    <FlatList
                        data={customersToShow}
                        keyExtractor={(item) => item.customerId.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => handleDeleteCustomer(item.customerId)}>
                                <Text style={styles.itemTextName}>{item.customerName}</Text>
                                <Text style={styles.itemTextDetail}>Remaining PT Count: {item.customerPTType}</Text>
                                {/* PT Type에 따라 다른 내용 출력 가능 */}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionDetail: {
        fontSize: 14,
        marginBottom: 5,
        marginLeft: 5,
    },
    itemContainer: {
        padding: 12,
        backgroundColor: '#ebf5fb',
        marginBottom: 5,
        borderRadius: 8,
    },
    itemTextName: {
        fontSize: 14,
        fontWeight : 'bold',
        color: '#333',
        marginBottom: 4,
    },
    itemTextDetail: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#056edd',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ManageInfo;