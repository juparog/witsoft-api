import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	MaxLength,
	IsString,
	IsOptional,
	IsEmail,
	MinLength,
} from "class-validator";

export class FindOrganizationsRequestDto {
	@IsOptional()
  @IsEmail()
  @MaxLength(320)
  @MinLength(5)
	@ApiPropertyOptional({ example: 'witsoft.group@google.com', description: 'User email address' })
	readonly email: string;

	@IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(1)
	@ApiPropertyOptional({ example: 'Witsoft Group', description: 'Organization name' })
	readonly name: string;

	@IsOptional()
	@IsString()
  @MaxLength(50)
  @MinLength(5)
	@ApiPropertyOptional({ example: 'witsoft-group', description: 'Domain name or organization domain' })
	readonly domain: string;
}
