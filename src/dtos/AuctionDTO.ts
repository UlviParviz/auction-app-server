import { z } from 'zod';

export class AuctionDTO {
  public static readonly PlaceBidSchema = z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Hərrac ID-si rəqəm olmalıdır'),
    }),
    body: z.object({
      amount: z.number().positive('Təklif məbləği müsbət rəqəm olmalıdır'),
    }),
  });

  public static readonly CreateAuctionSchema = z.object({
    body: z.object({
      title: z.string().min(3, 'Başlıq ən azı 3 simvol olmalıdır'),
      description: z.string().min(10, 'Təsvir ən azı 10 simvol olmalıdır'),
      starting_price: z.number().positive('Başlanğıc qiymət müsbət rəqəm olmalıdır'),
      end_time: z.string().datetime('Düzgün tarix formatı göndərin (məs: 2026-05-04T15:00:00Z)'),
    }),
  });
}

export namespace AuctionTypes {
  export type PlaceBid = z.infer<typeof AuctionDTO.PlaceBidSchema>['body'];
  export type CreateAuction = z.infer<typeof AuctionDTO.CreateAuctionSchema>['body'];
}