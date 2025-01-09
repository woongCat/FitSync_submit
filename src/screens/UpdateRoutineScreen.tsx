import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RouteProp } from '@react-navigation/native';
import RoutineItem from '../components/RoutineItem';
import { useState } from 'react';

type UpdateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>
type UpdateRoutineScreenRouteProp = RouteProp<RoutineStackParamList, 'UpdateRoutine'>;

interface UpdateRoutineScreenProps {
    navigation : UpdateRoutineScreenNavigationProp;
    route : UpdateRoutineScreenRouteProp;
};

const UpdateRoutineScreen : React.FC<UpdateRoutineScreenProps> = ({navigation, route}) => {
    const { selectedRoutines } = route.params; // selectedRecord 값을 가져옵니다.
    const [routines, setRoutines] = useState(selectedRoutines); // 상태 관리 추가

    const handleDeleteExercise = (exercise_id: number) => {
        // exercise_id를 기준으로 routines 배열에서 해당 운동 삭제
        const updatedRoutines = routines.filter((routine: { exercise_id: number; }) => routine.exercise_id !== exercise_id);
        setRoutines(updatedRoutines); // 상태 업데이트
    };

    return (
        <View style={styles.container}>

            <FlatList 
                data={selectedRoutines}
                keyExtractor={(item) => {return item?.exercise_id + item?.exercise_name + item?.sets;}}
                renderItem={({ item, index }) => (
                    <RoutineItem 
                        routine={item}
                        index={index} 
                        onDelete={handleDeleteExercise}                    
                    />
                )}
                contentContainerStyle={styles.RoutineContext}
            />

            {/* TODO: onPress 행동 handleUpdateRoutine으로 변경해서 새로 저장된 루틴 서버로 보내주기 */}
            <TouchableOpacity onPress={() => navigation.navigate('RoutineDetail')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateRoutineScreen;