import { useRouter } from "expo-router";
import type { ListCardProps } from "@/ui/components/Cards/ListCard/ListCard.types";

const data: ListCardProps[] = [
	{
		id: "1",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "2",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "3",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "4",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "5",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "6",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "7",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
	{
		id: "8",
		itemsQuantity: 107,
		lastUsed: new Date(),
		lowestPrice: 684.21,
		title: "Lista de compras mensal",
	},
];

// const data: ListCardProps[] = [];

export const useListsPage = () => {
	const router = useRouter();

	const onCreateList = () => {
		router.push("/lists/create");
	};

	const onPressListCard = (id: string) => {
		router.push(`/lists/${id}`);
	};

	const hasContent = data?.length > 0;

	const quantityIndicatorText = hasContent
		? `${data?.length} lista${data?.length > 1 ? "s" : ""}`
		: "Sem listas no momento";

	return {
		data,
		hasContent,
		indicatorText: quantityIndicatorText,
		onCreateList,
		onPressListCard,
	};
};
