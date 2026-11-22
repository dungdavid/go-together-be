import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { placeWithRelationsArgs, PlaceWithRelations } from './place-with-relations';

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePlaceDto): Promise<PlaceWithRelations> {
    return this.prisma.place.create({
      data: {
        name: dto.name,
        lat: dto.lat,
        lng: dto.lng,
        region: dto.region,
        visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : undefined,
        coverPhotoUrl: dto.coverPhotoUrl,
        notes: dto.notes,
        perspective: dto.perspective,
      },
      ...placeWithRelationsArgs,
    });
  }

  findAll(): Promise<PlaceWithRelations[]> {
    return this.prisma.place.findMany(placeWithRelationsArgs);
  }

  async findOne(id: string): Promise<PlaceWithRelations> {
    const place = await this.prisma.place.findUnique({ where: { id }, ...placeWithRelationsArgs });
    if (!place) {
      throw new NotFoundException(`Place #${id} not found`);
    }
    return place;
  }

  async update(id: string, dto: UpdatePlaceDto): Promise<PlaceWithRelations> {
    await this.findOne(id);
    return this.prisma.place.update({
      where: { id },
      data: {
        name: dto.name,
        lat: dto.lat,
        lng: dto.lng,
        region: dto.region,
        visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : undefined,
        coverPhotoUrl: dto.coverPhotoUrl,
        notes: dto.notes,
        perspective: dto.perspective,
      },
      ...placeWithRelationsArgs,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.place.delete({ where: { id } });
  }
}
