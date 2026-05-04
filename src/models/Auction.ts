import { IAuction } from '../interfaces/IAuction';

export class Auction implements IAuction {
  public id: number;
  public title: string;
  public description: string;
  public starting_price: number;
  public current_price: number;
  public end_time: Date;
  public highest_bidder_id: number;
  public owner_id: number;


  constructor(data: IAuction) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.starting_price = data.starting_price;
    this.current_price = data.current_price;
    this.end_time = data.end_time;
    this.highest_bidder_id = data.highest_bidder_id;
    this.owner_id = data.owner_id;
  }
}