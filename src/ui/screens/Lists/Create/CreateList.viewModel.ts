import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
	DEFAULT_USER_ID,
	MAXIMUM_LIST_DESCRIPTION_LENGTH,
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_DESCRIPTION_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "@/core/constraints";
import { useListsStore } from "@/ui/stores/Lists.store";

type FormData = {
	name: string;
	description: string;
	isPublic: boolean;
	canBeShared: boolean;
};

type FormState = {
	formData: FormData;
	fieldErrors: Partial<Record<keyof FormData, string>>;
};

export const useCreateListViewModel = () => {
	const router = useRouter();

	const [state, setState] = useState<FormState>({
		formData: {
			name: "",
			description: "",
			isPublic: false,
			canBeShared: false,
		},
		fieldErrors: {},
	});

	const loadingState = useListsStore((state) => state.loadingState);
	const error = useListsStore((state) => state.error);
	const createListAction = useListsStore((state) => state.createList);
	const clearErrorAction = useListsStore((state) => state.clearError);

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

		try {
			await createListAction({
				name: state.formData.name,
				description: state.formData.description,
				createdBy: DEFAULT_USER_ID,
			});

			router.back();

			return true;
		} catch {
			return false;
		}
	}, [state.formData, validateForm, router, createListAction]);

	const resetForm = useCallback(() => {
		setState({
			formData: {
				name: "",
				description: "",
				isPublic: false,
				canBeShared: false,
			},
			fieldErrors: {},
		});
	}, []);

	const clearError = useCallback(() => {
		clearErrorAction();
	}, [clearErrorAction]);

	const creating = loadingState === "loading";
	const canSubmit =
		state.formData.name.trim().length > 0 &&
		state.formData.description.trim().length > 0 &&
		!creating;

	return {
		formData: state.formData,
		creating,
		error,
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
