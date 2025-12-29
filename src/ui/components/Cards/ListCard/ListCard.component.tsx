import { Pressable, Text, View } from "react-native";
import { HistoryIcon, ListingItemsIcon } from "@/ui/assets/icons";
import { useTheme } from "@/ui/hooks";
import { Legend } from "../../Legend/Legend.component";
import { createListCardStyles } from "./ListCard.styles";
import type { ListCardProps } from "./ListCard.types";

export const ListCard = ({
	lastUsed,
	lowestPrice,
	title,
	onLongPress,
	onPress,
	itemsQuantity,
}: ListCardProps) => {
	const { theme } = useTheme();
	const hasLastUsedInfo = !!lastUsed;
	const formattedDate = lastUsed?.toLocaleDateString();
	const formattedTime = lastUsed?.toLocaleTimeString();
	const lastUsedText = `Utilizada em ${formattedDate} às ${formattedTime}`;

	const styles = createListCardStyles(theme);

	return (
		<Pressable
			style={styles.container}
			testID="list-card"
			onPress={onPress}
			onLongPress={onLongPress}>
			<View style={{ ...styles.subContainer, ...styles.listInfoContainer }}>
				<Text
					testID="list-card-title"
					style={styles.title}>
					{title}
				</Text>
				<View style={styles.legendContainer}>
					<Legend
						icon={
							<ListingItemsIcon
								size={theme.spacing.sm2}
								color={theme.colors.legend.icon}
							/>
						}
						id="list-card-items-quantity"
						text={`${itemsQuantity} items`}
					/>
					{hasLastUsedInfo && (
						<Legend
							icon={
								<HistoryIcon
									size={theme.spacing.sm2}
									color={theme.colors.legend.icon}
								/>
							}
							id="list-card-last-used"
							text={lastUsedText}
						/>
					)}
				</View>
			</View>
			<View style={{ ...styles.subContainer, ...styles.priceInfoContainer }}>
				<Text
					testID="list-card-lowest-price-label"
					style={styles.priceLabel}>
					Menor preço
				</Text>
				<Text
					testID="list-card-lowest-price-value"
					style={styles.price}>
					R$ {lowestPrice.toFixed(2)}
				</Text>
			</View>
		</Pressable>
	);
};
