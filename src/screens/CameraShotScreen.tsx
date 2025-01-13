import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { upload } from '../context/UploadContext';
import RNFS from 'react-native-fs';
import Config  from "react-native-config"; // .env에서 변수를 가져옴
import { Routine } from '../context/RecordContext';

type CameraShotScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'RoutineDetail'>

interface CameraShotScreenProps {
    navigation : CameraShotScreenNavigationProp
}

const CameraShotScreen : React.FC<CameraShotScreenProps> = ({navigation}) => {
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [photoUri, setPhotoUri] = useState('');
    const devices = useCameraDevices();
    const device = devices.find(device => device.position === 'back'); // 후면 카메라 선택
    const cameraRef = useRef<Camera | null>(null);
    
    // 카메라 권한 요청
    useEffect(() => {
        const getCameraPermission = async () => {
            const Permission = await Camera.requestCameraPermission();
                if (Permission === 'granted') {
                    setHasCameraPermission(true);
                } else {
                    Alert.alert("Permission Denied", "You need camera permission to upload files.");
                    setHasCameraPermission(false);
                }
            };              
        getCameraPermission();
    }, []);

    // 카메라 장치가 없거나 권한이 없는 경우 처리
    if (!device) {
        return <Text>The camara is not detected.</Text>;
    }

    // 사진 찍기
    const takePicture = async () => {
        // cameraRef.current가 null이 아닌지 확인
        if (cameraRef.current) {
            try {
                setIsUploadLoading (true);

                const photo = await cameraRef.current.takePhoto();
                //Alert.alert('Photo Taken', `사진이 저장되었습니다: ${photo.path}`);

                const fileName = `photo_${Date.now()}.jpg`;

                const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;  // Android에서는 ExternalDirectoryPath를 사용
                
                await RNFS.copyFile(photo.path, destPath);
                setPhotoUri(destPath);

                const response = await upload(
                    {
                        uri: `file://${destPath}`,
                        type: 'image/jpeg', // 사진의 MIME 타입
                        name: fileName,
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
                    Alert.alert('Error', 'Fail to process photo.');
                    navigation.navigate('ChooseOption');
                }
            } catch (error) {
                Alert.alert('Error', 'Problem occurred during taking a photo.');
                console.error(error);
                navigation.navigate('RoutineDetail');
            }
        } else {
            Alert.alert('Error', 'Camera Reference has not been reset.');
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true} // 카메라 활성화 상태
                photo={true}
            />
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>

            {/* 로딩 상태일 때 Modal 표시 */}
            {isUploadLoading && (
                <Modal transparent animationType="fade">
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'transparent',
        borderRadius: 35,
        borderWidth: 5,
        borderColor: 'white',
        padding: 20,
    },
    captureButtonText: {
        color: 'white',
        fontSize: 20,
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

export default CameraShotScreen;