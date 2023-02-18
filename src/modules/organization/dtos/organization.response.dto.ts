import { ApiProperty } from "@nestjs/swagger";
import { ResponseBase } from "@witsoft/libs/api/response.base";

export class OrganizationResponseDto extends ResponseBase {
	@ApiProperty({
    example: 'witsoft@email.com',
    description: "Organization's email address",
  })
	email: string;

	@ApiProperty({
    example: 'Witsoft Group',
    description: "Organization's name",
  })
	name: string;

	@ApiProperty({
    example: 'witsoft',
    description: 'Domain name or organization domain',
  })
	domain: string;
}
