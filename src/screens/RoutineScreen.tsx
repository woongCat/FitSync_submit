import { useState } from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const RoutineScreen : React.FC = () => {
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

export default RoutineScreen;