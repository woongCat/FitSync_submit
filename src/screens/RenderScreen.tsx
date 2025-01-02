import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type RenderScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface RenderScreenProps {
    navigation : RenderScreenNavigationProp
}

const RenderScreen : React.FC<RenderScreenProps> = ({navigation}) => {

    // 서버로 보냈던 파일 저장 끝났다는 거 받으면 페이지 넘기기
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Rendering the image</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Routine')} style={styles.button}>
                <Text style={styles.bottonText}>Finish</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RenderScreen;