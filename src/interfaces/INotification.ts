export interface INotification {
  id: number;
  user_id: number;
  auction_id?: number;
  type: 'OUTBID' | 'NEW_BID' | 'AUCTION_WON' | 'SYSTEM';
  message: string;
  is_read: boolean;
  created_at: Date;
}