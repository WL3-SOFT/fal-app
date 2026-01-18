import { useCallback } from "react";
import {
	dismissToast,
	showToast,
	showToastPromise,
} from "react-native-nitro-toast";
import { useTheme } from "./useTheme";

type ToastCallback = {
	close: () => void;
};

type ToastProps = {
	message: string;
	title?: string;
};

type AsyncToastProps<T> = {
	promise: Promise<T>;
	success: {
		title?: string;
		message: string | ((result: T) => string);
	};
	error: {
		title?: string;
		message: string | ((error: Error) => string);
	};
	loading: {
		title?: string;
		message: string;
	};
};

export type PromiseResult<T> =
	| { success: true; data: T; error: null }
	| { success: false; data: null; error: Error };

interface UseToastProps {
	success: (props: ToastProps) => ToastCallback;
	error: (props: ToastProps) => ToastCallback;
	info: (props: ToastProps) => ToastCallback;
	warning: (props: ToastProps) => ToastCallback;
	loading: (props: ToastProps) => ToastCallback;
	default: (props: ToastProps) => ToastCallback;
	promise: <T>(props: AsyncToastProps<T>) => Promise<PromiseResult<T>>;
}

const DEFAULT_TOAST_DURATION = 5000;
const ONE_SECOND_IN_MILLISECONDS = 1000;

export const useToast = (): UseToastProps => {
	const { theme } = useTheme();

	const toastFn = useCallback(
		// biome-ignore lint/nursery/useMaxParams: Necessário para permitir customização do toast
		(
			message: string,
			title?: string,
			type:
				| "success"
				| "error"
				| "info"
				| "warning"
				| "loading"
				| "default" = "default",
			duration?: number,
			backgroundColor?: string,
			titleColor?: string,
		) => {
			const id = showToast(message, {
				type,
				title,
				duration: duration
					? duration * ONE_SECOND_IN_MILLISECONDS
					: DEFAULT_TOAST_DURATION,
				fontFamily: theme.typography.fontFamily.primary,
				position: "top",
				haptics: true,
				...(backgroundColor && { backgroundColor: theme.colors.background }),
				...(titleColor && { titleColor: theme.colors.text }),
			});

			const close = () => {
				if (id) {
					dismissToast(id);
				}
			};

			return { close };
		},
		[theme],
	);

	const success = (props: ToastProps) => {
		return toastFn(props.message, props.title, "success");
	};

	const error = (props: ToastProps) => {
		return toastFn(props.message, props.title, "error");
	};

	const info = (props: ToastProps) => {
		return toastFn(props.message, props.title, "info");
	};

	const warning = (props: ToastProps) => {
		return toastFn(props.message, props.title, "warning");
	};

	const loading = (props: ToastProps) => {
		return toastFn(props.message, props.title, "loading", 10);
	};

	const defaultToast = (props: ToastProps) => {
		return toastFn(props.message, props.title, "default");
	};

	const promise = async <T>(
		props: AsyncToastProps<T>,
	): Promise<PromiseResult<T>> => {
		showToastPromise(
			props.promise,
			{
				success: props.success.message,
				error: props.error.message,
				loading: props.loading.message,
			},
			{
				fontFamily: theme.typography.fontFamily.primary,
				position: "top",
				haptics: true,
				duration: DEFAULT_TOAST_DURATION,
				success: {
					title: props.success?.title ?? "",
				},
				error: {
					title: props.error?.title ?? "Ops, algo deu errado!",
				},
				loading: {
					title: props.loading?.title ?? "Em andamento",
				},
			},
		);

		try {
			const data = await props.promise;
			return { success: true, data, error: null };
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			return { success: false, data: null, error: err };
		}
	};

	return {
		success,
		error,
		info,
		warning,
		loading,
		default: defaultToast,
		promise,
	};
};
