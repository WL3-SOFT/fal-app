import * as z from "zod";
import {
	MAXIMUM_LIST_NAME_LENGTH,
	MINIMUM_LIST_NAME_LENGTH,
} from "@/core/constraints";

export const createListSchema = z
	.object({
		name: z
			.string()
			.min(MINIMUM_LIST_NAME_LENGTH, {
				message: `Nome deve ter ao menos ${MINIMUM_LIST_NAME_LENGTH} caracteres`,
			})
			.max(MAXIMUM_LIST_NAME_LENGTH, {
				message: `Nome deve ter no máximo ${MAXIMUM_LIST_NAME_LENGTH} caracteres`,
			}),
	})
	.required();

export type CreateListFormData = z.infer<typeof createListSchema>;
