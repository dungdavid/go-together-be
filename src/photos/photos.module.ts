import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { PhotosService } from './photos.service';
import { PlacesPhotosController } from './places-photos.controller';
import { PhotosController } from './photos.controller';

@Module({
  imports: [PlacesModule],
  controllers: [PlacesPhotosController, PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
