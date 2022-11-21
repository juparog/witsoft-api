import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@witsoft/libs/api/response.base';

export class OrganizationResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'banco-test@gmail.com',
    description: "Organization's email address",
  })
  email: string;

  @ApiProperty({
    example: 'Banco Test',
    description: "Organization's name",
  })
  name: string;

  @ApiProperty({
    example: 'Abc123.!',
    description: 'Key access',
  })
  password: string;

  @ApiProperty({
    example: 'banco-test',
    description: 'Domain name or organization workspace',
  })
  workspace: string;
}
