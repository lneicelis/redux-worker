import '@reactivex/rxjs/dist/cjs/add/operator/share';
import '@reactivex/rxjs/dist/cjs/add/operator/map';
import '@reactivex/rxjs/dist/cjs/add/operator/filter';
import '@reactivex/rxjs/dist/cjs/add/operator/switchMap';
import { Action } from "redux";
export declare function createWorkerStore(worker: Worker): {
    messageEvent$: any;
    message$: any;
    selectorResult$: any;
    createSelectorResult$: (selectorName: string) => any;
    dispatch: (action: Action) => void;
};
