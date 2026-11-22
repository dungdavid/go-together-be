import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Photo } from '@prisma/client';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Controller('places/:placeId/photos')
export class PlacesPhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Param('placeId') placeId: string, @Body() dto: CreatePhotoDto): Promise<Photo> {
    return this.photosService.create(placeId, dto);
  }

  @Get()
  findAll(@Param('placeId') placeId: string): Promise<Photo[]> {
    return this.photosService.findAllForPlace(placeId);
  }
}
