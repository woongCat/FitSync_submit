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

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface ProfileScreenProps {
    navigation : ProfileScreenNavigationProp
}

const ProfileScreen : React.FC<ProfileScreenProps> = ({navigation}) => {
    const {userName, signOut} = useContext(AuthContext);

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
        <View style={styles.contentContainer}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
                <TouchableOpacity onPress={handleLogOut} style={styles.LogOutBtn}>
                    <Text style={styles.LogOutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileScreen;