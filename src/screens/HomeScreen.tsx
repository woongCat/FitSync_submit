import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
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
    const [nextSchedules, setNextSchedules] = useState<any[]>([]); // 오늘 이후 3일 내의 PT 일정
    const [upcomingDates, setUpcomingDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

    // 오늘 이후 3일 내의 날짜에 해당하는 PT 일정 가져오기
    // 날짜 계산 및 데이터 fetch
    useEffect(() => {
        const today = new Date();
        const dates: string[] = [];
    
        // 오늘부터 3일 내의 날짜 계산
        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
        }
    
        setUpcomingDates(dates); // 로컬 날짜 저장
    
        // 데이터 Fetch
        setIsLoading(true);
        Promise.all(dates.map((date) => fetchSchedules(date)))
            .then((results) => {
                const allSchedules = results.flat();
                setNextSchedules(allSchedules); // 일정이 있는 경우만 저장
            })
            .catch((error) => console.error('Error fetching schedules:', error))
            .finally(() => setIsLoading(false));
    }, []);

        // FlatList에 사용할 데이터 구성
        const scheduleData = nextSchedules.filter((schedule) => 
            upcomingDates.includes(schedule.date)
        );

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Most Recent Records:</Text>
            </View>

            
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

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={scheduleData}
                    keyExtractor={(item) => item.scheduleId.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.scheduleContainer}>
                            <Text style={styles.scheduleText}>
                                {`Date: ${item.date}\nTrainer: ${item.trainerName}\nTime: ${item.startTime} - ${item.endTime}`}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScheduleContainer}>
                            <Text style={styles.emptyScheduleText}>No upcoming schedules found.</Text>
                        </View>
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            )}
        </View>
    );
};

export default HomeScreen;