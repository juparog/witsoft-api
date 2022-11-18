import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(1)
  workspace: string;
}
