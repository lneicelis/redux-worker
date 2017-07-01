import { Action } from "redux";
export declare function createWorkerStore(worker: Worker): {
    messageEvent$: any;
    message$: any;
    selectorResult$: any;
    createSelectorResult$: (selectorName: string) => any;
    dispatch: (action: Action) => void;
};
