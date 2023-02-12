import { Entity } from "./entity.base";

export interface Mapper<
	DomainEntity extends Entity<unknown>,
	DbRecord,
	Response = unknown,
> {
	toPersistence(entity: DomainEntity): DbRecord;
	toDomain(record: unknown): DomainEntity;
	toResponse(entity: DomainEntity): Response;
}
