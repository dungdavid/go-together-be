import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlacesModule } from './places/places.module';
import { ChecklistItemsModule } from './checklist-items/checklist-items.module';
import { FoodItemsModule } from './food-items/food-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlacesModule,
    ChecklistItemsModule,
    FoodItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
