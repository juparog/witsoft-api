import { ApiProperty } from '@nestjs/swagger';

export class IdResponse {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ example: '6d5049ccba1454e4ac7ec231' })
  readonly id: string;
}
