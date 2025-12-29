import type { List } from "#core/entities";
import type {
	ListDto,
	ListWithProductCount,
	ListWithProductCountDto,
} from "#core/interfaces/repositories/IListsRepository";

export function listEntityToDto(entity: List): ListDto {
	return {
		id: entity.id,
		name: entity.name,
		description: entity.description ?? null,
		usedTimes: entity.usedTimes,
		isPublic: entity.isPublic,
		canBeShared: entity.canBeShared,
		isActive: entity.isActive,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt ?? null,
		deletedAt: entity.deletedAt ?? null,
		createdBy: entity.createdBy,
		updatedBy: entity.updatedBy ?? null,
		deletedBy: entity.deletedBy ?? null,
	};
}

export function listWithProductCountToDto(
	entity: ListWithProductCount,
): ListWithProductCountDto {
	return {
		...listEntityToDto(entity),
		productCount: entity.productCount,
	};
}
