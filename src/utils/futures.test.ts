import { CancelableResponse } from "../types/d2-api";
import { apiToFuture } from "./futures";

describe("apiToFuture", () => {
    it("cancels the underlying request when the future is cancelled", () => {
        const cancelRequest = jest.fn((_message?: string) => {});
        const response = CancelableResponse.build<string>({
            cancel: cancelRequest,
            response: () => new Promise(() => {}),
        });

        const cancel = apiToFuture(response).run(jest.fn(), jest.fn());
        expect(cancelRequest).not.toHaveBeenCalled();
        cancel();
        expect(cancelRequest).toHaveBeenCalledTimes(1);
        expect(cancelRequest).toHaveBeenCalledWith();
    });
});
