import axios from 'axios';
import Config from 'react-native-config';

export interface TrainerSchedule {
    schedule_id: string;
    trainer_id: string;
    customer_id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    status: string; // 예약 상태 (예: "예약", "완료")
}

// 
const fetchTrainerSchedule = async (trainerId: string): Promise<TrainerSchedule[]> => {
    try {
        const result = await axios.get(`${Config.API_URL}/api/data/pt_schedule`, {
            params: { trainerId },
        });

        if (result.status === 200) {
            return result.data.schedules; // 서버에서 `schedules` 키로 데이터 반환
        } else {
            console.error('Failed to fetch schedule:', result.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching trainer schedule:', error);
        if (axios.isAxiosError(error)) {
            console.error('Error details:', error.response?.data);
        } else {
            console.error('Unexpected error occurred');
        }
        return [];
    }
};