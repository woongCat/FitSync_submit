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
import { Gym } from '../context/GymContext';
import { icon } from '../constants/icons';
import GymInfo from '../components/GymInfo';
import { useIsFocused } from '@react-navigation/native';
import { Customer, RegistrationContext, Trainer } from '../context/RegistrationContext';
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
    const { userType, gym, gymTrainers, gymCustomers, fetchRegistrationInfo, updateRegistrationInfo } = useContext(RegistrationContext);
    

    // 임의의 데이터 설정 (테스트용)
    const testUserType = 'customer';
    
    const testGym: Gym = {
        gymId: 123,
        gymName: 'Test Gym',
        gymLocation: '123 Test Street',
        gymPhoneNumber: '012-234-4566',
    };

    const testCustomers: Customer[] = [
        {
            customerId: 1,
            customerName: "John Doe",
            customerPTType: 2,
        },
        {
            customerId: 2,
            customerName: "Jane Smith",
            customerPTType: 10,
        },
        {
            customerId: 3,
            customerName: "Alice Brown",
            customerPTType: 0,
        },
        {
            customerId: 4,
            customerName: "Smith Smith",
            customerPTType: 30,
        },
        {
            customerId: 5,
            customerName: "John John",
            customerPTType: 23,
        },
        {
            customerId: 6,
            customerName: "John John",
            customerPTType: 23,
        },
        {
            customerId: 7,
            customerName: "John John",
            customerPTType: 23,
        },
        {
            customerId: 8,
            customerName: "John John",
            customerPTType: 23,
        },
        {
            customerId: 9,
            customerName: "John John",
            customerPTType: 23,
        },
        {
            customerId: 10,
            customerName: "John John",
            customerPTType: 23,
        },
    ];

    const testTrainers: Trainer[] = [
        {
            trainerId: 101,
            trainerName: "Mark Williams",
            trainerSpeciality: "Strength Training",
            trainerRecentAward: "Best Strength Trainer (2024)",
            trainerRecentCertification: "Certified Personal Trainer (2023)",
            trainerSelected: true,
        },
        {
            trainerId: 102,
            trainerName: "Emily Johnson",
            trainerSpeciality: "Cardio",
            trainerRecentAward: "Top Cardio Trainer (2023)",
            trainerRecentCertification: "Cardio Specialist (2022)",
            trainerSelected: false,
        },
        {
            trainerId: 103,
            trainerName: "Chris Davis",
            trainerSpeciality: "Yoga",
            trainerRecentAward: "Yoga Expert (2022)",
            trainerRecentCertification: "Yoga Master Certification (2021)",
            trainerSelected: false,
        },
        {
            trainerId: 104,
            trainerName: "Chris",
            trainerSpeciality: "Someting",
            trainerRecentAward: "Someting Expert (2022)",
            trainerRecentCertification: "Someting Master Certification (2021)",
            trainerSelected: false,
        },
        {
            trainerId: 105,
            trainerName: "Johnson",
            trainerSpeciality: "Someting",
            trainerRecentAward: "Someting Expert (2022)",
            trainerRecentCertification: "Someting Master Certification (2021)",
            trainerSelected: false,
        },
    ];

    useEffect(() => {
        console.log(isFocused);
        if (isFocused) {
            //fetchRegistrationInfo();
        }

    }, [isFocused]);

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
        // 동작 처리

        // 상태 설정
        setIsFocusedGym(prevState => !prevState);  // 상태 반전
        setIsFocusedManage(false);  // 다른 버튼은 비활성화
        setIsFocusedAnalytics(prevState => isFocusedGym);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedGym? 'analytics' : 'gym' ); // 'Gym'을 선택하면 gym 섹션을 활성화
    };

    const handleManageSelect = () => {
        // 동작 처리
        
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(prevState => !prevState);  // 상태 반전
        setIsFocusedAnalytics(prevState => isFocusedManage);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedManage? 'analytics' : 'manage' ); // 'manage'을 선택하면 manage 섹션을 활성화
    };

    const handleAnalyticsSelect = () => {
        // 동작 처리
        
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(false);  // 다른 버튼은 비활성화
        setIsFocusedAnalytics(true);  // 상태 반전
        setActiveSection('analytics'); // 항상
    };

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
                        gym={testGym} 
                        onPressChangeGymItem={(selectedGymId : number) => {
                            if (selectedGymId) { // updatedGym이 null이 아닐 때만 실행
                                console.log('selected gym ID ', selectedGymId)
                                updateRegistrationInfo('gym', selectedGymId);
                            }
                        }} 
                    />
                )}
                {activeSection === 'analytics' && (
                    <AnalyticsInfo userType={testUserType} />
                )}
                {activeSection === 'manage' && (
                    <ManageInfo
                        userType={testUserType}
                        relatedTrainers={testTrainers}
                        relatedCustomers={testCustomers} 
                        onPressChangeTrainer={(trainerId : number) => {
                            if (trainerId) { // updatedGym이 null이 아닐 때만 실행
                                console.log('selected trainer ID ', trainerId)
                                updateRegistrationInfo('trainer', trainerId);
                            }
                        }} 
                        onPressDeleteCustomer={(customerId : number) => {
                            if (customerId) { // updatedGym이 null이 아닐 때만 실행
                                console.log('selected customer ID ', customerId)
                                updateRegistrationInfo('customer', customerId);
                            }
                        }}                        
                    />
                )}
            </View>
            
        </View>
    );
};

export default ProfileScreen;