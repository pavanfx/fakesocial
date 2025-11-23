import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppType, Message } from '../types';
import { InstagramUI } from './renderers/InstagramUI';
import { WhatsAppUI } from './renderers/WhatsAppUI';
import { TikTokUI } from './renderers/TikTokUI';
import { TinderUI } from './renderers/TinderUI';

interface ChatPreviewProps {
    app: AppType;
    messages: Message[];
    themName: string;
    themPhoto?: string;
    isLoading: boolean;
    onSendMessage?: (text: string) => void;
    isTyping?: boolean;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({
    app,
    messages,
    themName,
    themPhoto,
    isLoading,
    onSendMessage,
    isTyping
}) => {

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="font-medium text-gray-500 mt-4">Generating {app} chat...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {app === AppType.INSTAGRAM && <InstagramUI messages={messages} themName={themName} themPhoto={themPhoto} onSendMessage={onSendMessage} isTyping={isTyping} />}
            {app === AppType.WHATSAPP && <WhatsAppUI messages={messages} themName={themName} themPhoto={themPhoto} onSendMessage={onSendMessage} isTyping={isTyping} />}
            {app === AppType.TIKTOK && <TikTokUI messages={messages} themName={themName} themPhoto={themPhoto} onSendMessage={onSendMessage} isTyping={isTyping} />}
            {app === AppType.TINDER && <TinderUI messages={messages} themName={themName} themPhoto={themPhoto} />}
        </View>
    );
};
