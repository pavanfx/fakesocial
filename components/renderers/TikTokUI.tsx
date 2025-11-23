import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Message } from '../../types';
import { PhoneStatusBar } from '../PhoneStatusBar';
import { ChevronLeft, MoreHorizontal, Flag, ArrowUpCircle } from 'lucide-react-native';

interface Props {
    messages: Message[];
    themName: string;
    themPhoto?: string;
    onSendMessage?: (text: string) => void;
    isTyping?: boolean;
}

export const TikTokUI: React.FC<Props> = ({ messages, themName, themPhoto, onSendMessage, isTyping }) => {
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
            <View className={`flex-row items-end gap-2 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                    <Image
                        source={avatarSrc}
                        className="w-10 h-10 rounded-full"
                    />
                )}
                <View
                    className={`px-4 py-3 max-w-[75%] rounded-2xl
            ${isMe
                            ? 'bg-[#2856ff] rounded-br-sm'
                            : 'bg-[#f1f1f2] rounded-bl-sm'
                        }
          `}
                >
                    <Text className={`text-[15px] ${isMe ? 'text-white' : 'text-black'}`}>
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
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center gap-4">
                    <ChevronLeft size={28} color="black" />
                    <View>
                        <Text className="font-bold text-base text-black">{themName}</Text>
                        {isTyping && <Text className="text-xs text-gray-400">Typing...</Text>}
                    </View>
                </View>
                <View className="flex-row gap-4">
                    <Flag size={22} color="black" style={{ transform: [{ rotate: '12deg' }] }} />
                    <MoreHorizontal size={24} color="black" />
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
                ListHeaderComponent={
                    <Text className="text-center text-xs text-gray-400 py-2">Today 4:20 PM</Text>
                }
                ListFooterComponent={
                    isTyping ? (
                        <View className="flex-row items-end gap-2">
                            <Image source={avatarSrc} className="w-10 h-10 rounded-full" />
                            <View className="bg-[#f1f1f2] rounded-2xl rounded-bl-sm px-4 py-3">
                                <Text className="text-gray-400 text-xs">...</Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Footer */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View className="p-3 border-t border-gray-100 flex-row items-center gap-3 bg-white">
                    <View className="flex-1 bg-[#f1f1f2] rounded-full h-11 justify-center px-4">
                        <TextInput
                            placeholder="Send a message..."
                            className="text-sm text-black"
                            placeholderTextColor="gray"
                            value={inputValue}
                            onChangeText={setInputValue}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                        />
                    </View>
                    <TouchableOpacity onPress={handleSend} disabled={!inputValue.trim()}>
                        <ArrowUpCircle size={32} color="#2856ff" style={{ opacity: inputValue.trim() ? 1 : 0.5 }} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};
