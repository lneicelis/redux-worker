"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("@reactivex/rxjs/dist/cjs/Observable");
require("@reactivex/rxjs/dist/cjs/add/operator/share");
require("@reactivex/rxjs/dist/cjs/add/operator/map");
require("@reactivex/rxjs/dist/cjs/add/operator/filter");
require("@reactivex/rxjs/dist/cjs/add/operator/distinctUntilChanged");
require("@reactivex/rxjs/dist/cjs/add/operator/takeUntil");
require("@reactivex/rxjs/dist/cjs/add/operator/mergeMap");
require("@reactivex/rxjs/dist/cjs/add/operator/startWith");
var messge_types_1 = require("./messge-types");
var noop = function () { };
function createWorkerStreams(store, selectorRegistry, worker) {
    if (worker === void 0) { worker = self; }
    var messageEvent$ = Observable_1.Observable
        .create(function (observer) {
        var handler = function (event) { return observer.next(event); };
        worker.addEventListener('message', handler);
        return function () { return worker.removeEventListener('message', handler); };
    })
        .share();
    var message$ = messageEvent$
        .map(function (event) { return event.data; });
    var storeAction$ = message$
        .filter(function (msg) { return msg.type === messge_types_1.STORE_ACTION; })
        .map(function (msg) { return msg.payload; });
    var selectorSubscription$ = message$
        .filter(function (msg) { return msg.type === messge_types_1.SELECTOR_SUBSCRIPTION; })
        .map(function (msg) { return msg.payload; });
    var selectorUnsubscription$ = message$
        .filter(function (msg) { return msg.type === messge_types_1.SELECTOR_UNSUBSCRIPTION; })
        .map(function (msg) { return msg.payload; });
    var state$ = Observable_1.Observable.create(function (observer) {
        var handler = function () { return observer.next(store.getState()); };
        observer.next(store.getState());
        return store.subscribe(handler);
    });
    var selectorResult$ = selectorSubscription$
        .mergeMap(function (subscription) {
        var unsubscribed$ = selectorUnsubscription$
            .filter(function (unsubscription) {
            return unsubscription.subscriptionId === subscription.subscriptionId;
        });
        return state$
            .map(selectorRegistry[subscription.selectorName] || noop)
            .distinctUntilChanged()
            .map(function (result) { return ({
            subscriptionId: subscription.subscriptionId,
            result: result,
        }); })
            .takeUntil(unsubscribed$);
    });
    return {
        message$: message$,
        storeAction$: storeAction$,
        selectorSubscription$: selectorSubscription$,
        selectorUnsubscription$: selectorUnsubscription$,
        state$: state$,
        selectorResult$: selectorResult$,
    };
}
exports.createWorkerStreams = createWorkerStreams;
//# sourceMappingURL=worker-streams.js.map