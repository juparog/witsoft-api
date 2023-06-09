import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsString,
	Length,
	MaxLength,
	MinLength,
	NotContains,
} from "class-validator";

export class CreateOrganizationRequestDto {
	@ApiProperty({ example: 'witsoft@email.com', description: 'Organization email address' })
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
}
