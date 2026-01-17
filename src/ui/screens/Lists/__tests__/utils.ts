import { faker } from "#test-utils";
import type {
	CreateListDto,
	ListDto,
	ListWithProductCountDto,
} from "@/core/interfaces/repositories/IListsRepository";

export const createListsMock = (length: number): ListWithProductCountDto[] => {
	return Array.from(
		{
			length,
		},
		() => ({
			id: faker.database.mongodbObjectId(),
			name: faker.commerce.productName(),
			productCount: faker.number.int(),
			usedTimes: faker.number.int(),
			canBeShared: false,
			isPublic: false,
			createdBy: faker.database.mongodbObjectId(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			deletedAt: null,
			isActive: true,
			description: faker.lorem.sentence(),
			deletedBy: null,
			updatedBy: null,
		}),
	);
};

export const listCount = 4;
export const mockedListsData = createListsMock(listCount);
export const mockedCreateListDto: Omit<CreateListDto, "createdBy"> = {
	name: "Lista de teste",
	description: "Descrição de teste",
	canBeShared: false,
	isPublic: false,
};

export const mockedListDto: ListDto = {
	canBeShared: false,
	usedTimes: 2,
	name: faker.lorem.words(),
	description: faker.lorem.sentences(),
	id: faker.database.mongodbObjectId(),
	isPublic: false,
	isActive: true,
	deletedAt: null,
	updatedBy: faker.database.mongodbObjectId(),
	deletedBy: faker.database.mongodbObjectId(),
	createdBy: faker.database.mongodbObjectId(),
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
};

export const useCaseErrorMessage = "Usuário criador é obrigatório";
