import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ChecklistItem } from '@prisma/client';
import { ChecklistItemsService } from './checklist-items.service';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Controller('checklist-items')
export class ChecklistItemsController {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistItemDto): Promise<ChecklistItem> {
    return this.checklistItemsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.checklistItemsService.remove(id);
  }
}
