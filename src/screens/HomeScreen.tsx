import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';
import { RecordContext } from '../context/RecordContext';
import { PTScheduleContext } from '../context/PTScheduleContext';
import RecordItem from '../components/RecordItem';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { BottomTabParamsList } from '../navigation/TabNavigation';
import { Screen } from 'react-native-screens';
import { useIsFocused } from '@react-navigation/native';

type HomeScreenBottomTabNavigationProp = NativeStackNavigationProp<BottomTabParamsList, 'Home'>

interface HomeScreenProps {
    navigation : HomeScreenBottomTabNavigationProp;
}

const HomeScreen : React.FC<HomeScreenProps> = ({navigation}) => {
    const {userName} = useContext(AuthContext);
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const { fetchSchedules } = useContext(PTScheduleContext);
    const [latestRecords, setLatestRecords] = useState(records); // 최신 3개 기록
    const [nextSchedules, setNextSchedules] = useState<any[]>([]); // 오늘 이후 7일 내의 PT 일정
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log(isFocused);
        if (isFocused) {
            fetchRecordData();
        }

    }, [isFocused]);

    useEffect(() => {
        // 가장 최신 기록 3개만 추출
        const sortedRecords = records.sort((a, b) => {
            const dateA = new Date(a.sessionDate);
            const dateB = new Date(b.sessionDate);
          return dateB.getTime() - dateA.getTime(); // 최신 기록이 앞에 오도록 정렬
        });
    
        // 최신 2개 기록만 추출
        const topTwoRecords = sortedRecords.slice(0, 3);
        setLatestRecords(topTwoRecords); // 상태에 저장
    }, [records]);

    // 오늘 이후 7일 내의 날짜에 해당하는 PT 일정 가져오기
    useEffect(() => {
        const today = new Date();
        const upcomingDates = [];
        
        // 오늘부터 7일 내의 날짜 계산
        for (let i = 1; i <= 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);  // 오늘 이후의 날짜 계산
            upcomingDates.push(futureDate.toISOString().split('T')[0]); // 날짜를 'YYYY-MM-DD' 형식으로 저장
        }

        // 각 날짜에 대한 PT 일정 가져오기
        for (const date of upcomingDates) {
            fetchSchedules(date); // 각 날짜에 대해 PT 일정 호출
        }
    }, []); // 이 부분에서 'useEffect'는 최초 1회만 실행됩니다.

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Most Recent Records:</Text>
            </View>

            {/* <View style={{ flex : 1 }}>
                <FlatList 
                    data={latestRecords}
                    keyExtractor={(item) => item?.sessionDate}
                    renderItem={({item}) => 
                        <RecordItem 
                            record={item}
                            onPressRecordItem={() => navigation.navigate('Home', { screen: 'UpdateRoutine', params: { selectedRecord: item } })}
                            onPressDeleteRecordItem={() => deleteRecordData(item?.recordId, item?.sessionDate)} 
                            onPressShareRecordItem={function (): void {
                                throw new Error('Function not implemented.');
                            } }                        
                        />
                    }
                />
                
            </View> */}

            
            <View style={{ flex : 1 }}>
                <FlatList 
                    data={latestRecords}
                    keyExtractor={(item) => item?.sessionDate}
                    renderItem={({item}) => 
                        <RecordItem 
                            record={item}
                            onPressRecordItem={() => navigation.navigate('Home', { screen: 'UpdateRoutine', params: { selectedRecord: item } })}
                            onPressDeleteRecordItem={() => deleteRecordData(item?.recordId, item?.sessionDate)} 
                            onPressShareRecordItem={function (): void {
                                throw new Error('Function not implemented.');
                            } }                        
                        />
                    }
                />
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Next PT Schedule:</Text>
            </View>

            <View style={{ flex : 1 }}>
                {/* TODO : add schedule block here */}
            </View>
        </View>
    );
};

export default HomeScreen;