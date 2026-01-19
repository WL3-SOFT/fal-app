import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
	type SubmitErrorHandler,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { DEFAULT_USER_ID } from "@/core/constraints";
import { useToast } from "@/ui/hooks";
import { useListsStore } from "@/ui/stores/Lists.store";
import { type CreateListFormData, createListSchema } from "./CreateList.types";

export const useCreateListViewModel = () => {
	const router = useRouter();
	const { promise } = useToast();
	const {
		control,
		handleSubmit,
		formState: {
			isSubmitting,
			disabled,
			isLoading,
			isValid,
			errors,
			isSubmitSuccessful,
		},
	} = useForm<CreateListFormData>({
		mode: "onSubmit",
		reValidateMode: "onChange",
		resolver: zodResolver(createListSchema),
	});

	const error = useListsStore((state) => state.error);
	const createListAction = useListsStore((state) => state.createList);

	const onSubmit: SubmitHandler<CreateListFormData> = async (
		formData: CreateListFormData,
	) => {
		const result = await promise({
			promise: createListAction({
				name: formData.name,
				description: "",
				canBeShared: false,
				isPublic: false,
				createdBy: DEFAULT_USER_ID,
			}),
			success: {
				message: "Lista criada com sucesso!",
			},
			error: {
				message: (error: Error) =>
					error instanceof Error ? error.message : "Erro ao criar lista",
			},
			loading: {
				message: "Criando lista...",
			},
		});

		if (!result.success) {
			return;
		}

		const { id } = result.data;

		router.replace(`/lists/${id}`);
	};

	const onError: SubmitErrorHandler<CreateListFormData> = (errors) => {
		console.log(`Error: ${{ errors }}`);
	};

	const createList = handleSubmit(onSubmit, onError);

	const canSubmit = isValid && !disabled && !isLoading;

	return {
		error,
		fieldErrors: errors,
		canSubmit,
		createList,
		control,
		isSubmitting,
		isSubmitSuccessful,
	};
};
