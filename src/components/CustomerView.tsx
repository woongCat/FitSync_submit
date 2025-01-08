import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../style/styles';


const CustomerView = ({ selectedDate, setSelectedDate}) => {
    const handleDatePress = (day) => {
        setSelectedDate(day.dateString);  // 선택된 날짜 저장
        // 해당 날짜의 예약 가능한 시간 가져오기
        fetch(`/api/trainer/${trainerID}/availability/${day.dateString}`)
            .then(response => response.json())
            .then(data => setAvailableTimes(data));
    };

    const handleReservation = (time) => {
        // 예약 요청 API 호출
        fetch(`/api/reservation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                trainerID,
                date: selectedDate,
                time,
            }),
        }).then(response => {
            if (response.ok) Alert.alert('The reservation has completed.');
        });
    };

    return (
        <View>
            <Calendar
                onDayPress={handleDatePress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
            />
            <FlatList
                data={availableTimes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.timeSlot}>
                        <Text>{item}</Text>
                        <Button title="예약하기" onPress={() => handleReservation(item)} />
                    </View>
                )}
            />
        </View>
    );
};

export default CustomerView;