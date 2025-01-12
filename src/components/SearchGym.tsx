import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import styles from "../style/styles";
import { icon } from "../constants/icons";
import React, { useContext, useEffect, useState } from "react";
import { Gym, GymContext } from "../context/GymContext";

interface SearchGymProps {
    onCancel : () => void; 
    onGymSelect: (selectedGym: Gym) => void;  // exercise 선택 시 호출될 콜백 함수 추가
}

const SearchGym : React.FC<SearchGymProps> = ({ onCancel, onGymSelect }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [gymName, setGymName] = useState('');
    const {fetchGymData, gyms} = useContext(GymContext);
    const [filteredGyms, setFilteredGyms] = useState(gyms);

    useEffect(() => {
        setIsLoading(true);

        fetchGymData();

        setIsLoading(false);
    },[]);

    useEffect(() => {
        // exerciseName과 selectedBodyPart를 기준으로 필터링
        const filtered = gyms.filter((gym) => {
            // exerciseName 필터링
            const matchesGymName = gym.gymName.toLowerCase().includes(gymName.toLowerCase());

            return matchesGymName ; // 조건을  만족하는 항목만 반환
        });   

        setFilteredGyms(filtered); // 필터링된 결과 상태에 저장

    }, [gymName, gyms]);

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

            {isLoading ? (
                <View style={{ flex : 1 , justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator size="large" color="grey" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <View style={{ flex : 1 }}>
                    {/* gym 목록을 FlatList로 표시 */}
                    <FlatList
                        data={filteredGyms} 
                        keyExtractor={(item) => item.gymId.toString()+item.gymName}  
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleGymSelect(item)}  // gym 선택 시 handleGymSelect 호출
                                style={styles.gymItem}
                            >
                                <Text style={styles.gymName}>{item.gymName}</Text>
                                <Text style={styles.gymLocation}>{item.gymLocation}</Text>
                                <Text style={styles.gymPhoneNumber}>{item.gymPhoneNumber}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

        </View>
    );
};

export default SearchGym;