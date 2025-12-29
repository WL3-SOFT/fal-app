export interface ListInterface {
	id: string;
	name: string;
	description?: string | null;
	isPublic: boolean;
	usedTimes: number;
	isActive: boolean;
	canBeShared: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
	createdBy: string;
	updatedBy?: string | null;
	deletedBy?: string | null;
}
