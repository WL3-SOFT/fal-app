import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

import { CustomButton } from "@/ui/components";
import { useTheme } from "@/ui/hooks";
import { useCreateList } from "./CreateList.hook";
import { createCreateListStyles } from "./CreateList.styles";

export const ListCreateView = () => {
	const { theme } = useTheme();

	const { control, isSubmitting, createList, canSubmit } = useCreateList();

	const styles = createCreateListStyles(theme);

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>Qual o nome da sua lista?</Text>
			</View>
			<Controller
				control={control}
				rules={{
					required: true,
				}}
				name="name"
				render={({ field }) => (
					<TextInput
						placeholder="Digite o nome da sua lista"
						value={field.value}
						onChangeText={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						style={styles.input}
					/>
				)}
			/>
			<CustomButton
				title="Criar lista"
				onPress={createList}
				id="add-list"
				variant="primary"
				disabled={!canSubmit}
				isUnderAction={isSubmitting}
				underActionTitle="criando lista"
				size="large"
			/>
		</View>
	);
};
