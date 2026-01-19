import { normalizeDecimalNumbers } from "./normalizeDecimalNumbers";

export const getDateTime = (passedDate: string | Date) => {
	try {
		const date = passedDate instanceof Date ? passedDate : new Date(passedDate);

		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();

		const formattedDate = `${normalizeDecimalNumbers(day)}/${normalizeDecimalNumbers(month)}/${year}`;
		const formattedTime = `${normalizeDecimalNumbers(hour)}:${normalizeDecimalNumbers(minute)}`;

		return {
			date: formattedDate,
			time: formattedTime,
			day,
			month,
			year,
			hour,
			minute,
			second,
		};
	} catch {
		return null;
	}
};
