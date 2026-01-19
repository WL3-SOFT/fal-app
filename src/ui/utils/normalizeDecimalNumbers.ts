export const normalizeDecimalNumbers = (value: number) =>
	value < 10 ? `0${value}` : value;
