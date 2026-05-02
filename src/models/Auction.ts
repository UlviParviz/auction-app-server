import { IAuction } from '../interfaces/IAuction';

export class Auction implements IAuction {
  public id: number;
  public title: string;
  public description: string;
  public starting_price: number;
  public current_price: number;
  public end_time: Date;

  constructor(data: IAuction) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.starting_price = data.starting_price;
    this.current_price = data.current_price;
    this.end_time = data.end_time;
  }
}