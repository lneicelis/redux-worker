import {Observable} from "@reactivex/rxjs/dist/cjs/Observable";
import {Observer} from "@reactivex/rxjs/dist/cjs/Observer";
import {SELECTOR_RESULT, SELECTOR_SUBSCRIPTION, SELECTOR_UNSUBSCRIPTION, STORE_ACTION} from "./messge-types";
import {Action} from "redux";

export function createWorkerStore(worker: Worker) {
    const messageEvent$ = Observable.create((observer: Observer<MessageEvent>) => {
        const handler = (event: MessageEvent) => observer.next(event);

        worker.addEventListener('message', handler);

        return worker.removeEventListener('message', handler);
    }).share();

    const message$ = messageEvent$
        .map((event: MessageEvent) => event.data);

    const selectorResult$ = message$
        .filter((msg: MessageEvent) => msg.type === SELECTOR_RESULT)
        .map((msg: Message) => msg.payload);

    const createSelectorResult$ = (selectorName: string) => {
        return Observable
            .create((observer: Observer<string>) => {
                const subscriptionId = `${selectorName}:${Date.now().toString()}`;

                observer.next(subscriptionId);

                worker.postMessage({
                    type: SELECTOR_SUBSCRIPTION,
                    payload: {
                        selectorName,
                        subscriptionId,
                    }
                });

                return () => worker.postMessage({
                    type: SELECTOR_UNSUBSCRIPTION,
                    payload: {subscriptionId},
                }   );
            })
            .switchMap((subscriptionId: string) => selectorResult$
                .filter((payload: SelectorResult) => payload.subscriptionId === subscriptionId)
                .map(({result}: SelectorResult) => result)
            );
    };

    const dispatch = (action: Action) => worker.postMessage({
        type: STORE_ACTION,
        payload: action
    });

    return {
        messageEvent$,
        message$,
        selectorResult$,
        createSelectorResult$,
        dispatch,
    };
}