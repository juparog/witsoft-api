import { ApiProperty } from "@nestjs/swagger";
import { ResponseBase } from "@witsoft/libs/api/response.base";

export class OrganizationResponseDto extends ResponseBase {
	@ApiProperty({
    example: 'witsoft@email.com',
    description: "Organization's email address",
  })
	email: string;

	@ApiProperty({
    example: 'Witsoft',
    description: "Organization's name",
  })
	name: string;

	// @ApiProperty({
	//   example: 'Abc123.!',
	//   description: 'Access password',
	// })
	// password: string;

	@ApiProperty({
    example: 'witsoft',
    description: 'Domain name or organization workspace',
  })
	workspace: string;
}
