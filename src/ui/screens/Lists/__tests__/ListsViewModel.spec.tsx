import { act } from "react";
import { renderHook, waitFor } from "#test-utils";
import { CreateListUseCase } from "@/core/useCases";
import { DeleteListUseCase } from "@/core/useCases/lists/DeleteList";
import { GetUserListsUseCase } from "@/core/useCases/lists/GetUserLists";
import { useListsStore } from "@/ui/stores/Lists.store";
import { useListsViewModel } from "../Lists.viewModel";
import {
	createListsMock,
	listCount,
	mockedCreateListDto,
	mockedListDto,
	mockedListsData,
	useCaseErrorMessage,
} from "./utils";

describe("Lists View Model - Unit Test - Suite", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useListsStore.setState({
			lists: [],
			currentList: null,
			currentProducts: [],
			loadingState: "idle",
			error: null,
		});
	});

	it("should initialize with empty lists", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.lists).toEqual([]);
	});

	it("should have createList method defined", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.createList).toBeDefined();
	});

	it("should have deleteList method defined", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.deleteList).toBeDefined();
	});

	describe("Auto Load Lists on Mount - Test Suite", () => {
		it("should automatically load lists on mount", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.lists).toHaveLength(listCount);
			});
		});

		it("should set loading to false after lists are loaded", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.loading).toBe(false);
			});
		});

		it("should set error when loading lists fails", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockRejectedValue(new Error("Erro ao buscar listas"));

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.error).toBe("Erro ao buscar listas");
			});
		});
	});

	describe("Create List - Method Test Suite", () => {
		beforeEach(() => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);
			jest
				.spyOn(CreateListUseCase.prototype, "execute")
				.mockResolvedValue(mockedListDto);
		});

		it("should return true when creating list is successful", async () => {
			const hook = renderHook(useListsViewModel);

			const result = await act(async () => {
				return await hook.result.current.createList(mockedCreateListDto);
			});

			expect(result).toBe(true);
		});

		it("should reload lists after creating a new list", async () => {
			const loadListsUseCaseSpy = jest.spyOn(
				GetUserListsUseCase.prototype,
				"execute",
			);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				await hook.result.current.createList(mockedCreateListDto);
			});

			expect(loadListsUseCaseSpy).toHaveBeenCalledTimes(2);
		});

		it("should return false when creating list fails", async () => {
			jest
				.spyOn(CreateListUseCase.prototype, "execute")
				.mockRejectedValue(new Error(useCaseErrorMessage));

			const hook = renderHook(useListsViewModel);

			const result = await act(async () => {
				return await hook.result.current.createList(mockedCreateListDto);
			});

			expect(result).toBe(false);
		});
	});

	describe("Delete List - Method Test Suite", () => {
		const mockListId = "list-123";

		beforeEach(() => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);
			jest
				.spyOn(DeleteListUseCase.prototype, "execute")
				.mockResolvedValue(undefined);
		});

		it("should return true when deleting list is successful", async () => {
			const hook = renderHook(useListsViewModel);

			const result = await act(async () => {
				return await hook.result.current.deleteList(mockListId);
			});

			expect(result).toBe(true);
		});

		it("should reload lists after deleting a list", async () => {
			const loadListsUseCaseSpy = jest.spyOn(
				GetUserListsUseCase.prototype,
				"execute",
			);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				await hook.result.current.deleteList(mockListId);
			});

			expect(loadListsUseCaseSpy).toHaveBeenCalledTimes(2);
		});

		it("should return false when deleting list fails", async () => {
			jest
				.spyOn(DeleteListUseCase.prototype, "execute")
				.mockRejectedValue(new Error("Erro ao deletar lista"));

			const hook = renderHook(useListsViewModel);

			const result = await act(async () => {
				return await hook.result.current.deleteList(mockListId);
			});

			expect(result).toBe(false);
		});
	});

	describe("Refresh - Method Test Suite", () => {
		it("should refresh lists when refresh is called", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.lists).toHaveLength(listCount);
			});

			act(() => {
				hook.result.current.refresh();
			});

			await waitFor(() => {
				expect(hook.result.current.refreshing).toBe(false);
			});
		});
	});

	describe("Navigate To Create - Method Test Suite", () => {
		it("should navigate to create list when navigateToCreate is called", () => {
			const mockRouter = require("expo-router");
			const navigateSpy = jest.spyOn(mockRouter, "useRouter").mockReturnValue({
				navigate: jest.fn(),
			});

			const hook = renderHook(useListsViewModel);

			act(() => {
				hook.result.current.navigateToCreate();
			});

			expect(navigateSpy).toHaveBeenCalled();
		});
	});

	describe("Navigate To Details - Method Test Suite", () => {
		it("should navigate to list details when navigateToDetails is called", () => {
			const mockListId = "list-123";
			const mockRouter = require("expo-router");
			const pushSpy = jest.spyOn(mockRouter, "useRouter").mockReturnValue({
				push: jest.fn(),
			});

			const hook = renderHook(useListsViewModel);

			act(() => {
				hook.result.current.navigateToDetails(mockListId);
			});

			expect(pushSpy).toHaveBeenCalled();
		});
	});

	describe("Has Content - Method Test Suite", () => {
		it("should return true when lists are loaded", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.hasContent).toBe(true);
			});
		});

		it("should return false when lists are empty", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue([]);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.hasContent).toBe(false);
			});
		});
	});

	describe("Quantity Text - Method Test Suite", () => {
		it("should return the correct quantity text when lists is empty", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue([]);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.quantityText).toBe("Sem listas no momento");
			});
		});

		it("should return the correct quantity text when lists has one item", async () => {
			const singleListMock = createListsMock(1);

			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(singleListMock);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.quantityText).toBe("1 lista");
			});
		});

		it("should return the correct quantity text when lists has multiple items", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await waitFor(() => {
				expect(hook.result.current.quantityText).toBe(`${listCount} listas`);
			});
		});
	});
});
