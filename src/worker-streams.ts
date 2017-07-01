import {Observable} from "@reactivex/rxjs/dist/cjs/Observable"
import {Observer} from "@reactivex/rxjs/dist/cjs/Observer";
import '@reactivex/rxjs/dist/cjs/add/operator/share';
import '@reactivex/rxjs/dist/cjs/add/operator/map';
import '@reactivex/rxjs/dist/cjs/add/operator/filter';
import '@reactivex/rxjs/dist/cjs/add/operator/distinctUntilChanged';
import '@reactivex/rxjs/dist/cjs/add/operator/takeUntil';
import '@reactivex/rxjs/dist/cjs/add/operator/mergeMap';
import '@reactivex/rxjs/dist/cjs/add/operator/startWith';
import {SELECTOR_SUBSCRIPTION, SELECTOR_UNSUBSCRIPTION, STORE_ACTION} from "./messge-types";
import {Action, Store} from "redux";

const noop = () => {};

export function createWorkerStreams(store: Store<any>, selectorRegistry: SelectorRegistry, worker = self) {
    const messageEvent$: Observable<MessageEvent> = Observable
        .create((observer: Observer<MessageEvent>) => {
            const handler = (event: MessageEvent) => observer.next(event);

            worker.addEventListener('message', handler);

            return worker.removeEventListener('message', handler);
        })
        .share();

    const message$: Observable<Message> = messageEvent$
        .map((event: MessageEvent) => event.data);

    const storeAction$: Observable<Action> = message$
        .filter((msg: Message) => msg.type === STORE_ACTION)
        .map((msg: Message) => msg.payload);

    const selectorSubscription$: Observable<SelectorSubscription> = message$
        .filter((msg: Message) => msg.type === SELECTOR_SUBSCRIPTION)
        .map((msg: Message) => msg.payload);

    const selectorUnsubscription$: Observable<SelectorUnsubscription> = message$
        .filter((msg: Message) => msg.type === SELECTOR_UNSUBSCRIPTION)
        .map((msg: Message) => msg.payload);

    const state$: Observable<any> = Observable.create((observer: Observer<any>) => {
        const handler = () => observer.next(store.getState());

        observer.next(store.getState());

        return store.subscribe(handler);
    });

    const selectorResult$: Observable<SelectorResult> = selectorSubscription$
        .mergeMap((subscription: SelectorSubscription) => {
            const unsubscribed$ = selectorUnsubscription$
                .filter((unsubscription: SelectorUnsubscription) => {
                    return unsubscription.subscriptionId === subscription.subscriptionId;
                });

            return state$
                .map(selectorRegistry[subscription.selectorName] || noop)
                .distinctUntilChanged()
                .map((result: any) => ({
                    subscriptionId: subscription.subscriptionId,
                    result,
                }))
                .takeUntil(unsubscribed$);
        });

    return {
        message$,
        storeAction$,
        selectorSubscription$,
        selectorUnsubscription$,
        state$,
        selectorResult$,
    };
}