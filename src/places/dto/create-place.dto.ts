import { IsISO8601, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lng!: number;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsISO8601()
  visitedAt?: string;

  @IsOptional()
  @IsString()
  coverPhotoUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
