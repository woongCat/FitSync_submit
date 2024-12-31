import { useContext } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigation';
import styles from '../style/styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

interface ProfileScreenProps {
    navigation : ProfileScreenNavigationProp
}

const ProfileScreen : React.FC<ProfileScreenProps> = ({navigation}) => {
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
                <Text style={styles.bottonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;