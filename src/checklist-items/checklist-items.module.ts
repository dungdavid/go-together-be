import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { ChecklistItemsService } from './checklist-items.service';
import { PlacesChecklistItemsController } from './places-checklist-items.controller';
import { ChecklistItemsController } from './checklist-items.controller';

@Module({
  imports: [PlacesModule],
  controllers: [PlacesChecklistItemsController, ChecklistItemsController],
  providers: [ChecklistItemsService],
})
export class ChecklistItemsModule {}
