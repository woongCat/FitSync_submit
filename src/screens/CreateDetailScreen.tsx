import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type CreateDetailScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface CreateDetailScreenProps {
    navigation : CreateDetailScreenNavigationProp
}

const CreateDetailScreen : React.FC<CreateDetailScreenProps> = ({navigation}) => {

    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create new record</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Routine')} style={styles.button}>
                <Text style={styles.bottonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateDetailScreen;