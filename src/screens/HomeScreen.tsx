import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View
} from 'react-native';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { RootStackParamList } from '../navigation/RootNavigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface HomeScreenProps {
    navigation : HomeScreenNavigationProp
}

const HomeScreen : React.FC = () => {

    return (
        <View>
            <Text>home screen</Text>
        </View>
    );
};

export default HomeScreen;