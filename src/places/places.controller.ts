import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceWithRelations } from './place-with-relations';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  create(@Body() dto: CreatePlaceDto): Promise<PlaceWithRelations> {
    return this.placesService.create(dto);
  }

  @Get()
  findAll(): Promise<PlaceWithRelations[]> {
    return this.placesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PlaceWithRelations> {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaceDto): Promise<PlaceWithRelations> {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.placesService.remove(id);
  }
}
