import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../style/styles';
import { RecordContext } from '../context/RecordContext';
import RecordItem from '../components/RecordItem';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type HomeScreenBottomTabNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TabNav'>
type HomeScreentoRoutineNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface HomeScreenProps {
    routineNavigation : HomeScreentoRoutineNavigationProp;
    bottomTabNavigation : HomeScreenBottomTabNavigationProp;
}

const HomeScreen : React.FC<HomeScreenProps> = ({routineNavigation, bottomTabNavigation}) => {
    const {userName} = useContext(AuthContext);
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const [latestRecords, setLatestRecords] = useState(records); // 최신 2개 기록

    useEffect(() => {
        fetchRecordData();
    }, []);

    useEffect(() => {
        // 가장 최신 기록 2개만 추출
        const sortedRecords = records.sort((a, b) => {
            const dateA = new Date(a.sessionDate);
            const dateB = new Date(b.sessionDate);
          return dateB.getTime() - dateA.getTime(); // 최신 기록이 앞에 오도록 정렬
        });
    
        // 최신 2개 기록만 추출
        const topTwoRecords = sortedRecords.slice(0, 3);
        setLatestRecords(topTwoRecords); // 상태에 저장
    }, [records]);

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <Text style={styles.userInfoText}>Hello, {userName}</Text>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Most Recent Records:</Text>
            </View>

            <FlatList 
                data={latestRecords}
                keyExtractor={(item) => item?.sessionDate}
                renderItem={({item}) => 
                    <RecordItem 
                        record={item} 
                        onPressRecordItem={() => 
                            routineNavigation.navigate('UpdateRoutine', {selectedRoutines : item.routines})
                        }
                        onPressDeleteRecordItem = {() =>
                            deleteRecordData(item?.recordId, item?.sessionDate)
                        } 
                    />
                }
            />

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>Next PT Schedule:</Text>
            </View>

            <View style={styles.contentContainer}>
                {/* TODO : add schedule block here */}
            </View>
        </View>
    );
};

export default HomeScreen;