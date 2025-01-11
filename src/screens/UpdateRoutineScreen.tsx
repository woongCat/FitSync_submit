import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RouteProp } from '@react-navigation/native';
import RoutineItem from '../components/RoutineItem';
import { useContext, useEffect, useState } from 'react';
import { RecordContext, Routine } from '../context/RecordContext';

type UpdateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>
type UpdateRoutineScreenRouteProp = RouteProp<RoutineStackParamList, 'UpdateRoutine'>;

interface UpdateRoutineScreenProps {
    navigation : UpdateRoutineScreenNavigationProp;
    route : UpdateRoutineScreenRouteProp;
};

const UpdateRoutineScreen : React.FC<UpdateRoutineScreenProps> = ({navigation, route}) => {
    const { selectedRecord } = route.params; // selectedRecord 값을 가져옵니다.
    const [routines, setRoutines] = useState(selectedRecord.routines); // 상태 관리 추가
    const { updateRecordDate } = useContext(RecordContext);

    const handleUpdateRoutine = (newRoutine : Routine) => {
        // 수정된 운동 데이터를 createdRoutine에 반영
        const updatedRoutines = routines.map((routine) =>
            routine.exercise_id === newRoutine.exercise_id ? newRoutine : routine
        );
        setRoutines(updatedRoutines); // 상태 업데이트
    };

    const handleDeleteExercise = (exercise_id: number) => {
        // exercise_id를 기준으로 routines 배열에서 해당 운동 삭제
        const updatedRoutines = routines.filter((routine: { exercise_id: number; }) => routine.exercise_id !== exercise_id);
        setRoutines(updatedRoutines); // 상태 업데이트
    };

    const handleRoutineConfirm = async() => {
        if (routines.length === 0) {
            Alert.alert('No data', 'Please add some exercises before confirming.');
            return;
        }

        const result = await updateRecordDate(selectedRecord.recordId, selectedRecord.sessionDate, routines);

        if (result) {
            navigation.navigate('RoutineDetail');
        } else {
            Alert.alert('Error', 'Fail to create new routine.');
        }
    }

    return (
        <View style={styles.container}>

            <FlatList 
                data={routines}
                keyExtractor={(item) => {return item?.exercise_id + item?.exercise_name + item?.sets;}}
                renderItem={({ item, index }) => (
                    <RoutineItem 
                        routine={item}
                        index={index} 
                        onUpdate={handleUpdateRoutine}
                        onDelete={handleDeleteExercise}                    
                    />
                )}
                contentContainerStyle={styles.RoutineContext}
            />

            <TouchableOpacity onPress={handleRoutineConfirm} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateRoutineScreen;