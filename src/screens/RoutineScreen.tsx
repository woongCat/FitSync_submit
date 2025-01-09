import { SetStateAction, useContext, useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from '../style/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RecordContext } from '../context/RecordContext';
import RecordItem from '../components/RecordItem';

type RoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface RoutineScreenProps {
    navigation : RoutineScreenNavigationProp
}

const RoutineScreen : React.FC<RoutineScreenProps> = ({navigation}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const [selectedDateRecord, setSelectedDateRecord] = useState(records);

    // 모든 record에 대해 sessionDate를 기준으로 markedDates를 설정할 수 있게 날짜 배열 생성
    const markedDates = (Array.isArray(records) && records.length > 0? records  : []).reduce((acc, record) => {
        const dateString = record.sessionDate.split(' ')[0]; // "YYYY-MM-DD" 형식으로 변환
        acc[dateString] = { marked: true, selectedDotColor: 'blue' };
        return acc;
    }, {});

    useEffect(() => {
        if (selectedDate && records.length > 0) {
            // selectedDate와 sessionDate 비교
            const filteredRecords = records.filter(record => {
                const recordDate = new Date(record.sessionDate);
                const selectedDateObject = new Date(selectedDate);

                // 날짜가 같은지 비교 (년도, 월, 일만 비교)
                return (
                    recordDate.getFullYear() === selectedDateObject.getFullYear() &&
                    recordDate.getMonth() === selectedDateObject.getMonth() &&
                    recordDate.getDate() === selectedDateObject.getDate()
                );
            });

            setSelectedDateRecord(filteredRecords); // 필터링된 records를 상태에 저장
        }
    }, [selectedDate, records]);
    
    return (
        <View style={styles.contentContainer}>
            <Calendar
                onDayPress={(day: { dateString: SetStateAction<string>; }) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />

            {/*  render all the record */}
            <FlatList 
                data={selectedDateRecord}
                keyExtractor={(item) => item?.sessionDate}
                renderItem={({item}) => 
                    <RecordItem 
                        record={item} 
                        onPressRecordItem={() => 
                            navigation.navigate('UpdateRoutine', {selectedRoutines : item.routines})
                        }
                        onPressDeleteRecordItem = {() =>
                            deleteRecordData(item?.recordId, item?.sessionDate)
                        } 
                    />
                }
            />
            
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
