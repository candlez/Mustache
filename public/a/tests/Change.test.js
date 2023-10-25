import Change from "../model/Change.js";

describe("unit testing for Change class", () => {
    var change;

    beforeEach(() => {
        change = new Change("client1", 0, {tickle: "tickle"}, 50, "client2");
    });

    test("testing constructor", () => {
        expect(change.getID()).toBe("client1");
        expect(change.getCode()).toBe(0);
        expect(change.getData()).toStrictEqual({tickle: "tickle"});
        expect(change.getTimeStamp()).toBe(50);
        expect(change.getSender()).toBe("client2");
    });
});