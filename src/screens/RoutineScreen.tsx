import { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from '../style/styles';

const RoutineScreen : React.FC = () => {
    const [selected, setSelected] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoutine, setNewRoutine] = useState('');
    
    return (
        <View style={styles.contentContainer}>
            <Calendar
                onDayPress={day => {
                    setSelected(day.dateString);
                }}
                markedDates={{
                    [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />
            <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add New</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RoutineScreen;