import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';
import { PrismaService } from '../prisma/prisma.service';
import { PlacesService } from '../places/places.service';

type MockPhotoDelegate = {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('PhotosService', () => {
  let service: PhotosService;
  let photo: MockPhotoDelegate;
  let placesService: { findOne: jest.Mock };

  beforeEach(async () => {
    photo = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    placesService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        { provide: PrismaService, useValue: { photo } },
        { provide: PlacesService, useValue: placesService },
      ],
    }).compile();

    service = module.get(PhotosService);
  });

  it('throws NotFoundException when the place does not exist on create', async () => {
    placesService.findOne.mockRejectedValue(new NotFoundException('Place #1 not found'));

    await expect(service.create('1', { url: 'https://example.com/a.jpg' })).rejects.toThrow(NotFoundException);
    expect(photo.create).not.toHaveBeenCalled();
  });

  it('creates a photo for an existing place', async () => {
    placesService.findOne.mockResolvedValue({ id: '1' });
    const created = {
      id: 'p1',
      placeId: '1',
      url: 'https://example.com/a.jpg',
      caption: null,
      createdAt: new Date(),
    };
    photo.create.mockResolvedValue(created);

    const result = await service.create('1', { url: 'https://example.com/a.jpg' });

    expect(result).toEqual(created);
    expect(photo.create).toHaveBeenCalledWith({
      data: { placeId: '1', url: 'https://example.com/a.jpg', caption: undefined },
    });
  });

  it('throws NotFoundException when the photo does not exist', async () => {
    photo.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('updates a photo after verifying it exists', async () => {
    const existing = {
      id: 'p1',
      placeId: '1',
      url: 'https://example.com/a.jpg',
      caption: null,
      createdAt: new Date(),
    };
    photo.findUnique.mockResolvedValue(existing);
    const updated = { ...existing, caption: 'Sunset' };
    photo.update.mockResolvedValue(updated);

    const result = await service.update('p1', { caption: 'Sunset' });

    expect(result).toEqual(updated);
  });

  it('throws NotFoundException when the place does not exist on findAllForPlace', async () => {
    placesService.findOne.mockRejectedValue(new NotFoundException('Place #1 not found'));

    await expect(service.findAllForPlace('1')).rejects.toThrow(NotFoundException);
    expect(photo.findMany).not.toHaveBeenCalled();
  });

  it('removes a photo after verifying it exists', async () => {
    const existing = {
      id: 'p1',
      placeId: '1',
      url: 'https://example.com/a.jpg',
      caption: null,
      createdAt: new Date(),
    };
    photo.findUnique.mockResolvedValue(existing);
    photo.delete.mockResolvedValue(existing);

    await service.remove('p1');

    expect(photo.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });

  it('throws NotFoundException when removing a photo that does not exist', async () => {
    photo.findUnique.mockResolvedValue(null);

    await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    expect(photo.delete).not.toHaveBeenCalled();
  });
});
