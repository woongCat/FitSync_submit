import { useContext, useEffect, useState } from 'react';
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
import { icon } from '../constants/icons';
import GymInfo from '../components/GymInfo';
import { useIsFocused } from '@react-navigation/native';
import { RegistrationContext } from '../context/RegistrationContext';
import ManageInfo from '../components/ManageInfo';
import AnalyticsInfo from '../components/AnalyticsInfo';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface ProfileScreenProps {
    navigation : ProfileScreenNavigationProp
}

const ProfileScreen : React.FC<ProfileScreenProps> = ({navigation}) => {
    const {userName, signOut} = useContext(AuthContext);
    const [isFocusedGym, setIsFocusedGym] = useState(false);
    const [isFocusedManage, setIsFocusedManage] = useState(false);
    const [isFocusedAnalytics, setIsFocusedAnalytics] = useState(true);
    // 상태 추가: 현재 활성화된 섹션
    const [activeSection, setActiveSection] = useState<'gym' | 'manage' | 'analytics'>('analytics');
    const isFocused = useIsFocused();
    const [isInfoChanged, setIsInfoChanged] = useState(false);
    const { isLoading, userType, gym, gymTrainers, gymCustomers, fetchRegistrationInfo, updateRegistrationInfo } = useContext(RegistrationContext);
    
    useEffect(() => {
        console.log("landing on profile", isFocused);
        if (isFocused || isInfoChanged) {
            fetchRegistrationInfo();
            setIsInfoChanged(false);
        }
    }, [isFocused, isInfoChanged]);
    

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

    const handleGymSelect = () => {
        // 상태 설정
        setIsFocusedGym(prevState => !prevState);  // 상태 반전
        setIsFocusedManage(false);  // 다른 버튼은 비활성화
        setIsFocusedAnalytics(prevState => isFocusedGym);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedGym? 'analytics' : 'gym' ); // 'Gym'을 선택하면 gym 섹션을 활성화
    };

    const handleManageSelect = () => {
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(prevState => !prevState);  // 상태 반전
        setIsFocusedAnalytics(prevState => isFocusedManage);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedManage? 'analytics' : 'manage' ); // 'manage'을 선택하면 manage 섹션을 활성화
    };

    const handleAnalyticsSelect = () => {
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(false);  // 다른 버튼은 비활성화
        setIsFocusedAnalytics(true);  // 상태 반전
        setActiveSection('analytics'); // 항상
    };

    const handleChangeGym = async (selectedGymId : number) => {
        if (selectedGymId) { // selectedGymId가 null이 아닐 때만 실행
            const result = await updateRegistrationInfo('gym', selectedGymId);

            if (result) {
                setIsInfoChanged(true);
            } else {
                // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
                console.log('Failed to change gym');
            }
        }
    }

    const handleChangeTrainer = async (trainerId : number) => {
        if (trainerId) { // trainerId가 null이 아닐 때만 실행
            const result = await updateRegistrationInfo('trainer', trainerId);

            if (result) {
                setIsInfoChanged(true);
            } else {
                // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
                console.log('Failed to change trainer');
            }
        }
    }

    const handleDeleteCustomer = async (customerId : number) => {
        if (customerId) { // customerId가 null이 아닐 때만 실행
            const result = await updateRegistrationInfo('customer', customerId);

            if (result) {
                setIsInfoChanged(true);
            } else {
                // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
                console.log('Failed to delete customer');
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={{flex : 1}}>
                    {icon.Profile({ width: 50, height: 50 })}
                </View>
                <View style={{flex : 3}}>
                    <Text style={styles.userInfoText}>{userName}</Text>
                    <Text style={styles.userInfoDetailText}>{userType}</Text> 
                </View>
                <View style={{flex : 1}}>
                    <TouchableOpacity onPress={handleLogOut} style={styles.LogOutBtn}>
                        <Text style={styles.LogOutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.profileMenu}>
                <TouchableOpacity onPress={() => handleGymSelect()} style={styles.profileMenuBtn}>
                    <View style={[styles.profileMenuIcon, { backgroundColor: isFocusedGym ? '#007aff' : '#fff' }]}>
                        {icon.Gym({ color: isFocusedGym ?  "#fff" : "#000" })}
                    </View>
                    <Text style={[styles.profileMenuText, { color: isFocusedGym ? '#007aff' : '#000' }]}>Gym</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnalyticsSelect()} style={styles.profileMenuBtn}>
                    <View style={[styles.profileMenuIcon, { backgroundColor: isFocusedAnalytics ? '#007aff' : '#fff' }]}>
                        {icon.Analytics({ color: isFocusedAnalytics ? "#fff" : "#000" })}
                    </View>
                    <Text style={[styles.profileMenuText, { color: isFocusedAnalytics ? '#007aff' : '#000' }]}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleManageSelect()} style={styles.profileMenuBtn}>
                    <View style={[styles.profileMenuIcon, { backgroundColor: isFocusedManage ? '#007aff' : '#fff' }]}>
                        {icon.User({ color: isFocusedManage ? "#fff" : "#000" })}
                    </View>
                    <Text style={[styles.profileMenuText, { color: isFocusedManage ? '#007aff' : '#000' }]}>Manage</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.profileContentContainer, { backgroundColor: activeSection === null ? '' : '#fff' }]}>
                {activeSection === 'gym' && (
                    <GymInfo
                        gym={gym} 
                        onPressChangeGymItem={(selectedGymId : number) => handleChangeGym(selectedGymId)} 
                    />
                )}
                {activeSection === 'analytics' && (
                    <AnalyticsInfo userType={userType} />
                )}
                {activeSection === 'manage' && (
                    <ManageInfo
                        userType={userType}
                        relatedTrainers={gymTrainers}
                        relatedCustomers={gymCustomers} 
                        onPressChangeTrainer={(trainerId : number) => handleChangeTrainer(trainerId)} 
                        onPressDeleteCustomer={(customerId : number) => handleDeleteCustomer(customerId)}                        
                    />
                )}
            </View>
            
        </View>
    );
};

export default ProfileScreen;