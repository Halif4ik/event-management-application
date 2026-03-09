import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class EventFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by public events only',
    example: true,
    default: true
  })
  @IsOptional()
  @Transform(({value}) => value?.toString() === 'true')
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Filter events from this date',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Filter events until this date',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
