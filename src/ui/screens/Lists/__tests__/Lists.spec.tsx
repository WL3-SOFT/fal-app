import { fireEvent, render, waitFor } from "#test-utils";
import { ListsView } from "../Lists.view";
import { useListsViewModel } from "../Lists.viewModel";
import { createListsMock } from "./utils";

const mockLoadLists = jest.fn();
const mockCreateList = jest.fn();
const mockDeleteList = jest.fn();
const mockNavigateToCreate = jest.fn();
const mockNavigateToDetails = jest.fn();
const mockClearError = jest.fn();

jest.mock("../Lists.viewModel");

const MOCKED_LISTS_LENGTH = 3;

describe("List View - Component Test - Suite", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("With Lists - Suite", () => {
		beforeEach(() => {
			const mockLists = createListsMock(MOCKED_LISTS_LENGTH);

			(useListsViewModel as jest.Mock).mockReturnValue({
				lists: mockLists,
				loading: false,
				error: null,
				creating: false,
				deleting: null,
				hasContent: true,
				quantityText: `${MOCKED_LISTS_LENGTH} listas`,
				loadLists: mockLoadLists,
				createList: mockCreateList,
				deleteList: mockDeleteList,
				navigateToCreate: mockNavigateToCreate,
				navigateToDetails: mockNavigateToDetails,
				clearError: mockClearError,
			});
		});

		it("should render the list collection", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				const cardsOfList = ui.queryAllByTestId("list-card");
				expect(cardsOfList.length).toBe(MOCKED_LISTS_LENGTH);
			});
		});

		it("should render the create list button if list has items", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				const button = ui.getByTestId("create-list-button");
				const icon = ui.getByTestId(
					"icon-MaterialCommunityIcons-plus-box-outline",
				);

				expect(button).toBeVisible();
				expect(icon).toBeVisible();
			});
		});

		it("should display the correct quantity text", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				expect(ui.getByText("3 listas")).toBeVisible();
			});
		});
	});

	describe("Without Lists - Suite", () => {
		beforeEach(() => {
			(useListsViewModel as jest.Mock).mockReturnValue({
				lists: [],
				loading: false,
				error: null,
				creating: false,
				deleting: null,
				hasContent: false,
				quantityText: "Sem listas no momento",
				loadLists: mockLoadLists,
				createList: mockCreateList,
				deleteList: mockDeleteList,
				navigateToCreate: mockNavigateToCreate,
				navigateToDetails: mockNavigateToDetails,
				clearError: mockClearError,
			});
		});

		it("should not render the list of lists", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				const cardsOfList = ui.queryAllByTestId("list-card");
				expect(cardsOfList.length).toBe(0);
			});
		});

		it("should render the no lists message", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				expect(ui.getByText("Sem listas no momento")).toBeVisible();
			});
		});

		it("should render the no list fallback", () => {
			const ui = render(<ListsView />);

			expect(ui.getByText("Tire sua lista do")).toBeVisible();
			expect(ui.getByText("papel.")).toBeVisible();
			expect(ui.getByText("Crie sua")).toBeVisible();
			expect(ui.getByText("primeira")).toBeVisible();
			expect(ui.getByText("lista!")).toBeVisible();
		})

		it("should render the create list button if list is empty", async () => {
			const ui = render(<ListsView />);

			await waitFor(() => {
				const button = ui.getByTestId("create-list-button");
				expect(button).toBeVisible();
			});
		});
	});

	describe("Actions - Suite", () => {
		const mockLists = createListsMock(MOCKED_LISTS_LENGTH);
		beforeEach(() => {
			(useListsViewModel as jest.Mock).mockReturnValue({
				lists: mockLists,
				loading: false,
				error: null,
				creating: false,
				deleting: null,
				hasContent: true,
				quantityText: `${MOCKED_LISTS_LENGTH} listas`,
				loadLists: mockLoadLists,
				createList: mockCreateList,
				deleteList: mockDeleteList,
				navigateToCreate: mockNavigateToCreate,
				navigateToDetails: mockNavigateToDetails,
				clearError: mockClearError,
			});
		});

		it("should navigate to list details when a list is pressed", async () => {
			const ui = render(<ListsView />);

			expect(mockNavigateToDetails).toHaveBeenCalledTimes(0);

			await waitFor(() => {
				const firstListCard = ui.queryAllByTestId("list-card")[0];
				fireEvent.press(firstListCard);
			});

			expect(mockNavigateToDetails).toHaveBeenCalledTimes(1);
			expect(mockNavigateToDetails).toHaveBeenCalledWith(mockLists[0]?.id);
		});
		it("should navigate to create list when create button is pressed", async () => {
			const ui = render(<ListsView />);

			expect(mockNavigateToCreate).toHaveBeenCalledTimes(0);

			await waitFor(() => {
				const firstListCard = ui.queryByTestId("create-list-button");
				fireEvent.press(firstListCard);
			});

			expect(mockNavigateToCreate).toHaveBeenCalledTimes(1);
		});
	});
});
