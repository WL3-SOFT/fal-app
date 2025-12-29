import {
	MAXIMUM_LIST_DESCRIPTION_LENGTH,
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_DESCRIPTION_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "#core/constraints";
import type {
	ListsRepositoryInterface,
	UpdateListDto,
} from "#core/interfaces/repositories/IListsRepository";

export class UpdateListValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UpdateListValidationError";
	}
}

export class UpdateListUseCase {
	constructor(private readonly listsRepository: ListsRepositoryInterface) {}

	async execute(listId: string, data: UpdateListDto): Promise<void> {
		if (!listId || listId.trim().length === 0) {
			throw new UpdateListValidationError("ID da lista é obrigatório");
		}

		if (data.name !== undefined) {
			if (!data.name || data.name.trim().length === 0) {
				throw new UpdateListValidationError("Nome da lista não pode ser vazio");
			}

			if (data.name.trim().length < MINIMUM_LIST_NAME_LENGTH) {
				throw new UpdateListValidationError(
					`Nome da lista deve ter ao menos ${MINIMUM_LIST_NAME_LENGTH} caracteres`,
				);
			}

			if (data.name.length > MAXIMUM_LIST_NAME_LENGTH) {
				throw new UpdateListValidationError(
					`Nome da lista deve ter no máximo ${MAXIMUM_LIST_NAME_LENGTH} caracteres`,
				);
			}
		}

		if (data.description !== undefined) {
			if (!data.description || data.description.trim().length === 0) {
				throw new UpdateListValidationError(
					"Descrição da lista não pode ser vazia",
				);
			}

			if (data.description.trim().length < MINIMUM_LIST_DESCRIPTION_LENGTH) {
				throw new UpdateListValidationError(
					`Descrição da lista deve ter ao menos ${MINIMUM_LIST_DESCRIPTION_LENGTH} caracteres`,
				);
			}

			if (data.description.length > MAXIMUM_LIST_DESCRIPTION_LENGTH) {
				throw new UpdateListValidationError(
					`Descrição da lista deve ter no máximo ${MAXIMUM_LIST_DESCRIPTION_LENGTH} caracteres`,
				);
			}
		}

		const updateData: UpdateListDto = {};

		if (data.name !== undefined) {
			updateData.name = data.name.trim();
		}

		if (data.description !== undefined) {
			updateData.description = data.description.trim();
		}

		if (data.isActive !== undefined) {
			updateData.isActive = data.isActive;
		}

		await this.listsRepository.update(listId, updateData);
	}
}
