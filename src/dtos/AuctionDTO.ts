import { z } from 'zod';

export const PlaceBidSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Hərrac ID-si rəqəm olmalıdır'),
  }),
  body: z.object({
    amount: z.number().positive('Təklif məbləği müsbət rəqəm olmalıdır'),
  }),
});

export const CreateAuctionSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Başlıq ən azı 3 simvol olmalıdır'),
    description: z.string().min(10, 'Təsvir ən azı 10 simvol olmalıdır'),
    starting_price: z.number().positive('Başlanğıc qiymət müsbət rəqəm olmalıdır'),
    end_time: z.string().datetime('Düzgün tarix formatı göndərin (məs: 2026-05-04T15:00:00Z)')
  })
});

export type PlaceBidDTO = z.infer<typeof PlaceBidSchema>['body'];
export type CreateAuctionDTO = z.infer<typeof CreateAuctionSchema>['body'];