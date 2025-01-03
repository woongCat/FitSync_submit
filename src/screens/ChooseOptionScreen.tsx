import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import styles from '../style/styles';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { requestMultiple, PERMISSIONS, openSettings } from 'react-native-permissions';
import { upload } from '../context/UploadContext';
import Config  from "react-native-config"; // .env에서 변수를 가져옴

type ChooseOptionScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface ChooseOptionScreenProps {
    navigation : ChooseOptionScreenNavigationProp
}

const ChooseOptionScreen : React.FC<ChooseOptionScreenProps> = ({navigation}) => {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    //DocumentPicker를 사용하는 경우 가져오는 파일에 대한 권한을 자동으로 요청 및 세팅하므로 requestStoragePermission가 필요없음.
    // 파일을 선택하는 함수
    const pickFile = async () => {
        try {
            // 파일 선택 창을 띄웁니다.
            const res = await DocumentPicker.pick({
                mode: 'open',
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf], // 선택할 파일 타입을 지정
            });

            const file = res[0]; // 첫 번째 파일 선택
            setFileUri(file.uri); // 선택한 파일의 URI를 상태에 저장
            //Alert.alert('파일 선택', `선택한 파일 경로: ${file.uri}`);
            console.log('Selected file: ', file) // TODO: 나중에 지우기
            
            //서버로 사진 전송
            const response = await upload(
                {
                    uri: file.uri,
                    type: file.type, // 사진의 MIME 타입
                    name: 'photo.jpg', // TODO: 파일 이름 형식 나중에 수정
                },
                `${Config.API_URL}/upload` // TODO: url 나중에 수정
            );
    
            if (response) {
                //Alert.alert('Upload Success', '사진이 서버에 업로드되었습니다.');
                navigation.navigate('UpdateDetail');
            } else {
                Alert.alert('Error', 'Fail to process file.');
                navigation.navigate('ChooseOption');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // 사용자가 파일 선택을 취소했을 경우
                console.log('파일 선택이 취소되었습니다.');
            } else {
                console.error(err);
                Alert.alert('파일 선택 오류', '파일을 선택하는 데 오류가 발생했습니다.');
            }
            navigation.navigate('Routine');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Choose Option</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CameraShot')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickFile} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Find file</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateDetail')} style={styles.RoutineOptBtn}>
                <Text style={styles.bottonText}>Create New</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChooseOptionScreen;