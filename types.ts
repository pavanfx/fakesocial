export enum AppType {
    INSTAGRAM = 'Instagram',
    WHATSAPP = 'WhatsApp',
    TIKTOK = 'TikTok',
    TINDER = 'Tinder',
}

export enum ThemeType {
    FLIRTY = 'Flirty',
    CRUSH = 'Crush',
    DATING = 'Dating',
    FRIENDLY = 'Friendly',
    BESTIE = 'Bestie',
    PROFESSIONAL = 'Professional',
    STRANGER = 'Stranger',
    IGNORE = 'Ignore',
    RED_FLAG = 'Red Flag',
    TOXIC = 'Toxic',
    ARGUMENT = 'Argument',
    BREAKUP = 'Breakup',
    EX = 'Ex',
    GOSSIP = 'Gossip',
}

export interface Message {
    id: string;
    sender: 'me' | 'them';
    content: string;
    time?: string; // Optional, can be generated or static
}

export interface ChatConfig {
    app: AppType;
    theme: ThemeType;
    themName: string;
    meName: string;
}

export interface GeneratedConversation {
    messages: Message[];
}
