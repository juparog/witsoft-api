import { Controller, Get, HttpStatus } from "@nestjs/common";

import { AppService } from "./app.service";
import { routesV1 } from "@witsoft/config/app.routes";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller({
  path: routesV1.home.root,
  version: routesV1.version
})
@ApiTags(`/${routesV1.home.root}`)
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: 'Witsoft Api info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
