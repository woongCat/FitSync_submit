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
import { Record, RecordContext } from '../context/RecordContext';
import RecordItem from '../components/RecordItem';
import { BottomTabParamsList } from '../navigation/TabNavigation';
import { useIsFocused } from '@react-navigation/native';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';

type HomeScreenBottomTabNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'HomeDetail'>

interface HomeScreenProps {
    navigation : HomeScreenBottomTabNavigationProp;
}

const HomeScreen : React.FC<HomeScreenProps> = ({navigation}) => {
    const {userName} = useContext(AuthContext);
    const { fetchRecordData, deleteRecordData, records } = useContext(RecordContext);
    const [latestRecords, setLatestRecords] = useState(records); // 최신 3개 기록
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