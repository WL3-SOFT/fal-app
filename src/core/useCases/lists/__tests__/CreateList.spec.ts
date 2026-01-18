import {
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "#core/constraints";
import { List } from "#core/entities";
import type {
	CreateListDto,
	ListsRepositoryInterface,
} from "#core/interfaces/repositories/IListsRepository";
import { CreateListUseCase, CreateListValidationError } from "../CreateList";

describe("CreateList UseCase - Unit Tests", () => {
	let mockRepository: jest.Mocked<ListsRepositoryInterface>;
	let useCase: CreateListUseCase;

	const validListData: CreateListDto = {
		name: "Lista de Compras",
		description: "Compras do mês",
		createdBy: "user-123",
	};

	const mockList = new List({
		id: "list-123",
		name: "Lista de Compras",
		description: "Compras do mês",
		usedTimes: 0,
		isPublic: false,
		canBeShared: false,
		isActive: true,
		createdAt: new Date(),
		updatedAt: null,
		deletedAt: null,
		createdBy: "user-123",
		updatedBy: null,
		deletedBy: null,
	});

	beforeEach(() => {
		mockRepository = {
			create: jest.fn(),
			findByUser: jest.fn(),
			findById: jest.fn(),
			findByNameAndUserId: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			incrementUsage: jest.fn(),
			addProduct: jest.fn(),
			removeProduct: jest.fn(),
			updateProductQuantity: jest.fn(),
			markProductAsPurchased: jest.fn(),
			getListProducts: jest.fn(),
			getPendingProducts: jest.fn(),
		} as jest.Mocked<ListsRepositoryInterface>;

		useCase = new CreateListUseCase(mockRepository);
	});

	describe("Validações de Nome", () => {
		it("deve lançar erro quando nome está vazio", async () => {
			await expect(
				useCase.execute({ ...validListData, name: "" }),
			).rejects.toThrow(
				new CreateListValidationError("Nome da lista é obrigatório"),
			);
		});

		it("deve lançar erro quando nome contém apenas espaços", async () => {
			await expect(
				useCase.execute({ ...validListData, name: "   " }),
			).rejects.toThrow(
				new CreateListValidationError("Nome da lista é obrigatório"),
			);
		});

		it("deve lançar erro quando nome é menor que o mínimo permitido", async () => {
			const shortName = "A".repeat(MINIMUM_LIST_NAME_LENGTH - 1);

			await expect(
				useCase.execute({ ...validListData, name: shortName }),
			).rejects.toThrow(
				new CreateListValidationError(
					`Nome da lista deve ter ao menos ${MINIMUM_LIST_NAME_LENGTH} caracteres`,
				),
			);
		});

		it("deve lançar erro quando nome excede o máximo permitido", async () => {
			const longName = "A".repeat(MAXIMUM_LIST_NAME_LENGTH + 1);

			await expect(
				useCase.execute({ ...validListData, name: longName }),
			).rejects.toThrow(
				new CreateListValidationError(
					`Nome da lista deve ter no máximo ${MAXIMUM_LIST_NAME_LENGTH} caracteres`,
				),
			);
		});
	});

	describe("Validação de Nome Duplicado", () => {
		beforeEach(() => {
			mockRepository.create.mockResolvedValue(mockList);
		});

		it("deve lançar erro quando já existe lista ativa com o mesmo nome", async () => {
			// Simula que já existe uma lista com o nome
			mockRepository.findByNameAndUserId.mockResolvedValue(mockList);

			await expect(useCase.execute(validListData)).rejects.toThrow(
				new CreateListValidationError("Você já possui uma lista com este nome"),
			);

			// Verifica que buscou pelo nome e userId corretos
			expect(mockRepository.findByNameAndUserId).toHaveBeenCalledWith(
				validListData.name,
				validListData.createdBy,
			);

			// Verifica que NÃO tentou criar a lista
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		it("deve criar lista quando não existe lista com o mesmo nome", async () => {
			// Simula que não existe lista com o nome
			mockRepository.findByNameAndUserId.mockResolvedValue(null);

			const result = await useCase.execute(validListData);

			// Verifica que buscou pelo nome
			expect(mockRepository.findByNameAndUserId).toHaveBeenCalledWith(
				validListData.name,
				validListData.createdBy,
			);

			// Verifica que criou a lista
			expect(mockRepository.create).toHaveBeenCalledWith({
				name: validListData.name,
				description: validListData.description,
				createdBy: validListData.createdBy,
				isPublic: false,
				canBeShared: false,
			});

			expect(result).toEqual({
				id: mockList.id,
				name: mockList.name,
				description: mockList.description,
				usedTimes: mockList.usedTimes,
				isPublic: mockList.isPublic,
				canBeShared: mockList.canBeShared,
				isActive: mockList.isActive,
				createdAt: mockList.createdAt,
				updatedAt: mockList.updatedAt,
				deletedAt: mockList.deletedAt,
				createdBy: mockList.createdBy,
				updatedBy: mockList.updatedBy,
				deletedBy: mockList.deletedBy,
			});
		});

		it("deve validar nome duplicado com nome trimmed", async () => {
			const dataWithSpaces = {
				...validListData,
				name: "  Lista de Compras  ",
			};

			mockRepository.findByNameAndUserId.mockResolvedValue(null);

			await useCase.execute(dataWithSpaces);

			// Verifica que busca com nome trimmed
			expect(mockRepository.findByNameAndUserId).toHaveBeenCalledWith(
				"Lista de Compras",
				validListData.createdBy,
			);
		});
	});

	describe("Validação de Usuário", () => {
		it("deve lançar erro quando createdBy está vazio", async () => {
			await expect(
				useCase.execute({ ...validListData, createdBy: "" }),
			).rejects.toThrow(
				new CreateListValidationError("Usuário criador é obrigatório"),
			);
		});

		it("deve lançar erro quando createdBy contém apenas espaços", async () => {
			await expect(
				useCase.execute({ ...validListData, createdBy: "   " }),
			).rejects.toThrow(
				new CreateListValidationError("Usuário criador é obrigatório"),
			);
		});
	});

	describe("Criação com Sucesso", () => {
		beforeEach(() => {
			mockRepository.findByNameAndUserId.mockResolvedValue(null);
			mockRepository.create.mockResolvedValue(mockList);
		});

		it("deve criar lista com dados válidos", async () => {
			const result = await useCase.execute(validListData);

			expect(mockRepository.create).toHaveBeenCalledWith({
				name: validListData.name,
				description: validListData.description,
				createdBy: validListData.createdBy,
				isPublic: false,
				canBeShared: false,
			});

			expect(result.id).toBe(mockList.id);
			expect(result.name).toBe(mockList.name);
		});

		it("deve trimmar nome e descrição ao criar", async () => {
			await useCase.execute({
				...validListData,
				name: "  Lista  ",
				description: "  Descrição  ",
			});

			expect(mockRepository.create).toHaveBeenCalledWith({
				name: "Lista",
				description: "Descrição",
				createdBy: validListData.createdBy,
				isPublic: false,
				canBeShared: false,
			});
		});

		it("deve usar valores padrão para isPublic e canBeShared", async () => {
			await useCase.execute(validListData);

			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					isPublic: false,
					canBeShared: false,
				}),
			);
		});

		it("deve permitir definir isPublic e canBeShared", async () => {
			await useCase.execute({
				...validListData,
				isPublic: true,
				canBeShared: true,
			});

			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					isPublic: true,
					canBeShared: true,
				}),
			);
		});
	});
});
