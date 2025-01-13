import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
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
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const { fetchSchedules } = useContext(PTScheduleContext);
    const { isLoading, fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const [latestRecords, setLatestRecords] = useState(records); // 최신 3개 기록
    const [nextSchedules, setNextSchedules] = useState<any[]>([]); // 오늘 이후 3일 내의 PT 일정
    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log("landing on home", isFocused);
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

        const topThreeRecords = sortedRecords.slice(0, 3);
        setLatestRecords(topThreeRecords); // 상태에 저장
    }, [records]);

    // 오늘 이후의 PT 일정 가져오기
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식으로 변환
        setIsLoading(true);

        fetchSchedules(today)
            .then((schedules) => {
                setNextSchedules(schedules); // 일정 저장
            })
            .catch((error) => console.error('Error fetching schedules:', error))
            .finally(() => setIsLoading(false));
    }, []);


    const handlePressRecordItem = (record: Record | undefined) => {
        if (record) {
            navigation.navigate('UpdateRoutine', { selectedRecord: record });
        } else {
            console.log("Record item is undefined or null.");
        }
    };

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
                            <RecordItem 
                                record={item}
                                onPressRecordItem={() => handlePressRecordItem(item)}
                                onPressDeleteRecordItem={() => deleteRecordData(item?.recordId, item?.sessionDate)} 
                                onPressShareRecordItem={function (): void {
                                    throw new Error('Function not implemented.');
                                } }                        
                            />
                        }
                    />
                </View>
            )}

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Next PT Schedule:</Text>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={nextSchedules}
                    keyExtractor={(item) => item.scheduleId?.toString() || `${item.startTime}`}
                    renderItem={({ item }) => (
                        <View style={styles.scheduleContainer}>
                            <Text style={styles.scheduleText}>
                                {`Date: ${new Date().toISOString().split('T')[0]}\nTrainer: ${item.trainerName}\nTime: ${item.startTime} - ${item.endTime}`}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyScheduleContainer}>
                            <Text style={styles.emptyScheduleText}>No schedules found for today.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default HomeScreen;