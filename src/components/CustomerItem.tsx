import React, { useState, useEffect } from "react";
import { Alert, Text, View, FlatList, Button, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { PTSchedule } from "../context/PTScheduleContext";
import styles from "../style/styles";

interface ScheduleItemProps { 
    schedule: PTSchedule;
    onScheduleSelect: (id: string) => void;
    onConfirm: (id: string) => void;
}

const CustomerItem: React.FC<ScheduleItemProps> = React.memo(({ schedule, onScheduleSelect, onConfirm }) => {
    const handleScheduleSelect = () => {
        onScheduleSelect(schedule.scheduleId);
    };

    const handleConfirm = async () => {
        try {
            await onConfirm(schedule.scheduleId);
            Alert.alert("Success", "The schedule has been confirmed.");
        } catch (error) {
            Alert.alert("Error", "Failed to confirm the schedule.");
        }
    };

    return (
        <View style={styles.scheduleCard}>
            <Text style={styles.scheduleHeader}>{schedule.trainerId}</Text>
            <Text style={styles.scheduleDescription}>Date: {schedule.sessionDate}</Text>
            <Text style={styles.scheduleDescription}>Start Time: {schedule.startTime}</Text>
            <Text style={styles.scheduleDescription}>End Time: {schedule.endTime}</Text>
            <Text style={styles.scheduleDescription}>Reservation Status: {schedule.status}</Text>
            
            <FlatList
                data={schedule.sessionDate}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.scheduleTimeSlot}>
                        <Text>{item}</Text>
                    </View>
                )}
            />

            <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirm Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.selectBtn} 
                onPress={handleScheduleSelect}>
                <Text style={styles.selectBtnText}>Select Schedule</Text>
            </TouchableOpacity>
        </View>
    );
});


export default CustomerItem;