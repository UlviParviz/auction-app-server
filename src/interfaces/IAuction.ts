import { AuctionStatus } from "../enums/auction/AuctionStatusEnum";

export interface IAuction {
  id: number;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  end_time: string | Date;
  status: AuctionStatus;
  owner_id: number;
  highest_bidder_id: number | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IAuctionWithOwner extends IAuction {
  owner_first_name: string;
  owner_last_name: string;
}

export interface IBidWithAuction {
  bid_id: number;
  bid_amount: number;
  bid_time: string | Date;
  auction_id: number;
  auction_title: string;
  current_auction_price: number;
  auction_status: AuctionStatus;
}

export interface IBidDetail {
  id: number;
  amount: number;
  created_at: string | Date;
  first_name: string;
  last_name: string;
}

export interface IAuctionWithBids extends IAuction {
  bids: IBidDetail[];
}