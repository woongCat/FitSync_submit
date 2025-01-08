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

type UpdateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>
type UpdateRoutineScreenRouteProp = RouteProp<RoutineStackParamList, 'UpdateRoutine'>;

interface UpdateRoutineScreenProps {
    navigation : UpdateRoutineScreenNavigationProp;
    route : UpdateRoutineScreenRouteProp;
};

const UpdateRoutineScreen : React.FC<UpdateRoutineScreenProps> = ({navigation, route}) => {
    const { selectedRecord } = route.params; // selectedRecord 값을 가져옵니다.

    return (
        <View style={styles.container}>

            <FlatList 
                data={selectedRecord}
                keyExtractor={(item) => {return item?.exercise_id + item?.exercise_name + item?.sets;}}
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

            <TouchableOpacity onPress={() => navigation.navigate('RoutineDetail')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateRoutineScreen;