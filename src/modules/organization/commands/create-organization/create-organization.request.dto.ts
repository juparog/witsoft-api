import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
	NotContains,
} from 'class-validator';

export class CreateOrganizationRequestDto {
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

  @ApiProperty({ example: 'witsoft-group', description: 'Domain name or organization workspace' })
	@IsString()
  @MaxLength(50)
  @MinLength(5)
  readonly workspace: string;
}
