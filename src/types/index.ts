export type Profile = {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  favorite_albums: string[] | null;
  top_songs: string[] | null;
  social_media_links: string[] | null;
};

export interface Notification {
  id: number;
  user_id: string;
  sender_id: string;
  type: 'friend_request';
  reference_id: number;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  sender_avatar_url: string;
}
