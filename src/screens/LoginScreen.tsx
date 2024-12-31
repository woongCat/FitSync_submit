import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Alert,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigation';
import { SetStateAction, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

interface LoginScreenProps {
    navigation : LoginScreenNavigationProp
}

const LoginScreen : React.FC<LoginScreenProps> = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const {signIn} = useContext(AuthContext);

    const handleUserType = (option: SetStateAction<string>) => {
        setUserType(option === userType ? '' : option); // 이미 선택된 옵션을 다시 클릭하면 해제
    };

    const handleLogIn = async () => {
        if(email && password && userType) {
            const success = await signIn(email, password, userType);
            if (success) {
                //do something
                Alert.alert('Success', '');
                navigation.navigate('Home');
            } else {
                Alert.alert('Log In failed', 'Please check your credentials and try again.');
            }
        } else {
            Alert.alert('Invalid Input', 'Please enter all information.');
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Log In</Text>
            <TextInput 
                placeholder='Email' 
                keyboardType='email-address' 
                autoCapitalize='none'
                style={styles.input} 
                value={email}
                onChangeText={setEmail}
            />
            <TextInput 
                placeholder='Password'
                secureTextEntry
                style={styles.input} 
                value={password}
                onChangeText={setPassword}
            />

            <View style={styles.checkboxRow}>
                <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleUserType('customer')}
                >
                <View style={[styles.checkbox, userType === 'customer' && styles.checked]}>
                    {userType === 'customer' && <View style={styles.innerChecked} />}
                </View>
                <Text style={styles.checkboxLabel}>Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleUserType('trainer')}
                >
                <View style={[styles.checkbox, userType === 'trainer' && styles.checked]}>
                    {userType === 'trainer' && <View style={styles.innerChecked} />}
                </View>
                <Text style={styles.checkboxLabel}>Trainer</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogIn} style={styles.button}>
                <Text style={styles.bottonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>New Here? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;