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
          is_admin: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          discord_id: string;
          discord_username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          discord_id?: string;
          discord_username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean | null;
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
          is_main: boolean | null;
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
          consumption_type: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          deck_id?: string | null;
          played_at?: string;
          room_id?: string | null;
          result?: string | null;
          consumption_type?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          deck_id?: string | null;
          played_at?: string;
          room_id?: string | null;
          result?: string | null;
          consumption_type?: string;
        };
      };
      system_config: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
      user_credits: {
        Row: {
          user_id: string;
          balance: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          balance?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          balance?: number;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          code: string;
          credits: number;
          owner_id: string | null;
          redeemed_at: string | null;
          expires_at: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          credits: number;
          owner_id?: string | null;
          redeemed_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          credits?: number;
          owner_id?: string | null;
          redeemed_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      game_actions: {
        Row: {
          action_handler: string;
          action_type: string;
          created_at: string | null;
          id: string;
          match_id: string;
          payload: Json;
          player_id: string | null;
          round: number;
          sequence_number: number;
          turn: number;
        };
        Insert: {
          action_handler: string;
          action_type: string;
          created_at?: string | null;
          id?: string;
          match_id: string;
          payload: Json;
          player_id?: string | null;
          round: number;
          sequence_number: number;
          turn: number;
        };
        Update: {
          action_handler?: string;
          action_type?: string;
          created_at?: string | null;
          id?: string;
          match_id?: string;
          payload?: Json;
          player_id?: string | null;
          round?: number;
          sequence_number?: number;
          turn?: number;
        };
      };
      matches: {
        Row: {
          id: string;
          end_reason: string | null;
          ended_at: string | null;
          first_player_index: number | null;
          matching_mode: string | null;
          player1_deck: Json;
          player1_id: string | null;
          player1_jokers: Json | null;
          player1_name: string;
          player2_deck: Json;
          player2_id: string | null;
          player2_jokers: Json | null;
          player2_name: string;
          room_id: string;
          seed: number | null;
          started_at: string | null;
          total_rounds: number | null;
          total_turns: number | null;
          winner_index: number | null;
        };
        Insert: {
          id?: string;
          end_reason?: string | null;
          ended_at?: string | null;
          first_player_index?: number | null;
          matching_mode?: string | null;
          player1_deck: Json;
          player1_id?: string | null;
          player1_jokers?: Json | null;
          player1_name: string;
          player2_deck: Json;
          player2_id?: string | null;
          player2_jokers?: Json | null;
          player2_name: string;
          room_id: string;
          seed?: number | null;
          started_at?: string | null;
          total_rounds?: number | null;
          total_turns?: number | null;
          winner_index?: number | null;
        };
        Update: {
          id?: string;
          end_reason?: string | null;
          ended_at?: string | null;
          first_player_index?: number | null;
          matching_mode?: string | null;
          player1_deck?: Json;
          player1_id?: string | null;
          player1_jokers?: Json | null;
          player1_name?: string;
          player2_deck?: Json;
          player2_id?: string | null;
          player2_jokers?: Json | null;
          player2_name?: string;
          room_id?: string;
          seed?: number | null;
          started_at?: string | null;
          total_rounds?: number | null;
          total_turns?: number | null;
          winner_index?: number | null;
        };
      };
      rooms: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: string;
          name: string;
          room_id: string;
          rule: Json;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          name: string;
          room_id: string;
          rule: Json;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          name?: string;
          room_id?: string;
          rule?: Json;
        };
      };
      user_ip_logs: {
        Row: {
          id: string;
          user_id: string;
          ip_address: string;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ip_address: string;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ip_address?: string;
          recorded_at?: string;
        };
      };
    };
    Functions: {
      get_today_free_play_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      get_daily_free_plays: {
        Args: Record<string, never>;
        Returns: number;
      };
      get_user_credits: {
        Args: { p_user_id: string };
        Returns: number;
      };
      can_play: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
      consume_play_credit: {
        Args: { p_user_id: string; p_deck_id?: string; p_room_id?: string };
        Returns: { success: boolean; consumption_type: string; play_log_id: string }[];
      };
      redeem_ticket: {
        Args: { p_user_id: string; p_code: string };
        Returns: { success: boolean; credits_added: number; message: string }[];
      };
      create_ticket: {
        Args: { p_credits: number; p_expires_at?: string };
        Returns: { id: string; code: string }[];
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

export type SystemConfig = Database['public']['Tables']['system_config']['Row'];
export type UserCredits = Database['public']['Tables']['user_credits']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type TicketInsert = Database['public']['Tables']['tickets']['Insert'];

export type Match = Database['public']['Tables']['matches']['Row'];

export type UserIpLog = Database['public']['Tables']['user_ip_logs']['Row'];
