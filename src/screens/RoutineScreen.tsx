import { SetStateAction, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, View } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { Record, RecordContext } from '../context/RecordContext';
import RecordItem from '../components/RecordItem';
import { useIsFocused } from '@react-navigation/native';
import { RegistrationContext } from '../context/RegistrationContext';

type RoutineScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface RoutineScreenProps {
    navigation : RoutineScreenNavigationProp
}

const RoutineScreen : React.FC<RoutineScreenProps> = ({navigation}) => {
    const [isOptionLoading, setIsOptionLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { isLoading, fetchRecordData, deleteRecordData, updateRecordUserId, records } = useContext(RecordContext);
    const [selectedDateRecord, setSelectedDateRecord] = useState(records);
    const [selectedShareRecord, setSelectedShareRecord] = useState<Record>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { userType, gymTrainers, gymCustomers, fetchRegistrationInfo } = useContext(RegistrationContext);
    const isFocused = useIsFocused();

    // 조건에 맞는 데이터를 가져오기
    const trainersToShow = userType === 'customer' ? gymTrainers.filter(trainer => trainer.trainerSelected === true) : [];
    const customersToShow = userType === 'trainer' ? gymCustomers : [];

    // 모든 record에 대해 sessionDate를 기준으로 markedDates를 설정할 수 있게 날짜 배열 생성
    const markedDates = (Array.isArray(records) && records.length > 0? records  : []).reduce((acc, record) => {
        const dateString = record.sessionDate.split(' ')[0]; // "YYYY-MM-DD" 형식으로 변환
        acc[dateString] = { marked: true, selectedDotColor: 'blue' };
        return acc;
    }, {});

    useEffect(() => {
        console.log("landing on routine ", isFocused);
        if (isFocused) {
            fetchRecordData();
            fetchRegistrationInfo();
        }

    }, [isFocused]);

    useEffect(() => {
        if (selectedDate && records.length > 0) {
            // selectedDate와 sessionDate 비교
            const filteredRecords = records.filter(record => {
                const recordDate = new Date(record.sessionDate);
                const selectedDateObject = new Date(selectedDate);

                // 날짜가 같은지 비교 (년도, 월, 일만 비교)
                return (
                    recordDate.getFullYear() === selectedDateObject.getFullYear() &&
                    recordDate.getMonth() === selectedDateObject.getMonth() &&
                    recordDate.getDate() === selectedDateObject.getDate()
                );
            });

            setSelectedDateRecord(filteredRecords); // 필터링된 records를 상태에 저장
        }
    }, [selectedDate, records]);

    // deleteRecordData 함수 후에 selectedDateRecord에서 해당 항목 삭제
    const handleDeleteRecordItem = async (recordId: number, sessionDate: string) => {

        setIsOptionLoading(true);

        const result = await deleteRecordData(recordId, sessionDate); // 데이터 삭제 API 호출
        // 삭제가 성공적으로 이루어졌다면
        if (result) {
            // selectedDateRecord에서 해당 항목을 삭제
            setSelectedDateRecord(prevRecords => 
                prevRecords.filter(record => record.recordId !== recordId)
            );

            // 삭제 후 records를 새로 불러오기
            fetchRecordData();
            
        } else {
            // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
            console.log('Failed to delete the record');
        }
        
        setIsOptionLoading(false);
    };

    const openShareModal = () => {
        setIsModalVisible(true);
    };

    const closeShareModal = () => {
        setIsModalVisible(false);
    };

    const handleUserSelection = async (selectedUserId: number) => {
        if (!selectedUserId || !selectedShareRecord) return;

        setIsOptionLoading(true);

        const result = await updateRecordUserId(selectedShareRecord.recordId, selectedShareRecord.sessionDate, selectedUserId);
        // 삭제가 성공적으로 이루어졌다면
        if (result) {
            // 수정 후 records를 새로 불러오기
            fetchRecordData();
            // 선택된 SelectedShareRecord 지우기
            setSelectedShareRecord(undefined);
        } else {
            // 삭제 실패 처리 (필요시 사용자에게 알림 등을 추가할 수 있음)
            console.log('Failed to share the record');
        }
        closeShareModal(); // 모달 닫기
        setIsOptionLoading(false);
    };
    
    return (
        <View style={styles.contentContainer}>
            <Calendar
                onDayPress={(day: { dateString: SetStateAction<Date>; }) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    ...markedDates,
                    [String(selectedDate)]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                }}
            />

            {/*  render all the record */}
            {isLoading ? (
                <View style={{ flex : 1 , justifyContent : 'center', alignItems : 'center'}}>
                    <ActivityIndicator size="large" color="grey" />
                </View>
            ) : (
                <View style={{ flex : 1 }}>
                    <FlatList 
                    data={selectedDateRecord}
                    keyExtractor={(item) => item?.sessionDate}
                    renderItem={({item}) => 
                        <RecordItem 
                            record={item}
                            onPressRecordItem={() => navigation.navigate('UpdateRoutine', { selectedRecord: item })}
                            onPressDeleteRecordItem={() => handleDeleteRecordItem(item?.recordId, item?.sessionDate)} 
                            onPressShareRecordItem={() => {
                                setSelectedShareRecord(item);
                                openShareModal();
                            }}                    
                        />
                    }
                />
                </View>
            )}

            {/* 공유할 사용자 선택 모달 */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeShareModal}
            >
                {userType === 'customer' && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {'Select a Trainer'}
                            </Text>
                            <FlatList
                                data={trainersToShow}
                                keyExtractor={(item) => item.trainerId.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => handleUserSelection(item.trainerId)}
                                    >
                                        <Text style={styles.modalItemText}>{item.trainerName}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={closeShareModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {userType === 'trainer' && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {'Select a Customer'}
                            </Text>
                            <View style={{maxHeight : 400}}>
                                <FlatList
                                    data={customersToShow}
                                    keyExtractor={(item) => item.customerId.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.modalItem}
                                            onPress={() => handleUserSelection(item.customerId)}
                                        >
                                            <Text style={styles.modalItemText}>{item.customerName}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={closeShareModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Modal>
            
            <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => navigation.navigate('ChooseOption')}
            >
                <Text style={styles.addBtnText}>Add New</Text>
            </TouchableOpacity>

            {/* 로딩 상태일 때 Modal 표시 */}
            {isOptionLoading && (
                <Modal transparent animationType="fade">
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="red" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer : {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 어둡게 반투명 처리
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff', // 모달 내부 배경
        borderRadius: 10, // 둥근 모서리
        padding: 20, // 내부 여백
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // 안드로이드 그림자 효과
    },
    modalTitle: {
        fontSize: 18, // 제목 크기
        fontWeight: 'bold',
        textAlign: 'center', // 가운데 정렬
        color: '#333', // 텍스트 색상
        paddingBottom : 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd', // 항목 구분선
    },
    modalItem: {
        padding: 10, // 항목의 내부 여백
        borderBottomWidth: 1,
        borderBottomColor: '#ddd', // 항목 구분선
    },
    modalItemText: {
        fontSize: 16,
        color: '#555', // 항목 텍스트 색상
    },
    closeButton: {
        alignItems: 'center', // 텍스트 가운데 정렬
        padding: 10,
        backgroundColor: "#FF0000",
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: "white",
        textAlign: "center",
    },
    addBtn : {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#007aff',
        width: 110,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    addBtnText : {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
    },
});

export default RoutineScreen;
