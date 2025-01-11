import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView, StyleSheet } from "react-native";
import styles from "../style/styles";
import { icon } from "../constants/icons";
import React, { useContext, useEffect, useState } from "react";
import { Gym, GymContext } from "../context/GymContext";

interface SearchGymProps {
    onCancel : () => void; 
    onGymSelect: (selectedGym: Gym) => void;  // exercise 선택 시 호출될 콜백 함수 추가
}

const SearchGym : React.FC<SearchGymProps> = ({ onCancel, onGymSelect }) => {

    const [gymName, setGymName] = useState('');
    //const {fetchGymData, gyms} = useContext(GymContext);

    // 임시 gyms 데이터 설정
    const [gyms, setGyms] = useState<Gym[]>([
        {
            gymId: 1,
            gymName: 'Fit Hub',
            gymLocation: '123 Fit Street',
            gymPhoneNumber: '123-456-7890',
            gymTrainers: [
                { trainerName: 'John Doe', trainerSpeciality: 'Strength', trainerRecentAward: 'Best Trainer (2024)' },
                { trainerName: 'Jane Smith', trainerSpeciality: 'Cardio', trainerRecentAward: 'Top Cardio Trainer (2023)' },
            ],
            gymTotalCustomers : 5,
        },
        {
            gymId: 2,
            gymName: 'Powerhouse Gym',
            gymLocation: '456 Power Road',
            gymPhoneNumber: '987-654-3210',
            gymTrainers: [
                { trainerName: 'Alice Brown', trainerSpeciality: 'Yoga', trainerRecentAward: 'Best Yoga Trainer (2023)' },
                { trainerName: 'Bob White', trainerSpeciality: 'CrossFit', trainerRecentAward: 'Top CrossFit Trainer (2024)' },
            ],
            gymTotalCustomers : 2,
        },
        {
            gymId: 3,
            gymName: 'Elite Fitness',
            gymLocation: '789 Elite Avenue',
            gymPhoneNumber: '555-123-4567',
            gymTrainers: [
                { trainerName: 'Charlie Green', trainerSpeciality: 'Pilates', trainerRecentAward: 'Pilates Champion (2023)' },
            ],
            gymTotalCustomers : 10,
        },
    ]);

    useEffect(() => {
        //fetchGymData();
    },[]);

    // gym 항목을 선택했을 때 실행될 함수
    const handleGymSelect = (gym: Gym) => {
        onGymSelect(gym);  // 선택된 gym을 부모로 전달
    };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <TouchableOpacity
                    onPress={onCancel}
                >
                    {icon.Back({ color: '#050505' })}
                </TouchableOpacity>

                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search Gym ..."
                    keyboardType='default' 
                    autoCapitalize='none'
                    value={gymName}
                    onChangeText={setGymName}
                />
            </View>

            {/* gym 목록을 FlatList로 표시 */}
            <FlatList
                data={gyms.filter(gym => gym.gymName.toLowerCase().includes(gymName.toLowerCase()))} 
                keyExtractor={(item) => item.gymId.toString()+item.gymName}  
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleGymSelect(item)}  // gym 선택 시 handleGymSelect 호출
                        style={styles.gymItem}
                    >
                        <Text style={styles.gymName}>{item.gymName}</Text>
                        <Text style={styles.gymLocation}>{item.gymLocation}</Text>
                        <Text style={styles.gymTrainerCount}>No. of Trainers: {item.gymTrainers.length}</Text>
                    </TouchableOpacity>
                )}
            />

        </View>
    );
};

export default SearchGym;