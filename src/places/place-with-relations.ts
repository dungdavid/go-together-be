import { Prisma } from '@prisma/client';

export const placeWithRelationsArgs = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  include: { checklist: true, foodList: true, photos: true },
});

export type PlaceWithRelations = Prisma.PlaceGetPayload<typeof placeWithRelationsArgs>;
