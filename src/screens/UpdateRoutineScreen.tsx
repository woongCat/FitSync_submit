import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type UpdateRoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface UpdateRoutineScreenProps {
    navigation : UpdateRoutineScreenNavigationProp
}

const UpdateRoutineScreen : React.FC<UpdateRoutineScreenProps> = ({navigation}) => {

    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit record</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Routine')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UpdateRoutineScreen;