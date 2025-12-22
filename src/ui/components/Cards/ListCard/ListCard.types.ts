export interface ListCardProps {
	id: string;
	title: string;
	itemsQuantity: number;
	lastUsed?: Date;
	lowestPrice: number;
	onPress?: () => void;
	onLongPress?: () => void;
}
