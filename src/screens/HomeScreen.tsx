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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

interface HomeScreenProps {
    navigation : HomeScreenNavigationProp
}

const HomeScreen : React.FC<HomeScreenProps> = ({navigation}) => {

    //const {userId, token, signOut} = useContext(AuthContext);
    //console.log(userId, token, 'userId, token');

    const {signOut} = useContext(AuthContext);

    const handleLogOut = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            {
                text : 'Cancel', 
                style : 'cancel',
            },
            {
                text : 'Logout', 
                onPress : async() => {
                    await signOut();
                    navigation.replace('Login');
                }
            }
        ])
    };

    return (
        <View>
            <TouchableOpacity onPress={handleLogOut} style={styles.button}>
                <Text style={styles.bottonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;