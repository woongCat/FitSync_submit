import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { upload } from '../context/UploadContext';
import Config  from "react-native-config"; // .env에서 변수를 가져옴
import { Routine } from '../context/RecordContext';

type ChooseOptionScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface ChooseOptionScreenProps {
    navigation : ChooseOptionScreenNavigationProp
}

const ChooseOptionScreen : React.FC<ChooseOptionScreenProps> = ({navigation}) => {
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [fileUri, setFileUri] = useState<string | null>(null);

    //DocumentPicker를 사용하는 경우 가져오는 파일에 대한 권한을 자동으로 요청 및 세팅하므로 requestStoragePermission가 필요없음.
    // 파일을 선택하는 함수
    const pickFile = async () => {
        try {
            // 파일 선택 창을 띄웁니다.
            const res = await DocumentPicker.pick({
                mode: 'open',
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // 선택할 파일 타입을 지정
            });

            setIsUploadLoading (true);

            const file = res[0]; // 첫 번째 파일 선택
            setFileUri(file.uri); // 선택한 파일의 URI를 상태에 저장
            
            //서버로 사진 전송
            const response = await upload(
                {
                    uri: file.uri,
                    type: file.type, // 사진의 MIME 타입
                    name: 'photo.jpg', 
                },
                `${Config.API_URL}/upload` 
            );

            setIsUploadLoading (false);
    
            if (response) {
                // 서버로부터 받은 응답 데이터를 Record와 Routine 형식에 맞게 변환
                const routines: Routine[] = response.map((item: any) => ({
                    exercise_id: item.exercise_id,
                    exercise_name: item.exercise,
                    sets: item.sets,
                    reps: item.reps,
                    weight: item.weight,
                    comment: item.comment || null,
                }));

                navigation.navigate('CreateRoutine', {selectedRoutine : routines});
            } else {
                Alert.alert('Error', 'Fail to process file.');
                navigation.navigate('ChooseOption');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // 사용자가 파일 선택을 취소했을 경우
                console.log('You canceled the file selection.');
            } else {
                console.error(err);
                Alert.alert('Error', 'The error occured during file selection.');
            }
            navigation.navigate('RoutineDetail');
        }
    };

    return (
        <View style={styles.optionContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('CameraShot')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickFile} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Find file</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateRoutine', {})} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Create New</Text>
            </TouchableOpacity>

            {/* 로딩 상태일 때 Modal 표시 */}
            {isUploadLoading && (
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

export default ChooseOptionScreen;