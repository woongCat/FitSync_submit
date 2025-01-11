import { SetStateAction, useContext, useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import styles from '../style/styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RecordContext } from '../context/RecordContext';
import RecordItem from '../components/RecordItem';
import { useIsFocused } from '@react-navigation/native';

type RoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface RoutineScreenProps {
    navigation : RoutineScreenNavigationProp
}

const RoutineScreen : React.FC<RoutineScreenProps> = ({navigation}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const [selectedDateRecord, setSelectedDateRecord] = useState(records);
    const isFocused = useIsFocused();

    // 모든 record에 대해 sessionDate를 기준으로 markedDates를 설정할 수 있게 날짜 배열 생성
    const markedDates = (Array.isArray(records) && records.length > 0? records  : []).reduce((acc, record) => {
        const dateString = record.sessionDate.split(' ')[0]; // "YYYY-MM-DD" 형식으로 변환
        acc[dateString] = { marked: true, selectedDotColor: 'blue' };
        return acc;
    }, {});

    useEffect(() => {
        console.log(isFocused);
        if (isFocused) {
            fetchRecordData();
        }

    }, [isFocused]);

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

    // deleteRecordData 함수 후에 selectedDateRecord에서 해당 항목 삭제
    const handleDeleteRecordItem = async (recordId: number, sessionDate: string) => {
        const result = await deleteRecordData(recordId, sessionDate); // 데이터 삭제 API 호출
        // 삭제가 성공적으로 이루어졌다면
        if (result) {
            // selectedDateRecord에서 해당 항목을 삭제
            setSelectedDateRecord(prevRecords => 
                prevRecords.filter(record => record.recordId !== recordId)
            );

            // 삭제 후 records를 새로 불러오기
            fetchRecordData(); 
        } else {
            // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
            console.log('Failed to delete record');
        }
    };
    
    return (
        <View style={styles.contentContainer}>
            <Calendar
                onDayPress={(day: { dateString: SetStateAction<Date>; }) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    ...markedDates,
                    [String(selectedDate)]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />

            {/*  render all the record */}
            <FlatList 
                data={selectedDateRecord}
                keyExtractor={(item) => item?.sessionDate}
                renderItem={({item}) => 
                    <RecordItem 
                        record={item}
                        onPressRecordItem={() => navigation.navigate('UpdateRoutine', { selectedRecord: item })}
                        onPressDeleteRecordItem={() => handleDeleteRecordItem(item?.recordId, item?.sessionDate)} 
                        onPressShareRecordItem={function (): void {
                            throw new Error('Function not implemented.');
                        }}                    
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
