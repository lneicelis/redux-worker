import { Observable } from "@reactivex/rxjs/dist/cjs/Observable";
import '@reactivex/rxjs/dist/cjs/add/operator/share';
import '@reactivex/rxjs/dist/cjs/add/operator/map';
import '@reactivex/rxjs/dist/cjs/add/operator/filter';
import '@reactivex/rxjs/dist/cjs/add/operator/distinctUntilChanged';
import '@reactivex/rxjs/dist/cjs/add/operator/takeUntil';
import '@reactivex/rxjs/dist/cjs/add/operator/mergeMap';
import '@reactivex/rxjs/dist/cjs/add/operator/startWith';
import { Action, Store } from "redux";
export declare function createWorkerStreams(store: Store<any>, selectorRegistry: SelectorRegistry, worker?: Window): {
    message$: Observable<Message>;
    storeAction$: Observable<Action>;
    selectorSubscription$: Observable<SelectorSubscription>;
    selectorUnsubscription$: Observable<SelectorUnsubscription>;
    state$: Observable<any>;
    selectorResult$: Observable<SelectorResult>;
};
