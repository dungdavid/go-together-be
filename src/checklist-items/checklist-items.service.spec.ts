import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistItemsService } from './checklist-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';

type MockChecklistItemDelegate = {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('ChecklistItemsService', () => {
  let service: ChecklistItemsService;
  let checklistItem: MockChecklistItemDelegate;
  let placesService: { findOne: jest.Mock };

  beforeEach(async () => {
    checklistItem = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    placesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecklistItemsService,
        { provide: PrismaService, useValue: { checklistItem } },
        { provide: PlacesService, useValue: placesService },
      ],
    }).compile();

    service = module.get(ChecklistItemsService);
  });

  it('throws NotFoundException when the place does not exist on create', async () => {
    placesService.findOne.mockRejectedValue(new NotFoundException('Place #1 not found'));

    await expect(service.create('1', { label: 'Buy ticket' })).rejects.toThrow(NotFoundException);
    expect(checklistItem.create).not.toHaveBeenCalled();
  });

  it('creates a checklist item for an existing place', async () => {
    placesService.findOne.mockResolvedValue({ id: '1' });
    const created = {
      id: 'c1',
      placeId: '1',
      label: 'Buy ticket',
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    checklistItem.create.mockResolvedValue(created);

    const result = await service.create('1', { label: 'Buy ticket' });

    expect(result).toEqual(created);
    expect(checklistItem.create).toHaveBeenCalledWith({ data: { placeId: '1', label: 'Buy ticket' } });
  });

  it('throws NotFoundException when the checklist item does not exist', async () => {
    checklistItem.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('updates a checklist item after verifying it exists', async () => {
    const existing = {
      id: 'c1',
      placeId: '1',
      label: 'Buy ticket',
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    checklistItem.findUnique.mockResolvedValue(existing);
    const updated = { ...existing, done: true };
    checklistItem.update.mockResolvedValue(updated);

    const result = await service.update('c1', { done: true });

    expect(result).toEqual(updated);
  });
});
