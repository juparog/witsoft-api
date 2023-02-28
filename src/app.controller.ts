import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

import { AppService } from "./app.service";
import { routesV1 } from "@witsoft/config/app.routes";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiOkResponse,
} from "@nestjs/swagger";

@Controller({
  path: routesV1.home.root
})
@ApiTags(`/${routesV1.home.root}`)
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({ summary: 'Witsoft Api info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @Get('/info')
	getHello(): string {
		return this.appService.getHello();
	}

	@HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('health')
	health(): void {
		return;
	}
}
