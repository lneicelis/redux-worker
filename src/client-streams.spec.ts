
import {createWorkerStore} from "./client-streams";

describe('createWorkerStore', () => {
    let worker: any;
    let addEventListener: any;

    beforeEach(() => {
        addEventListener = jest.fn();
        worker = {addEventListener};
    });

    it('has expected properties', () => {
        const instance = createWorkerStore(worker);
        const properties = Object.keys(instance);

        expect(properties).toEqual([
            'messageEvent$',
            'message$',
            'selectorResult$',
            'createSelectorResult$',
            'dispatch',
        ]);
    });

});