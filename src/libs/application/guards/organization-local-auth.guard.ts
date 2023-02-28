import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OrganizationLocalAuthGuard extends AuthGuard(
	"organization-local",
) {}
