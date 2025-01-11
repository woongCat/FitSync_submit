import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView } from "react-native";
import styles from "../style/styles";
import { icon } from "../constants/icons";
import React, { useContext, useEffect, useState } from "react";
import { Exercise, ExerciseContext } from "../context/ExerciseContext";
import ExerciseItem from "./ExerciseItem";
import { Gym, GymContext } from "../context/GymContext";
import GymItem from "./GymItem";

interface SearchGymProps {
    onCancel : () => void; 
    onGymSelect: (gym: Gym) => void;  // exercise 선택 시 호출될 콜백 함수 추가
}

const SearchGym : React.FC<SearchGymProps> = ({ onCancel, onGymSelect }) => {

    const [gymName, setGymName] = useState('');
    const {fetchAllGymData, gyms} = useContext(GymContext);
    const [filteredGyms, setFilteredGyms] = useState(gyms);
    const [selectedArea, setSelectedArea] = useState<string>('');

    // 목록 (필요한 필터 항목들을 추가하세요)
    const filterOptions = ['', '', ''];

    useEffect(() => {
        fetchAllGymData();
    },[]);


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
                    placeholder="Search Gym..."
                    keyboardType='default' 
                    autoCapitalize='none'
                    value={gymName}
                    onChangeText={setGymName}
                />
            </View>

            {/* Body part filter를 수평 스크롤로 보여주기 */}
            <View style={styles.FilterContainer}>
                <Text style={styles.FilterText}> Area : </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filterOptions.map((area) => (
                        <TouchableOpacity
                            key={area}
                            style={[
                                styles.FilterButton,
                            ]}
                            onPress={() => setSelectedArea(prev => prev === area ? '' : area)}
                        >
                        <Text
                            style={[
                                styles.filterText,
                                selectedArea === area && styles.selectedFilterText,
                            ]}
                        >
                            {area}
                        </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            
            <FlatList 
                data={filteredGyms}
                keyExtractor={(item) => item?.gymId + item?.name}
                renderItem={({item}) => <View></View>}
            />

        </View>
    );
};

export default SearchGym;