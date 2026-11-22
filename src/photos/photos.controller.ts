import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { Photo } from '@prisma/client';
import { PhotosService } from './photos.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePhotoDto): Promise<Photo> {
    return this.photosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.photosService.remove(id);
  }
}
