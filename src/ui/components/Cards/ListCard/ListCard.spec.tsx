import { render } from "#test-utils";
import { ListCard } from "./ListCard.component";
import type { ListCardProps } from "./ListCard.types";

const data: ListCardProps = {
	id: "1",
	itemsQuantity: 107,
	lastUsed: new Date(),
	lowestPrice: 684.21,
	title: "Lista de compras mensal",
};

describe("List Card - Component Test - Suite", () => {
	it("should render the list card title", () => {
		const component = render(<ListCard {...data} />);
		const title = component.getByTestId("list-card-title");

		expect(title).toBeVisible();
		expect(title).toHaveTextContent(data.title);
	});

	it("should render the list card items quantity", () => {
		const component = render(<ListCard {...data} />);
		const itemsQuantity = component.getByTestId(
			"list-card-items-quantity-text",
		);
		const quantityText = `${data.itemsQuantity} itens`;

		expect(itemsQuantity).toBeVisible();
		expect(itemsQuantity).toHaveTextContent(quantityText);
	});

	it("should render the list card last used date", () => {
		const component = render(<ListCard {...data} />);
		const lastUsed = component.getByTestId("list-card-last-used-text");

		expect(lastUsed).toBeVisible();
	});

	it("should not render the list card last used date", () => {
		const dataWithoutLastUsed = { ...data, lastUsed: undefined };
		const component = render(<ListCard {...dataWithoutLastUsed} />);
		const lastUsed = component.queryByTestId("list-card-last-used");

		expect(lastUsed).not.toBeOnTheScreen();
	});

	it("should render the list card lowest price value and label", () => {
		const component = render(<ListCard {...data} />);
		const lowestPriceLabel = component.getByTestId(
			"list-card-lowest-price-label",
		);
		const lowestPrice = component.getByTestId("list-card-lowest-price-value");

		expect(lowestPriceLabel).toBeVisible();
		expect(lowestPrice).toBeVisible();
	});

	it("should call on press function when the list card is pressed", async () => {
		const onPressCallback = jest.fn();
		const { user, ...component } = render(
			<ListCard
				{...data}
				onPress={onPressCallback}
			/>,
		);
		const listCard = component.getByTestId("list-card");

		await user.press(listCard);

		expect(onPressCallback).toHaveBeenCalledTimes(1);
	});

	it("should call on long press function when the list card is long pressed", async () => {
		const onLongPressCallback = jest.fn();
		const { user, ...component } = render(
			<ListCard
				{...data}
				onLongPress={onLongPressCallback}
			/>,
		);
		const listCard = component.getByTestId("list-card");

		await user.longPress(listCard);

		expect(onLongPressCallback).toHaveBeenCalledTimes(1);
	});
});
