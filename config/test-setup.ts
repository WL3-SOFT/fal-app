/** biome-ignore-all lint/style/useNamingConvention: Padrão utilizado pelo expo/icons*/
/** biome-ignore-all lint/suspicious/noExplicitAny: Permitido por ser utilizado para os testes*/
/** biome-ignore-all lint/nursery/noSecrets: Não se trata de uma secret */
jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const { Text } = require("react-native");

	const createMockIconComponent = (familyName: string) => {
		return ({ name, testID, ...props }: any) =>
			React.createElement(
				Text,
				{ testID: testID || `icon-${familyName}-${name}`, ...props },
				name,
			);
	};

	return {
		MaterialCommunityIcons: createMockIconComponent("MaterialCommunityIcons"),
		MaterialIcons: createMockIconComponent("MaterialIcons"),
	};
});
