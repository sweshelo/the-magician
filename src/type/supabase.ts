/**
 * Supabaseデータベースの型定義
 * supabase gen types typescript コマンドで生成した型をベースにしています
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          discord_id: string;
          discord_username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          discord_id: string;
          discord_username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          discord_id?: string;
          discord_username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      decks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          cards: string[];
          jokers: string[];
          is_main: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          cards: string[];
          jokers?: string[];
          is_main?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          cards?: string[];
          jokers?: string[];
          is_main?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      play_logs: {
        Row: {
          id: string;
          user_id: string;
          deck_id: string | null;
          played_at: string;
          room_id: string | null;
          result: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          deck_id?: string | null;
          played_at?: string;
          room_id?: string | null;
          result?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          deck_id?: string | null;
          played_at?: string;
          room_id?: string | null;
          result?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          daily_play_limit: number;
          valid_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          daily_play_limit?: number;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          daily_play_limit?: number;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_today_play_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      can_play: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
    };
  };
}

// 便利な型エイリアス
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Deck = Database['public']['Tables']['decks']['Row'];
export type DeckInsert = Database['public']['Tables']['decks']['Insert'];
export type DeckUpdate = Database['public']['Tables']['decks']['Update'];

export type PlayLog = Database['public']['Tables']['play_logs']['Row'];
export type PlayLogInsert = Database['public']['Tables']['play_logs']['Insert'];

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
