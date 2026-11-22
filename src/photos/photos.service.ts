import { Injectable, NotFoundException } from '@nestjs/common';
import { Photo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreatePhotoDto): Promise<Photo> {
    await this.placesService.findOne(placeId);
    return this.prisma.photo.create({ data: { placeId, url: dto.url, caption: dto.caption } });
  }

  async findAllForPlace(placeId: string): Promise<Photo[]> {
    await this.placesService.findOne(placeId);
    return this.prisma.photo.findMany({ where: { placeId } });
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      throw new NotFoundException(`Photo #${id} not found`);
    }
    return photo;
  }

  async update(id: string, dto: UpdatePhotoDto): Promise<Photo> {
    await this.findOne(id);
    return this.prisma.photo.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.photo.delete({ where: { id } });
  }
}
