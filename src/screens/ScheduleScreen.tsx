import { useState, useEffect, SetStateAction } from 'react';
import { Text, View } from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import styles from '../style/styles';
import CustomerView from '../components/CustomerView';
import TrainerView from '../components/TrainerView';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScheduleScreen : React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    
    const getUserInfo = async() : Promise<void> => {
        // 더이상 useType 저장 안 함
        // 트레이너 및 고객 아이디가 필요함 어떻게 구성할까 고민중~
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <Calendar
            onDayPress={(day: { dateString: SetStateAction<string>; }) => {
                setSelectedDate(day.dateString);
            }}
            markedDates={{
                [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
            }}
        />
    );
};

export default ScheduleScreen;