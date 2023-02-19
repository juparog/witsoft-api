import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
	IsEmail,
	IsOptional,
	IsString,
	Length,
	MaxLength,
	MinLength,
	NotContains,
} from "class-validator";

export class FullUpdateOrganizationRequestDto {
	@IsOptional()
  @Exclude()
	readonly id: string;

	@ApiProperty({ example: 'witsoft.group@google.com', description: 'User email address' })
  @IsEmail()
  @MaxLength(320)
  @MinLength(5)
	readonly email: string;

	@ApiProperty({ example: 'Witsoft Group', description: 'Organization name' })
  @IsString()
  @MaxLength(50)
  @MinLength(1)
	readonly name: string;

	@ApiProperty({ example: 'Abc123.!', description: 'Key access' })
  @IsString()
  @Length(8, 100)
  @NotContains(' ')
	readonly password: string;

	@ApiProperty({ example: 'witsoft-group', description: 'Domain name or organization domain' })
	@IsString()
  @MaxLength(50)
  @MinLength(5)
	readonly domain: string;

	@IsOptional()
  @Exclude()
	readonly createdAt: Date;

	@IsOptional()
  @Exclude()
	readonly updateAt: Date;
}
