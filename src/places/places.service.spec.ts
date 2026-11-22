import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';
import { PrismaService } from '../prisma/prisma.service';
import { placeWithRelationsArgs } from './place-with-relations';

type MockPlaceDelegate = {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

const emptyRelations = { checklist: [], foodList: [], photos: [] };

describe('PlacesService', () => {
  let service: PlacesService;
  let place: MockPlaceDelegate;

  beforeEach(async () => {
    place = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacesService, { provide: PrismaService, useValue: { place } }],
    }).compile();

    service = module.get(PlacesService);
  });

  it('creates a place and includes empty relation lists', async () => {
    const dto = { name: 'Da Lat', lat: 11.9404, lng: 108.4583 };
    const created = {
      id: '1',
      name: 'Da Lat',
      lat: 11.9404,
      lng: 108.4583,
      region: null,
      visitedAt: null,
      coverPhotoUrl: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...emptyRelations,
    };
    place.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
    expect(place.create).toHaveBeenCalledWith({
      data: {
        name: 'Da Lat',
        lat: 11.9404,
        lng: 108.4583,
        region: undefined,
        visitedAt: undefined,
        coverPhotoUrl: undefined,
        notes: undefined,
        perspective: undefined,
      },
      ...placeWithRelationsArgs,
    });
  });

  it('throws NotFoundException when the place does not exist', async () => {
    place.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('updates a place after verifying it exists', async () => {
    const existing = {
      id: '1',
      name: 'Old',
      lat: 1,
      lng: 1,
      region: null,
      visitedAt: null,
      coverPhotoUrl: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...emptyRelations,
    };
    place.findUnique.mockResolvedValue(existing);
    const updated = { ...existing, name: 'New' };
    place.update.mockResolvedValue(updated);

    const result = await service.update('1', { name: 'New' });

    expect(result).toEqual(updated);
  });

  it('removes a place after verifying it exists', async () => {
    const existing = {
      id: '1',
      name: 'Old',
      lat: 1,
      lng: 1,
      region: null,
      visitedAt: null,
      coverPhotoUrl: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...emptyRelations,
    };
    place.findUnique.mockResolvedValue(existing);
    place.delete.mockResolvedValue(existing);

    await service.remove('1');

    expect(place.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
