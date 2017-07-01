import {SELECTOR_RESULT} from "./messge-types";
import {createWorkerStreams} from "./worker-streams";
import {Action, Store} from "redux";


export function runWorkerStore(store: Store<any>, selectorRegistry: SelectorRegistry, worker: any = self) {
    const streams = createWorkerStreams(store, {
        state: (state: any) => state,
        ...selectorRegistry
    });

    streams.selectorResult$.subscribe((result: SelectorResult) => {
        worker.postMessage({
            type: SELECTOR_RESULT,
            payload: result
        });
    });

    streams.storeAction$.subscribe((storeAction: Action) => {
        store.dispatch(storeAction);
    });

    return streams;
}