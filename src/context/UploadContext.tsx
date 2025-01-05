import axios from 'axios';

type FileData = {
    uri: string;
    type: string | null;
    name: string;
};

// Generic한 업로드 함수
export const upload = async <T extends FileData>(fileData: T, uploadUrl: string) => {
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
            // TODO: 인증 헤더나 추가적인 헤더가 필요하면 여기에 추가
            // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        },
    });

    if (response.status === 200) {
        console.log('Upload successful:', response.data);
        return true;
        } else {
            console.error('Upload failed:', response.status);
            return false;
    }
    } catch (error) {
        console.error('Upload error:', error);
        return false;
    }
};