import "./global.css";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Image, SafeAreaView, StatusBar } from 'react-native';
import { AppType, ThemeType, Message } from './types';
import { generateConversation, generateReply } from './services/geminiService';
import { ChatPreview } from './components/ChatPreview';
import { Sparkles, Instagram, MessageCircle, Music2, Flame, Upload, X, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const App: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<AppType>(AppType.INSTAGRAM);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(ThemeType.FLIRTY);
  const [themName, setThemName] = useState<string>('Crush ❤️');
  const [themPhoto, setThemPhoto] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowPreview(true); // Show preview immediately with loading state

    // Small delay to allow UI to show loading state immediately
    setTimeout(async () => {
      const msgs = await generateConversation(selectedApp, selectedTheme, themName);
      setMessages(msgs);
      setIsLoading(false);
    }, 100);
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      content: text,
      time: 'Now'
    };
    setMessages(prev => [...prev, newMessage]);

    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const reply = await generateReply(selectedApp, selectedTheme, messages, text);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 2000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setThemPhoto(result.assets[0].uri);
    }
  };

  const getAppColor = (app: AppType) => {
    switch (app) {
      case AppType.INSTAGRAM: return ['#facc15', '#ef4444', '#a855f7']; // Gradient colors approximation
      case AppType.WHATSAPP: return ['#25D366', '#25D366'];
      case AppType.TIKTOK: return ['#000000', '#000000'];
      case AppType.TINDER: return ['#ec4899', '#f97316'];
      default: return ['#e5e7eb', '#e5e7eb'];
    }
  };

  const AppIcon = ({ app, selected }: { app: AppType, selected: boolean }) => {
    const size = 20;
    const color = selected ? 'white' : 'gray';
    switch (app) {
      case AppType.INSTAGRAM: return <Instagram size={size} color={color} />;
      case AppType.WHATSAPP: return <MessageCircle size={size} color={color} />;
      case AppType.TIKTOK: return <Music2 size={size} color={color} />;
      case AppType.TINDER: return <Flame size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1 px-6">
        <View className="mt-6 mb-8">
          <Text className="text-2xl font-bold text-indigo-600 flex-row items-center">
            <Sparkles size={24} color="#4f46e5" /> SocialGen AI
          </Text>
          <Text className="text-gray-500 text-sm mt-2">Create realistic fake chat screenshots.</Text>
        </View>

        {/* App Selection */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Platform</Text>
          <View className="flex-row flex-wrap gap-3">
            {Object.values(AppType).map((app) => (
              <TouchableOpacity
                key={app}
                onPress={() => setSelectedApp(app)}
                className={`w-[48%] flex-row items-center gap-3 p-3 rounded-xl border ${selectedApp === app ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
              >
                <LinearGradient
                  colors={selectedApp === app ? getAppColor(app) : ['#e5e7eb', '#e5e7eb']}
                  className="p-2 rounded-lg"
                >
                  <AppIcon app={app} selected={selectedApp === app} />
                </LinearGradient>
                <Text className={`font-semibold text-sm ${selectedApp === app ? 'text-indigo-900' : 'text-gray-600'}`}>{app}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Selection */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Conversation Vibe</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.values(ThemeType).map((theme) => (
              <TouchableOpacity
                key={theme}
                onPress={() => setSelectedTheme(theme)}
                className={`px-4 py-2 rounded-full ${selectedTheme === theme ? 'bg-black' : 'bg-gray-100'}`}
              >
                <Text className={`text-sm font-medium ${selectedTheme === theme ? 'text-white' : 'text-gray-600'}`}>{theme}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Details */}
        <View className="mb-8 gap-4">
          <View>
            <Text className="text-xs text-gray-500 mb-1">Person Name</Text>
            <TextInput
              value={themName}
              onChangeText={setThemName}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">Profile Photo</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={pickImage}
                className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 items-center justify-center overflow-hidden"
              >
                {themPhoto ? (
                  <Image source={{ uri: themPhoto }} className="w-full h-full" />
                ) : (
                  <Upload size={20} color="gray" />
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <TouchableOpacity onPress={pickImage}>
                  <Text className="text-sm font-medium text-indigo-600">Upload Photo</Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-400 mt-0.5">Or leave empty for random</Text>
              </View>
              {themPhoto && (
                <TouchableOpacity onPress={() => setThemPhoto(undefined)}>
                  <X size={16} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Action */}
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 rounded-xl shadow-lg flex-row items-center justify-center gap-2 mb-10"
        >
          {isLoading ? (
            <Text className="text-white font-bold">Generating...</Text>
          ) : (
            <>
              <Sparkles size={20} color="white" />
              <Text className="text-white font-bold">Generate Conversation</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            <View className="flex-row items-center justify-between px-4 py-2 bg-black z-10">
              <TouchableOpacity onPress={() => setShowPreview(false)} className="p-2">
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white font-bold">Preview</Text>
              <View className="w-8" />
            </View>
            <ChatPreview
              app={selectedApp}
              messages={messages}
              themName={themName}
              themPhoto={themPhoto}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;
