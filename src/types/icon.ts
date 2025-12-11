export interface Icon {
	size?: number;
	color?: string;
	focused?: boolean;
	onPress?: () => void;
	onLongPress?: () => void;
	testId?: string;
	onPressIn?: () => void;
	onPressOut?: () => void;
}
