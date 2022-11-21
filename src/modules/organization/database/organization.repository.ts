import { Injectable } from '@nestjs/common';

/**
 *  Repository is used for retrieving/saving domain entities
 * */
@Injectable()
export class OrganizationRepository
{
  constructor(
  ) {
  }

	async insert(obj: any): Promise<void> {
		console.log('Organizacion creada correctamente:', obj);
	}

	async transaction<T>(handler: () => Promise<T>): Promise<T> {
		return handler();
	}
}
