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

type CameraShotScreenNavigationProp = NativeStackNavigationProp<RoutineStackParamList, 'Routine'>

interface CameraShotScreenProps {
    navigation : CameraShotScreenNavigationProp
}

const CameraShotScreen : React.FC<CameraShotScreenProps> = ({navigation}) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [photoUri, setPhotoUri] = useState(null);
    const devices = useCameraDevices();
    const device = devices.find(device => device.position === 'back'); // 후면 카메라 선택
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        const getPermission = async () => {
            const Permission = await Camera.requestCameraPermission();
            setHasPermission(Permission === 'granted');
            };
            getPermission();
    }, []);

    if (!device) {
        return <Text>The camara is not detected.</Text>;
    }

    if (!hasPermission) {
        return <Text>The permission for the camera is required.</Text>;
    }

    const takePicture = async () => {
        // cameraRef.current가 null이 아닌지 확인
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto();
                Alert.alert('Photo Taken', `사진이 저장되었습니다: ${photo.path}`);
                // photo file 서버로 전송 하는 코드 추가 필요
                navigation.navigate('Render');
            } catch (error) {
                Alert.alert('Error', '사진을 찍는 데 문제가 발생했습니다.');
                console.error(error);
            }
        } else {
            Alert.alert('Error', '카메라 참조가 아직 초기화되지 않았습니다.');
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