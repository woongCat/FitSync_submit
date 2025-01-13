import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    ActivityIndicator,
    FlatList,
    Text,
    View,
} from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';

import { Record, RecordContext } from '../context/RecordContext';
import { PTScheduleContext } from '../context/PTScheduleContext';

import RecordItem from '../components/RecordItem';
import { useIsFocused } from '@react-navigation/native';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type HomeScreenBottomTabNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'HomeDetail'>

interface HomeScreenProps {
    navigation : HomeScreenBottomTabNavigationProp;
}

const HomeScreen : React.FC<HomeScreenProps> = ({navigation}) => {
    const {userName} = useContext(AuthContext);
    const { fetchSchedules } = useContext(PTScheduleContext);
    const { isLoading, fetchRecordData, records } = useContext(RecordContext);
    const [latestRecords, setLatestRecords] = useState(records); // 최신 3개 기록
    const [nextSchedules, setNextSchedules] = useState<any[]>([]); // 오늘 이후 3일 내의 PT 일정
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log("landing on home", isFocused);
        if (isFocused) {
            fetchRecordData();
            // 오늘 이후의 PT 일정 가져오기
            const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식으로 변환
            setIsScheduleLoading(true);
    
            fetchSchedules(today)
                .then((schedules) => {
                    setNextSchedules(schedules); // 일정 저장
                })
                .catch((error) => console.error('Error fetching schedules:', error))
                .finally(() => setIsScheduleLoading(false));
        }

    }, [isFocused]);

    useEffect(() => {
        // 가장 최신 기록 3개만 추출
        const sortedRecords = records.sort((a, b) => {
            const dateA = new Date(a.sessionDate);
            const dateB = new Date(b.sessionDate);
          return dateB.getTime() - dateA.getTime(); // 최신 기록이 앞에 오도록 정렬
        });

        const topThreeRecords = sortedRecords.slice(0, 3);
        setLatestRecords(topThreeRecords); // 상태에 저장
    }, [records]);


    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Most Recent Records:</Text>
            </View>

            {isLoading ? (
                <View style={{ flex : 1 , justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator size="large" color="grey" />
                </View>
            ) : (
                <View style={{ flex : 1 }}>
                    <FlatList 
                        data={latestRecords}
                        keyExtractor={(item) => item?.sessionDate}
                        renderItem={({item}) => 
                            <View style={styles.RecordCard}>
                                <Text style={styles.RecordHeader}> {item?.sessionDate} </Text>
                                <Text style={styles.RecordDescription}> 
                                with {
                                    // 1. trainerName, customerName, userName이 모두 같을 경우 userName만 띄우기
                                    (item?.trainerName && item?.customerName && item?.trainerName === item?.customerName && item?.trainerName === userName)
                                    ? userName
                                    : // 2. trainerName이 userName과 같으면 customerName만 표시
                                    (item?.trainerName === userName)
                                    ? item?.customerName
                                    : // 3. customerName이 userName과 같으면 trainerName만 표시
                                    (item?.customerName === userName)
                                    ? item?.trainerName
                                    : ''
                                }
                                </Text>
                            </View>
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyScheduleContainer}>
                                <Text style={styles.emptyScheduleText}>No record is found.</Text>
                            </View>
                        }
                    />
                </View>
            )}

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Next PT Schedule:</Text>
            </View>

            {isScheduleLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="grey" />
                </View>
            ) : (
                <View style={{ flex : 1 }}>
                    <FlatList
                        data={nextSchedules.filter(item => item.status !== '거절')}
                        keyExtractor={(item) => item.scheduleId?.toString() || `${item.startTime}`}
                        renderItem={({ item }) => {
                            // status에 따라 backgroundColor 결정
                            let backgroundColor = '#ffffff'; // 기본 배경색
                            if (item.status === '예약') {
                                backgroundColor = '#ffebcc'; // 예시: 예약 상태에 대한 색상
                            } else if (item.status === '확정') {
                                backgroundColor = '#d4edda'; // 예시: 완료 상태에 대한 색상
                            } else if (item.status === '거절') {
                                backgroundColor = '#f8d7da'; // 예시: 거절 상태에 대한 색상
                            }
                            return  <View style={[styles.scheduleContainer, { backgroundColor }]}>
                                        <Text style={styles.scheduleText}>
                                            {`Date: ${new Date().toISOString().split('T')[0]}\nTrainer: ${item.trainerName}\nTime: ${item.startTime} - ${item.endTime}`}
                                        </Text>
                                    </View>
                        }}
                        ListEmptyComponent={
                            <View style={styles.emptyScheduleContainer}>
                                <Text style={styles.emptyScheduleText}>No schedules found for today.</Text>
                            </View>
                        }
                    />
                </View>
                
            )}
        </View>
    );
};

export default HomeScreen;