import { ApiProperty } from "@nestjs/swagger";
import { ResponseBase } from "@witsoft/libs/api/response.base";

export class OrganizationResponseDto extends ResponseBase {
	// constructor(props: OrganizationResponseDto) {
	// 	super({
	// 		id: props.id,
	// 		createdAt: new Date(props.createdAt),
	// 		updatedAt: new Date(props.updatedAt),
	// 	});
	// 	this.name = props.name;
	// 	this.email = this.email;
	// 	this.domain = props.domain;
	// }

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

	@ApiProperty({
    example: 'witsoft',
    description: 'Domain name or organization domain',
  })
	domain: string;
}
