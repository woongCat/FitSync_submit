import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type FileSearchScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface FileSearchScreenProps {
    navigation : FileSearchScreenNavigationProp
}

const FileSearchScreen : React.FC<FileSearchScreenProps> = ({navigation}) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('FileSearch')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Find file</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FileSearchScreen;