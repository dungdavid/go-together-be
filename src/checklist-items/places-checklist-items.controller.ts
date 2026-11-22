import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChecklistItem } from '@prisma/client';
import { ChecklistItemsService } from './checklist-items.service';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';

@Controller('places/:placeId/checklist-items')
export class PlacesChecklistItemsController {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Post()
  create(@Param('placeId') placeId: string, @Body() dto: CreateChecklistItemDto): Promise<ChecklistItem> {
    return this.checklistItemsService.create(placeId, dto);
  }

  @Get()
  findAll(@Param('placeId') placeId: string): Promise<ChecklistItem[]> {
    return this.checklistItemsService.findAllForPlace(placeId);
  }
}
