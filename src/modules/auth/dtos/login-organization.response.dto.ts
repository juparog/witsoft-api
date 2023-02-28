import { ApiProperty } from "@nestjs/swagger";
import { ResponseBase } from "@witsoft/libs/api/response.base";

export class LoginOrganizationResponseDto {
	constructor(props: LoginOrganizationResponseDto) {
		this.accessToken = props.accessToken;
	}

	@ApiProperty({
    description: "Authentication token for the organization",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
	accessToken: string;
}
