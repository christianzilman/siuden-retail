import { PurchaseDocumentType, PurchaseStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreatePurchaseItemDto {
  @IsUUID() productVariantId: string;
  @IsNumber({ maxDecimalPlaces: 3 }) @Min(0.001) quantity: number;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) unitCost: number;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number;
}

export class CreatePurchaseDto {
  @IsOptional() @IsUUID() supplierId?: string;
  @IsUUID() stockLocationId: string;
  @IsOptional()
  @IsEnum(PurchaseDocumentType)
  documentType?: PurchaseDocumentType;
  @IsOptional() @IsString() @MaxLength(80) documentNumber?: string;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsOptional() @IsString() notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];
}

export class PurchaseQueryDto extends PaginationDto {
  @IsOptional() @IsEnum(PurchaseStatus) status?: PurchaseStatus;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsOptional() @IsUUID() stockLocationId?: string;
}
