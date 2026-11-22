import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FoodItem } from '@prisma/client';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';

@Controller('places/:placeId/food-items')
export class PlacesFoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  create(@Param('placeId') placeId: string, @Body() dto: CreateFoodItemDto): Promise<FoodItem> {
    return this.foodItemsService.create(placeId, dto);
  }

  @Get()
  findAll(@Param('placeId') placeId: string): Promise<FoodItem[]> {
    return this.foodItemsService.findAllForPlace(placeId);
  }
}
