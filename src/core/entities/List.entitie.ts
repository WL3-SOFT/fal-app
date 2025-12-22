import type { ListInterface } from "../interfaces";

export class List implements ListInterface {
	id: string;
	name: string;
	description?: string | null;
	usedTimes: number;
	isPublic: boolean;
	canBeShared: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
	createdBy: string;
	updatedBy?: string | null;
	deletedBy?: string | null;

	constructor({
		id,
		name,
		description,
		usedTimes,
		isPublic,
		canBeShared,
		createdAt,
		updatedAt,
		deletedAt,
		createdBy,
		updatedBy,
		deletedBy,
		isActive,
	}: Partial<ListInterface>) {
		this.id = id || "";
		this.name = name || "";
		this.description = description || null;
		this.usedTimes = usedTimes || 0;
		this.isPublic = isPublic || false;
		this.canBeShared = canBeShared || false;
		this.isActive = isActive || true;
		this.createdAt = createdAt ? new Date(createdAt) : new Date();
		this.updatedAt = updatedAt ? new Date(updatedAt) : null;
		this.deletedAt = deletedAt ? new Date(deletedAt) : null;
		this.createdBy = createdBy || "1";
		this.updatedBy = updatedBy || null;
		this.deletedBy = deletedBy || null;
	}

	getData(): ListInterface {
		return {
			canBeShared: this.canBeShared,
			createdAt: this.createdAt,
			createdBy: this.createdBy,
			id: this.id,
			isActive: this.isActive,
			isPublic: this.isPublic,
			name: this.name,
			usedTimes: this.usedTimes,
			updatedAt: this.updatedAt,
			updatedBy: this.updatedBy,
			deletedAt: this.deletedAt,
			deletedBy: this.deletedBy,
			description: this.description,
		};
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getOwner() {
		return this.createdBy;
	}

	getMetadata() {
		const metadata = {
			createdBy: this.createdBy,
			createdAt: this.createdAt,
			updatedBy: this.updatedBy,
			updatedAt: this.updatedAt,
			deletedBy: this.deletedBy,
			deletedAt: this.deletedAt,
			isPublic: this.isPublic,
			canBeShared: this.canBeShared,
			isActive: this.isActive,
			usedTimes: this.usedTimes,
		};

		return metadata;
	}

	changeName(name: string) {
		this.name = name;
	}

	changeDescription(description: string) {
		this.description = description;
	}

	use() {
		this.usedTimes++;
	}

	setActive(active: boolean) {
		this.isActive = active;
	}

	modifySharePolicy(canBeShared: boolean) {
		this.canBeShared = canBeShared;
	}

	modifyPrivacy(isPublic: boolean) {
		this.isPublic = isPublic;
	}
}
