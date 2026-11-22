import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

@Injectable()
export class FoodItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreateFoodItemDto): Promise<FoodItem> {
    await this.placesService.findOne(placeId);
    return this.prisma.foodItem.create({
      data: { placeId, name: dto.name, notes: dto.notes, rating: dto.rating, photoUrl: dto.photoUrl },
    });
  }

  async findAllForPlace(placeId: string): Promise<FoodItem[]> {
    await this.placesService.findOne(placeId);
    return this.prisma.foodItem.findMany({ where: { placeId } });
  }

  async findOne(id: string): Promise<FoodItem> {
    const item = await this.prisma.foodItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Food item #${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateFoodItemDto): Promise<FoodItem> {
    await this.findOne(id);
    return this.prisma.foodItem.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.foodItem.delete({ where: { id } });
  }
}
