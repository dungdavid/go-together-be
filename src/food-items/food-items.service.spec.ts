import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsService } from './food-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';

type MockFoodItemDelegate = {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('FoodItemsService', () => {
  let service: FoodItemsService;
  let foodItem: MockFoodItemDelegate;
  let placesService: { findOne: jest.Mock };

  beforeEach(async () => {
    foodItem = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    placesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodItemsService,
        { provide: PrismaService, useValue: { foodItem } },
        { provide: PlacesService, useValue: placesService },
      ],
    }).compile();

    service = module.get(FoodItemsService);
  });

  it('throws NotFoundException when the place does not exist on create', async () => {
    placesService.findOne.mockRejectedValue(new NotFoundException('Place #1 not found'));

    await expect(service.create('1', { name: 'Banh mi' })).rejects.toThrow(NotFoundException);
    expect(foodItem.create).not.toHaveBeenCalled();
  });

  it('creates a food item for an existing place', async () => {
    placesService.findOne.mockResolvedValue({ id: '1' });
    const created = {
      id: 'f1',
      placeId: '1',
      name: 'Banh mi',
      notes: null,
      rating: null,
      photoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    foodItem.create.mockResolvedValue(created);

    const result = await service.create('1', { name: 'Banh mi' });

    expect(result).toEqual(created);
    expect(foodItem.create).toHaveBeenCalledWith({
      data: { placeId: '1', name: 'Banh mi', notes: undefined, rating: undefined, photoUrl: undefined },
    });
  });

  it('throws NotFoundException when the food item does not exist', async () => {
    foodItem.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('updates a food item after verifying it exists', async () => {
    const existing = {
      id: 'f1',
      placeId: '1',
      name: 'Banh mi',
      notes: null,
      rating: null,
      photoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    foodItem.findUnique.mockResolvedValue(existing);
    const updated = { ...existing, rating: 5 };
    foodItem.update.mockResolvedValue(updated);

    const result = await service.update('f1', { rating: 5 });

    expect(result).toEqual(updated);
  });

  it('throws NotFoundException when the place does not exist on findAllForPlace', async () => {
    placesService.findOne.mockRejectedValue(new NotFoundException('Place #1 not found'));

    await expect(service.findAllForPlace('1')).rejects.toThrow(NotFoundException);
    expect(foodItem.findMany).not.toHaveBeenCalled();
  });

  it('removes a food item after verifying it exists', async () => {
    const existing = {
      id: 'f1',
      placeId: '1',
      name: 'Banh mi',
      notes: null,
      rating: null,
      photoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    foodItem.findUnique.mockResolvedValue(existing);
    foodItem.delete.mockResolvedValue(existing);

    await service.remove('f1');

    expect(foodItem.delete).toHaveBeenCalledWith({ where: { id: 'f1' } });
  });

  it('throws NotFoundException when removing a food item that does not exist', async () => {
    foodItem.findUnique.mockResolvedValue(null);

    await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    expect(foodItem.delete).not.toHaveBeenCalled();
  });
});
