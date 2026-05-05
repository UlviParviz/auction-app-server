import cron from 'node-cron';
import { AuctionService } from '../services/AuctionService';

export class AuctionJobs {
  private auctionService: AuctionService;

  constructor() {
    this.auctionService = new AuctionService();
  }

  public init(): void {
    cron.schedule('* * * * *', async () => {
      try {
        console.log('🔄 [CRON] Vaxtı bitmiş hərraclar yoxlanılır...');
        
        await this.auctionService.processEndedAuctions(); 
        
      } catch (error) {
        console.error('❌ [CRON] Hərracları yoxlayarkən xəta baş verdi:', error);
      }
    });
  }
}