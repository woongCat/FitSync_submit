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
import DatePicker from 'react-native-date-picker';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>

interface SignUpScreenProps {
    navigation : SignUpScreenNavigationProp
}

const SignUpScreen : React.FC<SignUpScreenProps> = ({navigation}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState(new Date()); // 생일 상태 추가
    const [dob, setDoB] = useState(''); // 생일 상태 추가
    const [phoneNumber, setPhoneNumber] = useState(''); // 핸드폰 번호 상태 추가
    const [phoneNumberPrefix, setPhoneNumberPrefix] = useState(''); // 앞자리
    const [phoneNumberMid, setPhoneNumberMid] = useState(''); // 중간자리
    const [phoneNumberSuffix, setPhoneNumberSuffix] = useState(''); // 뒷자리
    const [userType, setUserType] = useState('');
    const [openDatePicker, setOpenDatePicker] = useState(false); // DatePicker를 열고 닫는 상태
    const {signUp} = useContext(AuthContext);

    const handleUserType = (option: SetStateAction<string>) => {
        setUserType(option === userType ? '' : option); // 이미 선택된 옵션을 다시 클릭하면 해제
    };
    
    const handleSignUp = async () => {
        if(name && email && password && userType && dob && phoneNumberPrefix && phoneNumberMid && phoneNumberSuffix) {
            const fullNumber = phoneNumberPrefix + '-' + phoneNumberMid + '-' + phoneNumberSuffix;
            const success = await signUp(name, email, password, userType, dob, fullNumber);
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
        <View style={styles.authContainer}>
            <Text style={styles.header}>Sign Up</Text>
            
            <View style={styles.authContext}>
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>Name : </Text>
                </View>
                <View style={{flex: 3}}>
                    <TextInput 
                        placeholder='Name' 
                        keyboardType='default' 
                        autoCapitalize='none'
                        style={styles.input} 
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>

            <View style={styles.authContext}>
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>Email : </Text>
                </View>
                <View style={{flex: 3}}>
                    <TextInput 
                        placeholder='Email' 
                        keyboardType='email-address' 
                        autoCapitalize='none'
                        style={styles.input} 
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            <View style={styles.authContext}>
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>Password : </Text>
                </View>
                <View style={{flex: 3}}>
                    <TextInput 
                        placeholder='Password'
                        secureTextEntry
                        style={styles.input} 
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <View style={styles.authContext}>
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>Birthday : </Text>
                </View>
                <View style={{flex: 3}}>
                    <TouchableOpacity onPress={() => setOpenDatePicker(true)} style={styles.input}>
                        <Text style={{ fontSize : 16 }}>
                            {birthDate ? birthDate.toISOString().split('T')[0] : 'Select Birth Date'}
                        </Text>
                    </TouchableOpacity>

                    {/* DatePicker 컴포넌트 */}
                    <DatePicker
                        modal
                        open={openDatePicker}
                        date={birthDate}
                        mode="date"
                        onConfirm={(date) => {
                            setBirthDate(date);
                            setDoB(date.toISOString().split('T')[0]);
                            setOpenDatePicker(false);
                        }}
                        onCancel={() => setOpenDatePicker(false)}
                    />
                </View>
            </View>

            <View style={styles.authContext}>
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>Phone : </Text>
                </View>
                <View style={{flex: 3}}>
                    <View style={styles.authContext}>
                        <TextInput 
                            placeholder='###' 
                            keyboardType='numeric'
                            style={[styles.phoneInput]} 
                            value={phoneNumberPrefix}
                            maxLength={3}
                            onChangeText={setPhoneNumberPrefix}
                        />
                        <Text style={styles.authContextText}> - </Text>
                        <TextInput 
                            placeholder='####' 
                            keyboardType='numeric'
                            style={[styles.phoneInput]} 
                            value={phoneNumberMid}
                            maxLength={4}
                            onChangeText={setPhoneNumberMid}
                        />
                        <Text style={styles.authContextText}> - </Text>
                        <TextInput 
                            placeholder='####' 
                            keyboardType='numeric'
                            style={[styles.phoneInput]} 
                            value={phoneNumberSuffix}
                            maxLength={4}
                            onChangeText={setPhoneNumberSuffix}
                        />
                    </View>
                    
                </View>
            </View>

            <View style={styles.authContext}>              
                <View style={{flex: 1}}>
                    <Text style={styles.authContextText}>User Type : </Text>
                </View>
                <View style={{flex: 3}}>
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
                </View>
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