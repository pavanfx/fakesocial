import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { Message } from '../../types';
import { PhoneStatusBar } from '../PhoneStatusBar';
import { ArrowLeft, Video, Phone, Plus, Camera, Mic, CheckCheck } from 'lucide-react-native';

interface Props {
    messages: Message[];
    themName: string;
    themPhoto?: string;
    onSendMessage?: (text: string) => void;
    isTyping?: boolean;
}

export const WhatsAppUI: React.FC<Props> = ({ messages, themName, themPhoto, onSendMessage, isTyping }) => {
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
            <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} mb-2 px-2`}>
                <View
                    className={`max-w-[75%] px-3 py-1.5 rounded-lg shadow-sm
            ${isMe
                            ? 'bg-[#dcf8c6] rounded-tr-none'
                            : 'bg-white rounded-tl-none'
                        }
          `}
                >
                    <Text className="text-[14.2px] leading-[19px] text-black">
                        {item.content}
                    </Text>
                    <View className="flex-row justify-end items-center gap-1 mt-1 ml-2 self-end">
                        <Text className="text-[10px] text-gray-500">{item.time || '9:42'}</Text>
                        {isMe && <CheckCheck size={14} color="#53bdeb" />}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#efe7dd]">
            <ImageBackground
                source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
                className="flex-1"
                resizeMode="cover"
                imageStyle={{ opacity: 0.1 }}
            >
                {/* Status Bar */}
                <View className="bg-[#008069]">
                    <PhoneStatusBar darkMode={true} />
                </View>

                {/* Header */}
                <View className="bg-[#008069] flex-row items-center justify-between px-2 py-2 shadow-sm">
                    <View className="flex-row items-center gap-1">
                        <ArrowLeft size={24} color="white" />
                        <Image
                            source={avatarSrc}
                            className="w-9 h-9 rounded-full ml-1"
                        />
                        <View className="ml-2">
                            <Text className="font-medium text-base text-white" numberOfLines={1}>{themName}</Text>
                            <Text className="text-xs text-white/80">
                                {isTyping ? 'typing...' : 'online'}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-5 mr-2">
                        <Video size={22} color="white" />
                        <Phone size={20} color="white" />
                        <View className="flex-col gap-[3px]">
                            <View className="w-1 h-1 bg-white rounded-full"></View>
                            <View className="w-1 h-1 bg-white rounded-full"></View>
                            <View className="w-1 h-1 bg-white rounded-full"></View>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                    ListHeaderComponent={
                        <View className="items-center my-2">
                            <View className="bg-[#e1f3fb] px-2 py-1 rounded-lg">
                                <Text className="text-gray-600 text-[11px] font-medium uppercase">Today</Text>
                            </View>
                        </View>
                    }
                />

                {/* Footer */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                    <View className="px-2 py-2 flex-row items-end gap-2 mb-1">
                        <View className="bg-white flex-1 rounded-[24px] min-h-[46px] flex-row items-center px-3 py-2 shadow-sm">
                            <View className="bg-gray-300 rounded-full p-0.5 mr-2">
                                <Plus size={18} color="gray" />
                            </View>
                            <TextInput
                                placeholder="Message"
                                className="flex-1 text-base text-black"
                                placeholderTextColor="gray"
                                value={inputValue}
                                onChangeText={setInputValue}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                            />
                            <View className="flex-row items-center gap-3 ml-2">
                                <Camera size={22} color="gray" />
                            </View>
                        </View>
                        <View className="w-11 h-11 bg-[#008069] rounded-full items-center justify-center shadow-md">
                            <Mic size={20} color="white" />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
};
