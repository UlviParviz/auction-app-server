export interface IAuction {
  id: number;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  end_time: Date;
  highest_bidder_id: number;
  owner_id: number;
  status: string;
}