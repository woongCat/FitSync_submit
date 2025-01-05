import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from '../style/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type RoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface RoutineScreenProps {
    navigation : RoutineScreenNavigationProp
}

const RoutineScreen : React.FC<RoutineScreenProps> = ({navigation}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [ExerciseRecords, setExerciseRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    
    return (
        <View style={styles.contentContainer}>
            <Calendar
                onDayPress={day => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />

            {/*  render all the record */}

            <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => navigation.navigate('ChooseOption')}
            >
                <Text style={styles.addBtnText}>Add New</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RoutineScreen;