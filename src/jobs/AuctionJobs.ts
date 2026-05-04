import cron from 'node-cron';
import { AuctionService } from '../services/AuctionService';

export class AuctionJobs {
  private auctionService: AuctionService;

  constructor() {
    this.auctionService = new AuctionService();
  }

  public init(): void {
    // '* * * * *' mənası: Hər 1 dəqiqədən bir işə düş!
    cron.schedule('* * * * *', async () => {
      try {
        console.log('🔄 [CRON] Vaxtı bitmiş hərraclar yoxlanılır...');
        
        // Bu metodu AuctionService daxilində yaratmalısınız
        await this.auctionService.processEndedAuctions(); 
        
      } catch (error) {
        // Arxa plan işi çökərsə serveri çökdürməməsi üçün mütləq try-catch olmalıdır
        console.error('❌ [CRON] Hərracları yoxlayarkən xəta baş verdi:', error);
      }
    });
  }
}