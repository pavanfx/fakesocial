import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Message } from '../../types';
import { PhoneStatusBar } from '../PhoneStatusBar';
import { ChevronLeft, Phone, Video, Camera, Mic, Image as ImageIcon, Heart } from 'lucide-react-native';

interface Props {
    messages: Message[];
    themName: string;
    themPhoto?: string;
    onSendMessage?: (text: string) => void;
    isTyping?: boolean;
}

export const InstagramUI: React.FC<Props> = ({ messages, themName, themPhoto, onSendMessage, isTyping }) => {
    const avatarSrc = themPhoto ? { uri: themPhoto } : { uri: `https://picsum.photos/seed/${themName}/100` };
    const [inputValue, setInputValue] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    const handleSend = () => {
        if (inputValue.trim() && onSendMessage) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'me';
        return (
            <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start items-end gap-2'} mb-2`}>
                {!isMe && (
                    <Image
                        source={avatarSrc}
                        className="w-7 h-7 rounded-full mb-1"
                    />
                )}
                <View
                    className={`max-w-[70%] px-4 py-2.5 rounded-3xl
            ${isMe
                            ? 'bg-[#3797f0] rounded-br-md'
                            : 'bg-white border border-gray-200 rounded-bl-md'
                        }
          `}
                >
                    <Text className={`text-[15px] leading-snug ${isMe ? 'text-white' : 'text-black'}`}>
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Status Bar */}
            <PhoneStatusBar darkMode={false} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
                <View className="flex-row items-center gap-3">
                    <ChevronLeft size={28} color="black" />
                    <View className="flex-row items-center gap-2">
                        <Image
                            source={avatarSrc}
                            className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <View>
                            <Text className="text-sm font-semibold text-black">{themName}</Text>
                            <Text className="text-xs text-gray-400">
                                {isTyping ? 'Typing...' : 'Active now'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex-row items-center gap-5">
                    <Phone size={24} color="black" />
                    <Video size={24} color="black" />
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                ListFooterComponent={
                    <View>
                        {isTyping ? (
                            <View className="flex-row justify-start items-end gap-2 mb-2">
                                <Image source={avatarSrc} className="w-7 h-7 rounded-full mb-1" />
                                <View className="bg-white border border-gray-200 rounded-3xl rounded-bl-md px-4 py-3">
                                    <Text className="text-gray-400 text-xs">...</Text>
                                </View>
                            </View>
                        ) : (
                            <View className="flex-row justify-end mt-1 px-1">
                                <Text className="text-[10px] text-gray-400 font-medium">Seen</Text>
                            </View>
                        )}
                    </View>
                }
            />

            {/* Footer */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View className="px-3 py-3 flex-row items-center gap-3 bg-white">
                    <View className="bg-gray-100 flex-1 rounded-full h-11 flex-row items-center px-1">
                        <View className="bg-blue-500 p-1.5 rounded-full ml-1">
                            <Camera size={18} color="white" />
                        </View>
                        <TextInput
                            placeholder="Message..."
                            className="flex-1 ml-2 text-sm text-black"
                            placeholderTextColor="gray"
                            value={inputValue}
                            onChangeText={setInputValue}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                        />
                        <View className="flex-row items-center gap-3 mr-3">
                            <Mic size={22} color="black" />
                            <ImageIcon size={22} color="black" />
                            <Heart size={22} color="black" />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};
