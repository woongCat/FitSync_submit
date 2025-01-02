import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigation';


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