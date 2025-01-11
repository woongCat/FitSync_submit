import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, Dimensions } from "react-native";
import React, { useContext, useState } from "react";
import { LineChart } from 'react-native-chart-kit';
import { AnalyticsContext } from "../context/AnalyticsContext";

interface AnalyticsInfoProps {
    userType : string;
}

const AnalyticsInfo: React.FC<AnalyticsInfoProps> = React.memo(({userType}) => {

    const { data, fetchAnalyticsData } = useContext(AnalyticsContext);
    const [chartWidth, setChartWidth] = useState<number>(0);  // 차트의 너비를 저장할 상태

    // 화면의 너비를 가져옵니다.
    const screenWidth = Dimensions.get('window').width;

    // 부모 컨테이너의 layout을 계산하여 chartWidth에 저장
    const onLayoutHandler = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setChartWidth(width);  // 부모 컨테이너의 너비를 저장
    };

    // 임의의 Test 데이터
    const testData = {
        labels: ['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05'], // 날짜 데이터
        datasets: [
            {
            data: [20, 45, 28, 80, 99], // 해당 날짜에 대한 데이터 값
            },
        ],
    };

    return (
        <View style={{ flex: 1 }}>
            {userType === 'customer' && (
                <View style={{ flex : 1}} onLayout={onLayoutHandler}>
                    <LineChart
                        data={testData}
                        width={chartWidth}
                        height={220}
                        chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        }}
                    />
                </View>
            )}

            {userType === 'trainer' && (
                <View style={{ flex : 1}} onLayout={onLayoutHandler}>
                    <LineChart
                        data={testData}
                        width={chartWidth}
                        height={220}
                        chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        }}
                    />
                </View>
            )}
        </View>
    );
});

export default AnalyticsInfo;