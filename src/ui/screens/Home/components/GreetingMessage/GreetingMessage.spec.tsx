import { render } from "@test-utils";
import { GreetingMessage } from "./GreetingMessage.component";

describe("Greeting Message Test Component - Suite", () => {
	it("should render the greeting message", () => {
		const { getByTestId } = render(<GreetingMessage />);
		const messageComponent = getByTestId("greeting-message");

		expect(messageComponent).toBeVisible();
	});
});
