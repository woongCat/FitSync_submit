import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { RootStackParamList } from '../navigation/RootNavigation';
import { SetStateAction, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>

interface SignUpScreenProps {
    navigation : SignUpScreenNavigationProp
}

const SignUpScreen : React.FC<SignUpScreenProps> = ({navigation}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const {signUp} = useContext(AuthContext);

    const handleUserType = (option: SetStateAction<string>) => {
        setUserType(option === userType ? '' : option); // 이미 선택된 옵션을 다시 클릭하면 해제
    };
    
    const handleSignUp = async () => {
        if(name && email && password && userType) {
            const success = await signUp(name, email, password, userType);
            if (success) {
                //do something
                Alert.alert('Success', 'Account created successfully.\nPlease Log in.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Sign Up failed', 'Please try again with a different email.');
            }
        } else {
            Alert.alert('Invalid Input', 'Please enter all information.');
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <TextInput 
                placeholder='Name' 
                keyboardType='default' 
                autoCapitalize='none'
                style={styles.input} 
                value={name}
                onChangeText={setName}
            />
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

            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                <Text style={styles.bottonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Aleardy have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;