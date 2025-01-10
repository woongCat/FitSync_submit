import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 고객 정보 타입 정의
interface CustomerProfile {
    id: string;
    name: string;
    photo: string;
    trainerId: string | null; // 담당 트레이너 ID
}

// 트레이너 정보 타입 정의
interface TrainerProfile {
    id: string;
    name: string;
    photo: string;
    customers: CustomerProfile[]; // 담당 고객 리스트
    availableTimes: string[]; // 예약 가능 시간 (우선순위 낮음)
}

// Context 타입 정의
interface ProfileContextType {
    customerProfile: CustomerProfile | null;
    trainerProfile: TrainerProfile | null;
    fetchCustomerProfile: () => void;
    updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
    fetchTrainerProfile: () => void;
    updateTrainerProfile: (data: Partial<TrainerProfile>) => void;
}

// Context 기본값
const ProfileContext = createContext<ProfileContextType>({
    customerProfile: null,
    trainerProfile: null,
    fetchCustomerProfile: () => {},
    updateCustomerProfile: () => {},
    fetchTrainerProfile: () => {},
    updateTrainerProfile: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null);

    // 고객 프로필 데이터 가져오기
    const fetchCustomerProfile = async () => {
        try {
            const response = await axios.get("/api/customer/profile");
            setCustomerProfile(response.data);
        } catch (error) {
            console.error("Error fetching customer profile:", error);
        }
    };

    // 고객 프로필 업데이트
    const updateCustomerProfile = async (data: Partial<CustomerProfile>) => {
        try {
            const response = await axios.put("/api/customer/profile", data);
            setCustomerProfile((prev) => (prev ? { ...prev, ...response.data } : null));
        } catch (error) {
            console.error("Error updating customer profile:", error);
        }
    };

    // 트레이너 프로필 데이터 가져오기
    const fetchTrainerProfile = async () => {
        try {
            const response = await axios.get("/api/trainer/profile");
            setTrainerProfile(response.data);
        } catch (error) {
            console.error("Error fetching trainer profile:", error);
        }
    };

    // 트레이너 프로필 업데이트
    const updateTrainerProfile = async (data: Partial<TrainerProfile>) => {
        try {
            const response = await axios.put("/api/trainer/profile", data);
            setTrainerProfile((prev) => (prev ? { ...prev, ...response.data } : null));
        } catch (error) {
            console.error("Error updating trainer profile:", error);
        }
    };

    useEffect(() => {
        // 초기 데이터 로드
        fetchCustomerProfile();
        fetchTrainerProfile();
    }, []);

    return (
        <ProfileContext.Provider
            value={{
                customerProfile,
                trainerProfile,
                fetchCustomerProfile,
                updateCustomerProfile,
                fetchTrainerProfile,
                updateTrainerProfile,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);