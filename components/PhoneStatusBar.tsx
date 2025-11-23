import React from 'react';
import { View, Text } from 'react-native';
import { Wifi, Battery, Signal } from 'lucide-react-native';

interface PhoneStatusBarProps {
    darkMode?: boolean;
}

export const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({ darkMode = false }) => {
    const color = darkMode ? 'white' : 'black';

    return (
        <View className="flex-row justify-between items-center px-6 py-2">
            <Text className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>9:41</Text>
            <View className="flex-row items-center gap-1.5">
                <Signal size={14} color={color} strokeWidth={2.5} />
                <Wifi size={14} color={color} strokeWidth={2.5} />
                <Battery size={16} color={color} strokeWidth={2.5} />
            </View>
        </View>
    );
};
