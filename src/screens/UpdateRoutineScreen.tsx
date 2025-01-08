import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RouteProp } from '@react-navigation/native';

type UpdateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>
type UpdateRoutineScreenRouteProp = RouteProp<RoutineStackParamList, 'UpdateRoutine'>;

interface UpdateRoutineScreenProps {
    navigation : UpdateRoutineScreenNavigationProp;
    route : UpdateRoutineScreenRouteProp;
};

const UpdateRoutineScreen : React.FC<UpdateRoutineScreenProps> = ({navigation, route}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit record</Text>

            <TouchableOpacity onPress={() => navigation.navigate('RoutineDetail')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateRoutineScreen;