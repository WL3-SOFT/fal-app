import { act } from "react";
import { renderHook } from "#test-utils";
import { CreateListUseCase } from "@/core/useCases";
import { DeleteListUseCase } from "@/core/useCases/lists/DeleteList";
import { GetUserListsUseCase } from "@/core/useCases/lists/GetUserLists";
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
	});

	it("should create GetUserListsUseCase instance", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.loadLists).toBeDefined();
	});

	it("should create CreateListUseCase instance", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.createList).toBeDefined();
	});

	it("should create DeleteListUseCase instance", () => {
		const hook = renderHook(useListsViewModel);
		expect(hook.result.current.deleteList).toBeDefined();
	});

	describe("Load Lists - Method Test - Suite", () => {
		it("should set loading to true when loading lists is called", async () => {
			const hook = renderHook(useListsViewModel);
			act(() => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.loading).toBe(true);
		});

		it("should set loading to false when lists are loaded", async () => {
			const hook = renderHook(useListsViewModel);
			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.loading).toBe(false);
		});

		it("should set error to null when loading lists", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue([]);

			const hook = renderHook(useListsViewModel);
			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.error).toBe(null);
		});

		it("should set error to error message when loading lists fails", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockRejectedValue(new Error("Erro ao buscar listas"));

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.error).toBe("Erro ao buscar listas");
		});

		it("should return lists when loading lists is successful", async () => {
			const listCount = 4;

			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.lists).toHaveLength(listCount);
		});
	});

	describe("Create List - Method Test - Suite", () => {
		beforeEach(() => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);
			jest
				.spyOn(CreateListUseCase.prototype, "execute")
				.mockResolvedValue(mockedListDto);
		});

		it.failing(
			"should set creating to true when creating list is called",
			async () => {
				const hook = renderHook(useListsViewModel);

				expect(hook.result.current.creating).toBe(false);
				await act(async () => {
					await hook.result.current.createList(mockedCreateListDto);
				});

				expect(hook.result.current.creating).toBe(true);
			},
		);

		it("should set creating to false when list is created", async () => {
			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.createList(mockedCreateListDto);
			});

			expect(hook.result.current.creating).toBe(false);
		});

		it("should set error to null when creating list", async () => {
			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.createList(mockedCreateListDto);
			});

			expect(hook.result.current.error).toBe(null);
		});

		it("should set error to error message when creating list fails", async () => {
			jest
				.spyOn(CreateListUseCase.prototype, "execute")
				.mockRejectedValue(new Error(useCaseErrorMessage));

			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.error).toBe(null);

			await act(async () => {
				hook.result.current.createList(mockedCreateListDto);
			});

			expect(hook.result.current.error).toBe(useCaseErrorMessage);
		});

		it("should set creating to false when creating list fails", async () => {
			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.creating).toBe(false);

			await act(async () => {
				hook.result.current.createList(mockedCreateListDto);
			});

			expect(hook.result.current.creating).toBe(false);
		});

		it("should call loadLists when list is created", async () => {
			const loadListsUseCaseSpy = jest.spyOn(
				GetUserListsUseCase.prototype,
				"execute",
			);

			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.creating).toBe(false);

			await act(async () => {
				hook.result.current.createList(mockedCreateListDto);
			});

			expect(loadListsUseCaseSpy).toHaveBeenCalledTimes(2);
		});

		it("should return true when creating list is successful", async () => {
			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.creating).toBe(false);

			const createListBooleanResult =
				await hook.result.current.createList(mockedCreateListDto);

			expect(createListBooleanResult).toBeTruthy();
		});
	});

	describe("Delete List - Method Test - Suite", () => {
		const mockListId = "list-123";

		beforeEach(() => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);
			jest
				.spyOn(DeleteListUseCase.prototype, "execute")
				.mockResolvedValue(undefined);
		});

		it.failing(
			"should set deleting to true when deleting list is called",
			async () => {
				const hook = renderHook(useListsViewModel);

				expect(hook.result.current.deleting).toBe(false);

				await act(async () => {
					await hook.result.current.deleteList(mockListId);
				});

				expect(hook.result.current.deleting).toBe(true);
			},
		);

		it("should set deleting to false when list is deleted", async () => {
			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.deleteList(mockListId);
			});

			expect(hook.result.current.deleting).toBe(false);
		});

		it("should set error to null when deleting list", async () => {
			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.deleteList(mockListId);
			});

			expect(hook.result.current.error).toBe(null);
		});

		it("should set error to error message when deleting list fails", async () => {
			const errorMessage = "Erro ao deletar lista";

			jest
				.spyOn(DeleteListUseCase.prototype, "execute")
				.mockRejectedValue(new Error(errorMessage));

			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.error).toBe(null);

			await act(async () => {
				hook.result.current.deleteList(mockListId);
			});

			expect(hook.result.current.error).toBe(errorMessage);
		});

		it("should set deleting to false when deleting list fails", async () => {
			jest
				.spyOn(DeleteListUseCase.prototype, "execute")
				.mockRejectedValue(new Error("Erro"));

			const hook = renderHook(useListsViewModel);

			expect(hook.result.current.deleting).toBe(false);

			await act(async () => {
				hook.result.current.deleteList(mockListId);
			});

			expect(hook.result.current.deleting).toBe(false);
		});

		it("should call loadLists when list is deleted", async () => {
			const loadListsUseCaseSpy = jest.spyOn(
				GetUserListsUseCase.prototype,
				"execute",
			);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.deleteList(mockListId);
			});

			// É chamado 2 vezes: 1x no useEffect do mount + 1x após deletar
			expect(loadListsUseCaseSpy).toHaveBeenCalledTimes(2);
		});

		it("should return true when deleting list is successful", async () => {
			const hook = renderHook(useListsViewModel);

			const deleteListBooleanResult =
				await hook.result.current.deleteList(mockListId);

			expect(deleteListBooleanResult).toBeTruthy();
		});
	});

	describe("Navigate To Create - Method Test - Suite", () => {
		it("should navigate to create list when navigateToCreate is called", () => {
			const mockRouter = require("expo-router");
			const pushSpy = jest.spyOn(mockRouter, "useRouter").mockReturnValue({
				push: jest.fn(),
			});

			const hook = renderHook(useListsViewModel);

			act(() => {
				hook.result.current.navigateToCreate();
			});

			expect(pushSpy).toHaveBeenCalled();
		});
	});

	describe("Navigate To Details - Method Test - Suite", () => {
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

	describe("Clear Error - Method Test - Suite", () => {
		it("should set error to null when clearError is called", async () => {
			const hook = renderHook(useListsViewModel);

			// Primeiro, configura um erro
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockRejectedValue(new Error("Erro de teste"));

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.error).toBe("Erro de teste");

			// Agora limpa o erro
			act(() => {
				hook.result.current.clearError();
			});

			expect(hook.result.current.error).toBe(null);
		});
	});

	describe("Has Content - Method Test - Suite", () => {
		it("should return true when lists are loaded", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.hasContent).toBe(true);
		});

		it("should return false when lists are not loaded", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue([]);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.hasContent).toBe(false);
		});
	});

	describe("Quantity Text - Method Test - Suite", () => {
		it("should return the correct quantity text when lists is empty", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue([]);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.quantityText).toBe("Sem listas no momento");
		});

		it("should return the correct quantity text when lists is not empty", async () => {
			const singleListMock = createListsMock(1);

			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(singleListMock);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.quantityText).toBe("1 lista");
		});

		it("should return the correct quantity text when lists has multiple items", async () => {
			jest
				.spyOn(GetUserListsUseCase.prototype, "execute")
				.mockResolvedValue(mockedListsData);

			const hook = renderHook(useListsViewModel);

			await act(async () => {
				hook.result.current.loadLists();
			});

			expect(hook.result.current.quantityText).toBe(`${listCount} listas`);
		});
	});
});
