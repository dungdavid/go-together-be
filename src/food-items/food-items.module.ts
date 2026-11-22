import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { FoodItemsService } from './food-items.service';
import { PlacesFoodItemsController } from './places-food-items.controller';
import { FoodItemsController } from './food-items.controller';

@Module({
  imports: [PlacesModule],
  controllers: [PlacesFoodItemsController, FoodItemsController],
  providers: [FoodItemsService],
})
export class FoodItemsModule {}
