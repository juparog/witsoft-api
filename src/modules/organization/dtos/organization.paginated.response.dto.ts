import { ApiProperty } from "@nestjs/swagger";
import { PaginatedResponseDto } from "@witsoft/libs/api/paginated.response.base";
import { OrganizationResponseDto } from "./organization.response.dto";

export class OrganizationPaginatedResponseDto extends PaginatedResponseDto<OrganizationResponseDto> {
	@ApiProperty({ type: OrganizationResponseDto, isArray: true })
	readonly data: readonly OrganizationResponseDto[];
}
