import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type ChooseOptionScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface ChooseOptionScreenProps {
    navigation : ChooseOptionScreenNavigationProp
}

const ChooseOptionScreen : React.FC<ChooseOptionScreenProps> = ({navigation}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Choose Option</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CameraShot')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('FileSearch')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Find file</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseOptionScreen;