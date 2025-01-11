import { useContext, useState } from 'react';
import {
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigation';
import styles from '../style/styles';
import { Gym } from '../context/GymContext';
import SearchGym from '../components/SearchGym';
import { icon } from '../constants/icons';
import GymItem from '../components/GymItem';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>

interface ProfileScreenProps {
    navigation : ProfileScreenNavigationProp
}

const ProfileScreen : React.FC<ProfileScreenProps> = ({navigation}) => {
    const {userName, signOut} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [isFocusedGym, setIsFocusedGym] = useState(false);
    const [isFocusedManage, setIsFocusedManage] = useState(false);
    const [isFocusedAnalytics, setIsFocusedAnalytics] = useState(false);
    // 상태 추가: 현재 활성화된 섹션
    const [activeSection, setActiveSection] = useState<'gym' | 'manage' | 'analytics' | null>(null);

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
        setIsFocusedAnalytics(false);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedGym? null : 'gym' ); // 'Gym'을 선택하면 gym 섹션을 활성화
    };

    const handleManageSelect = () => {
        // 동작 처리
        
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(prevState => !prevState);  // 상태 반전
        setIsFocusedAnalytics(false);  // 다른 버튼은 비활성화
        setActiveSection(prevState => isFocusedManage? null : 'manage' ); // 'Gym'을 선택하면 gym 섹션을 활성화
    };

    const handleAnalyticsSelect = () => {
        // 동작 처리
        
        // 상태 설정
        setIsFocusedGym(false);  // 다른 버튼은 비활성화
        setIsFocusedManage(false);  // 다른 버튼은 비활성화
        setIsFocusedAnalytics(prevState => !prevState);  // 상태 반전
        setActiveSection(prevState => isFocusedAnalytics? null : 'analytics' ); // 'Gym'을 선택하면 gym 섹션을 활성화
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={{flex : 1}}>
                    {icon.Profile({ width: 50, height: 50 })}
                </View>
                <View style={{flex : 3}}>
                    <Text style={styles.userInfoText}>{userName}</Text>
                    {/* TODO: UserType 받아오는 값으로 변경 */}
                    <Text style={styles.userInfoDetailText}>userType</Text> 
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
                <TouchableOpacity onPress={() => handleManageSelect()} style={styles.profileMenuBtn}>
                    <View style={[styles.profileMenuIcon, { backgroundColor: isFocusedManage ? '#007aff' : '#fff' }]}>
                        {icon.User({ color: isFocusedManage ? "#fff" : "#000" })}
                    </View>
                    <Text style={[styles.profileMenuText, { color: isFocusedManage ? '#007aff' : '#000' }]}>Manage</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnalyticsSelect()} style={styles.profileMenuBtn}>
                    <View style={[styles.profileMenuIcon, { backgroundColor: isFocusedAnalytics ? '#007aff' : '#fff' }]}>
                        {icon.Analytics({ color: isFocusedAnalytics ? "#fff" : "#000" })}
                    </View>
                    <Text style={[styles.profileMenuText, { color: isFocusedAnalytics ? '#007aff' : '#000' }]}>Analytics</Text>
                </TouchableOpacity>                
            </View>

            <View style={[styles.profileContentContainer, { backgroundColor: activeSection === null ? '' : '#fff' }]}>
                {activeSection === 'gym' && (
                    <GymItem 
                        gym={null} 
                        onPressChangeGymItem={function (): void {
                            throw new Error('Function not implemented.');
                        }} 
                    />
                )}
                {activeSection === 'analytics' && (
                    <Text>Analytics Content</Text> // 'Analytics' 섹션의 내용
                )}
                {activeSection === 'manage' && (
                    <Text>Manage Content</Text> // 'Manage' 섹션의 내용
                )}
            </View>
            
        </View>
    );
};

export default ProfileScreen;