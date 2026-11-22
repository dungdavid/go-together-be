import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesModule } from './places/places.module';
import { ChecklistItemsModule } from './checklist-items/checklist-items.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { PhotosModule } from './photos/photos.module';
import { RequestLogModule } from './request-log/request-log.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RequestLogModule,
    AuthModule,
    PlacesModule,
    ChecklistItemsModule,
    FoodItemsModule,
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
