import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RoutineStackParamList } from '../navigation/RoutineNavigation';
import { upload } from '../context/UploadContext';
import RNFS from 'react-native-fs';
import Config  from "react-native-config"; // .env에서 변수를 가져옴

type CameraShotScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface CameraShotScreenProps {
    navigation : CameraShotScreenNavigationProp
}

const CameraShotScreen : React.FC<CameraShotScreenProps> = ({navigation}) => {
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
                        name: fileName, // TODO: 파일 이름 형식 나중에 수정
                    },
                    `${Config.API_URL}/upload` // TODO: url 나중에 수정
                );
        
                if (response) {
                    //Alert.alert('Upload Success', '사진이 서버에 업로드되었습니다.');
                    navigation.navigate('UpdateRoutine');
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
});

export default CameraShotScreen;

function requestStoragePermission() {
    throw new Error('Function not implemented.');
}
