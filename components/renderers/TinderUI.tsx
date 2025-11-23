import React from 'react';
import { View, Text, Image, TextInput, FlatList } from 'react-native';
import { Message } from '../../types';
import { PhoneStatusBar } from '../PhoneStatusBar';
import { ChevronLeft, Shield, Video } from 'lucide-react-native';

interface Props {
    messages: Message[];
    themName: string;
    themPhoto?: string;
}

export const TinderUI: React.FC<Props> = ({ messages, themName, themPhoto }) => {
    const avatarSrc = themPhoto ? { uri: themPhoto } : { uri: `https://picsum.photos/seed/${themName}/100` };

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        return (
            <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start items-end gap-3'} mb-3`}>
                {!isMe && (
                    <Image
                        source={avatarSrc}
                        className="w-10 h-10 rounded-full mb-1"
                    />
                )}
                <View
                    className={`px-5 py-3 max-w-[75%] rounded-[24px]
            ${isMe
                            ? 'bg-[#2196f3] rounded-br-md'
                            : 'bg-[#f0f2f4] rounded-bl-md'
                        }
          `}
                >
                    <Text className={`text-[15px] font-medium ${isMe ? 'text-white' : 'text-gray-700'}`}>
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <PhoneStatusBar darkMode={false} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 shadow-sm z-10 bg-white">
                <View className="flex-row items-center gap-1">
                    <ChevronLeft size={30} color="#9ca3af" />
                    <View className="w-8 h-8 rounded-full bg-pink-100 overflow-hidden">
                        <Image source={avatarSrc} className="w-full h-full" />
                    </View>
                    <Text className="ml-2 font-bold text-gray-800 text-sm uppercase tracking-wide">{themName}</Text>
                </View>
                <View className="flex-row gap-4">
                    <Video size={24} color="#d1d5db" />
                    <Shield size={24} color="#d1d5db" />
                </View>
            </View>

            {/* Date Match Banner */}
            <View className="items-center py-6">
                <Text className="text-gray-400 text-xs font-medium">YOU MATCHED WITH {themName.toUpperCase()} ON 5/24/24</Text>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Footer */}
            <View className="p-3 flex-row items-center gap-2 bg-white border-t border-gray-100">
                <View className="flex-1 relative justify-center">
                    <TextInput
                        placeholder="Type a message"
                        className="w-full bg-white border border-gray-300 rounded-full h-11 px-5 text-sm"
                        editable={false}
                    />
                    <Text className="absolute right-3 text-gray-400 font-bold text-xs uppercase">Send</Text>
                </View>
            </View>
        </View>
    );
};
