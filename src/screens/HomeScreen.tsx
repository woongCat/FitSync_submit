import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/RootNavigation';
import styles from '../style/styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

interface HomeScreenProps {
    navigation : HomeScreenNavigationProp
}

const HomeScreen : React.FC<HomeScreenProps> = ({navigation}) => {

    return (
        <View>
            <Text>home screen</Text>
        </View>
    );
};

export default HomeScreen;