import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsString,
	Length,
	MaxLength,
	MinLength,
	NotContains,
} from "class-validator";

export class LoginOrganizationRequestDto {
	@ApiProperty({ example: 'witsoft@email.com', description: 'Organization email address' })
  @IsEmail()
  @MaxLength(320)
  @MinLength(5)
	readonly email: string;

	@ApiProperty({ example: 'Abc123.!', description: 'Key access' })
  @IsString()
  @Length(8, 100)
  @NotContains(' ')
	readonly password: string;
}
