import { AuctionJobs } from './AuctionJobs';

export class JobManager {
  public static startAll(): void {
    console.log('⏳ Arxa plan işləri (Cron Jobs) başladılır...');
    
    new AuctionJobs().init();
  }
}