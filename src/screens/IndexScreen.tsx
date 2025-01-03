import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigation';


type IndexScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Index'>

interface IndexScreenProps {
    navigation : IndexScreenNavigationProp
}

const IndexScreen : React.FC<IndexScreenProps> = ({navigation}) => {

    return (
        <View>
            <Text>index screen</Text>
        </View>
    );
};

export default IndexScreen;