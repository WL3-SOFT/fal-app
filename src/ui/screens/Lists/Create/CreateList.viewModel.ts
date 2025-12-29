import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	MAXIMUM_LIST_DESCRIPTION_LENGTH,
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_DESCRIPTION_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "@/core/constraints";
import { CreateListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const DEFAULT_USER_ID = "24";

type FormData = {
	name: string;
	description: string;
	isPublic: boolean;
	canBeShared: boolean;
};

type CreateListState = {
	formData: FormData;
	creating: boolean;
	error: string | null;
	fieldErrors: Partial<Record<keyof FormData, string>>;
};

export const useCreateListViewModel = () => {
	const router = useRouter();

	const [state, setState] = useState<CreateListState>({
		formData: {
			name: "",
			description: "",
			isPublic: false,
			canBeShared: false,
		},
		creating: false,
		error: null,
		fieldErrors: {},
	});

	const createListUseCase = new CreateListUseCase(listsRepository);

	const setName = useCallback((name: string) => {
		setState((prev) => ({
			...prev,
			formData: { ...prev.formData, name },
			fieldErrors: { ...prev.fieldErrors, name: undefined },
		}));
	}, []);

	const setDescription = useCallback((description: string) => {
		setState((prev) => ({
			...prev,
			formData: { ...prev.formData, description },
			fieldErrors: { ...prev.fieldErrors, description: undefined },
		}));
	}, []);

	const setIsPublic = useCallback((isPublic: boolean) => {
		setState((prev) => ({
			...prev,
			formData: { ...prev.formData, isPublic },
		}));
	}, []);

	const setCanBeShared = useCallback((canBeShared: boolean) => {
		setState((prev) => ({
			...prev,
			formData: { ...prev.formData, canBeShared },
		}));
	}, []);

	const validateForm = useCallback((): boolean => {
		const errors: Partial<Record<keyof FormData, string>> = {};

		if (!state.formData.name.trim()) {
			errors.name = "Nome é obrigatório";
		} else if (state.formData.name.trim().length < MINIMUM_LIST_NAME_LENGTH) {
			errors.name = "Nome deve ter ao menos 3 caracteres";
		} else if (state.formData.name.length > MAXIMUM_LIST_NAME_LENGTH) {
			errors.name = "Nome deve ter no máximo 100 caracteres";
		}

		if (!state.formData.description.trim()) {
			errors.description = "Descrição é obrigatória";
		} else if (
			state.formData.description.trim().length < MINIMUM_LIST_DESCRIPTION_LENGTH
		) {
			errors.description = "Descrição deve ter ao menos 3 caracteres";
		} else if (
			state.formData.description.length > MAXIMUM_LIST_DESCRIPTION_LENGTH
		) {
			errors.description = "Descrição deve ter no máximo 500 caracteres";
		}

		setState((prev) => ({ ...prev, fieldErrors: errors }));

		return Object.keys(errors).length === 0;
	}, [state.formData]);

	const createList = useCallback(async () => {
		if (!validateForm()) {
			return false;
		}

		setState((prev) => ({ ...prev, creating: true, error: null }));

		try {
			await createListUseCase.execute({
				name: state.formData.name,
				description: state.formData.description,
				isPublic: state.formData.isPublic,
				canBeShared: state.formData.canBeShared,
				createdBy: DEFAULT_USER_ID,
			});

			setState((prev) => ({ ...prev, creating: false }));

			router.back();

			return true;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Erro ao criar lista";
			setState((prev) => ({ ...prev, error: errorMessage, creating: false }));
			return false;
		}
	}, [state.formData, validateForm, router, createListUseCase]);

	const resetForm = useCallback(() => {
		setState({
			formData: {
				name: "",
				description: "",
				isPublic: false,
				canBeShared: false,
			},
			creating: false,
			error: null,
			fieldErrors: {},
		});
	}, []);

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	const canSubmit =
		state.formData.name.trim().length > 0 &&
		state.formData.description.trim().length > 0 &&
		!state.creating;

	return {
		formData: state.formData,
		creating: state.creating,
		error: state.error,
		fieldErrors: state.fieldErrors,
		canSubmit,
		setName,
		setDescription,
		setIsPublic,
		setCanBeShared,
		createList,
		resetForm,
		clearError,
	};
};
