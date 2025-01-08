import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
    TextInput,
    Button,
    Keyboard,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import SearchExercise from '../components/SearchExercise';
import { RouteProp } from '@react-navigation/native';
import { Exercise } from '../context/ExerciseContext';
import RoutineItem from '../components/RoutineItem';
import DatePicker from 'react-native-date-picker'
import { icon } from '../constants/icons';
import { Routine, RecordContext } from '../context/RecordContext';

type CreateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>
interface CreateRoutineScreenProps {
    navigation : CreateRoutineScreenNavigationProp
}

const CreateRoutineScreen : React.FC<CreateRoutineScreenProps> = ({navigation}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);  // 선택한 운동 목록을 저장
    const [createdRoutine, setCreatedRoutine] = useState<Routine[]>([]);  // 선택한 운동 목록을 저장
    const [selectedDate, setSelectedDate] = useState(new Date());  // 선택된 날짜 상태
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());  // 선택된 시간 상태
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const { createRecordData } = useContext(RecordContext);

    // 날짜 문자열에서 년 월 달 요일 추출해서 형식 변환
    const dateString = selectedDate.toISOString();
    const [year, month, date] = dateString.split('T')[0].split('-');
    const formattedDate = `${year}년 ${month}월 ${date}일`
    // 시간 문자열에서 시와 분을 추출하여 "시-분" 형식으로 변환
    const timeString = selectedDateTime.toTimeString();
    const [hours, minutes] = timeString.split(' ')[0].split(':'); // "14:30:00" -> ["14", "30"]
    const formattedTime = `${hours}시 ${minutes}분`; // "14시 30분"

    const handleAddExercise = (exercise: Exercise) => {
        // on-promise 기준
        // 중복된 운동이 있을 경우 추가하지 않음
        const isExerciseAlreadySelected = selectedExercises.some(selectedExercise => selectedExercise.exercise_id === exercise.exercise_id);

        if (!isExerciseAlreadySelected) {
            // 선택한 운동에 맞춰서 routine 추가
            const newRoutine : Routine = {
                exercise_id : exercise.exercise_id,
                exercise_name : exercise.name_en,
                sets : 1, // 기본값
                reps : [10], // 기본값
                weight : [0], // 기본값
                comment : '', // 기본값
            };

            setSelectedExercises(prevExercises => [...prevExercises, exercise]);  // 선택해둔 운동 추가

            setCreatedRoutine((prevRoutines) => [...prevRoutines, newRoutine]);  // routine 추가
        } else {
            Alert.alert('Duplicate', 'Selected Exercise is already in the list.');
        }

        // RDS 기준
        // 중복된 운동이 있을 경우 추가하지 않음
        // const isExerciseAlreadySelected = selectedExercises.some(selectedExercise => selectedExercise.id === exercise.id);

        // if (!isExerciseAlreadySelected) {
        //     setSelectedExercises(prevExercises => [...prevExercises, exercise]);  // 운동 추가
        // } else {
        //     Alert.alert('Duplicate', 'Selected Exercise is already in the list.');
        // }

        setShowModal(false);  // 운동을 선택한 후 모달을 닫음
    };

    const handleDatePickerOpen = () => {
        setOpenDatePicker(true);
    };

    const handleTimePickerOpen = () => {
        setOpenTimePicker(true);
    };

    const handleDateConfirm = (date:Date) => {
        setOpenDatePicker(false);
        setSelectedDate(date);
    };

    const handleTimeConfirm = (time:Date) => {
        setOpenTimePicker(false);
        setSelectedDateTime(time);
    };

    const handleRoutineConfirm = async() => {
        if (createdRoutine.length === 0) {
            Alert.alert('No data', 'Please add some exercises before confirming.');
            return;
        }
        
        // TODO: record 관련자 이름 넣기
        const relatedName = '';

        const result = await createRecordData(selectedDate, selectedDateTime, relatedName, createdRoutine);

        if (result) {
            navigation.navigate('RoutineDetail');
        } else {
            Alert.alert('Error', 'Fail to create new routine.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                {icon.Date({ color: '#000' })}
                <TouchableOpacity style={styles.dateInput} onPress={handleDatePickerOpen}>
                    <TextInput
                        value={formattedDate}
                        placeholder="Select a date"
                        editable={false}
                    />
                </TouchableOpacity>

                <DatePicker
                    modal
                    open={openDatePicker}
                    mode={"date"}
                    date={selectedDate}
                    onConfirm={handleDateConfirm}
                    onCancel={() => {
                        setOpenDatePicker(false)
                    }}
                />
                
                {icon.Time({ color: '#000' })}
                <TouchableOpacity style={styles.dateInput} onPress={handleTimePickerOpen}>
                    <TextInput
                        value={formattedTime}
                        placeholder="Select a Time"
                        editable={false}
                    />
                </TouchableOpacity>

                <DatePicker
                    modal
                    open={openTimePicker}
                    mode={"time"}
                    date={selectedDateTime}
                    onConfirm={handleTimeConfirm}
                    onCancel={() => {
                        setOpenTimePicker(false)
                    }}
                />
            </View>

            <FlatList 
                data={createdRoutine}
                keyExtractor={(item) => {return item?.exercise_id + item?.exercise_name;}}
                renderItem={({ item, index }) => (
                    <RoutineItem 
                        routine={item} 
                        index={index}
                        addNewSet={function (): void {
                            throw new Error('Function not implemented.');
                        } }                    />
                )}
                contentContainerStyle={styles.RoutineContext}
            />

            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addExerciseBtn}>
                <Text style={styles.addExerciseText}>+ add new exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRoutineConfirm} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType='slide'
                onRequestClose={() => setShowModal(false)}
            >
                <SearchExercise onCancel={() => setShowModal(false)} onExerciseSelect={handleAddExercise} />
            </Modal>
        </View>
    );
};

export default CreateRoutineScreen;
