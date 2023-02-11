import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { OrderBy } from "../ddd";
import { OrderByTransform } from "../application/transforms/order-by.transform";

export class PaginatedQueryRequestDto {
	@IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 10,
    description: 'Specifies a limit of returned records',
    required: false,
  })
	readonly limit?: number;

	@IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({ example: 0, description: 'Page number', required: false })
	readonly page?: number;

	@IsOptional()
  @Transform(params => OrderByTransform(params))
  @ApiPropertyOptional({
    type: 'object',
    example: { workspace: "asc", createdAt: "desc" },
    description: 'Order query',
    required: false,
  })
	readonly orderBy?: OrderBy;
}
