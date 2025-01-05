import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RootStackParamList } from '../navigation/RootNavigation';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface HomeScreenProps {
    navigation : HomeScreenNavigationProp
}

const HomeScreen : React.FC = () => {
    const {userId, signOut} = useContext(AuthContext);
    
    return (
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userId}</Text>
            </View>
        </View>
    );
};

export default HomeScreen;