import { useState } from 'react';
import {
    Text,
    View,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const ScheduleScreen : React.FC = () => {
    const [selected, setSelected] = useState('');
    
    return (
        <Calendar
            onDayPress={day => {
                setSelected(day.dateString);
            }}
            markedDates={{
                [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
            }}
        />
    );
};

export default ScheduleScreen;