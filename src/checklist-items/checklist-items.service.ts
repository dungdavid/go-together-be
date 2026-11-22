import { Injectable, NotFoundException } from '@nestjs/common';
import { ChecklistItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly placesService: PlacesService,
  ) {}

  async create(placeId: string, dto: CreateChecklistItemDto): Promise<ChecklistItem> {
    await this.placesService.findOne(placeId);
    return this.prisma.checklistItem.create({ data: { placeId, label: dto.label } });
  }

  async findAllForPlace(placeId: string): Promise<ChecklistItem[]> {
    await this.placesService.findOne(placeId);
    return this.prisma.checklistItem.findMany({ where: { placeId } });
  }

  async findOne(id: string): Promise<ChecklistItem> {
    const item = await this.prisma.checklistItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Checklist item #${id} not found`);
    }
    return item;
  }

  async update(id: string, dto: UpdateChecklistItemDto): Promise<ChecklistItem> {
    await this.findOne(id);
    return this.prisma.checklistItem.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.checklistItem.delete({ where: { id } });
  }
}
