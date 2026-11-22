import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { FoodItem } from '@prisma/client';
import { FoodItemsService } from './food-items.service';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFoodItemDto): Promise<FoodItem> {
    return this.foodItemsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.foodItemsService.remove(id);
  }
}
