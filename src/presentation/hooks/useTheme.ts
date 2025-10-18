/** biome-ignore-all lint/nursery/noSecrets: Não existe secret no arquivo abaixo */
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme deve ser usado dentro de ThemeProvider");
	}

	return context;
}
