import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../style/styles';

const TrainerView = ({ selectedDate, setSelectedDate,}) => {
    const handleDatePress = (day) => {
        setSelectedDate(day.dateString);
    };

    const handleAcceptRequest = (requestID) => {
        // 예약 수락 API 호출
        fetch(`/api/reservation/${requestID}/accept`, { method: 'POST' })
            .then(response => {
                if (response.ok) Alert.alert('예약이 확정되었습니다.');
            });
    };

    return (
        <View>
            <Calendar
                onDayPress={handleDatePress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'green' },
                }}
            />
            <Text>확정된 예약:</Text>
            <FlatList
                data={reservations.filter((res) => res.date === selectedDate)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.timeSlot}>
                        <Text>{item.time} - {item.customerName}</Text>
                    </View>
                )}
            />
            <Text>예약 요청:</Text>
            <FlatList
                data={pendingRequests.filter((req) => req.date === selectedDate)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.timeSlot}>
                        <Text>{item.time} - {item.customerName}</Text>
                        <Button title="수락하기" onPress={() => handleAcceptRequest(item.id)} />
                    </View>
                )}
            />
        </View>
    );
};
export default TrainerView;