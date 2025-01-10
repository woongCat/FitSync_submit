import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type FileData = {
    uri: string;
    type: string | null;
    name: string;
};

// Generic한 업로드 함수
export const upload = async <T extends FileData>(fileData: T, uploadUrl: string) : Promise<any> => {
    // AsyncStorage에서 userId,userType 값을 가져오기
    const access_token = await AsyncStorage.getItem('token');
    
    const formData = new FormData();

    // FormData에 파일을 추가
    formData.append('file', {
        uri: fileData.uri,
        type: fileData.type,
        name: fileData.name,
    });

    try {
    // 서버로 파일 전송
    const response = await axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': access_token,
        },
    });

    if (response.status === 200) {
        console.log('Upload successful', response.data.text);
        return response.data.text;
    } else {
        console.error('Upload failed', response.status);
        return null;
    }
    } catch (error:any) {
        console.error('Error: ', error);
        if (error.response) {
            // 서버가 오류 응답을 보냈을 때
            console.error('Server responded with error:', error.response.status); // 500 상태 코드
            console.error('Response data:', error.response.data); // 서버에서 반환한 데이터
        } else if (error.request) {
            // 요청이 서버로 전송되지 않았을 때
            console.error('No response received:', error.request);
        } else {
            // 요청을 설정하는 중에 오류가 발생했을 때
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
};