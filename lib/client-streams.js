"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("@reactivex/rxjs/dist/cjs/Observable");
var messge_types_1 = require("./messge-types");
function createWorkerStore(worker) {
    var messageEvent$ = Observable_1.Observable.create(function (observer) {
        var handler = function (event) { return observer.next(event); };
        worker.addEventListener('message', handler);
        return worker.removeEventListener('message', handler);
    }).share();
    var message$ = messageEvent$
        .map(function (event) { return event.data; });
    var selectorResult$ = message$
        .filter(function (msg) { return msg.type === messge_types_1.SELECTOR_RESULT; })
        .map(function (msg) { return msg.payload; });
    var createSelectorResult$ = function (selectorName) {
        return Observable_1.Observable
            .create(function (observer) {
            var subscriptionId = selectorName + ":" + Date.now().toString();
            observer.next(subscriptionId);
            worker.postMessage({
                type: messge_types_1.SELECTOR_SUBSCRIPTION,
                payload: {
                    selectorName: selectorName,
                    subscriptionId: subscriptionId,
                }
            });
            return function () { return worker.postMessage({
                type: messge_types_1.SELECTOR_UNSUBSCRIPTION,
                payload: { subscriptionId: subscriptionId },
            }); };
        })
            .switchMap(function (subscriptionId) { return selectorResult$
            .filter(function (payload) { return payload.subscriptionId === subscriptionId; })
            .map(function (_a) {
            var result = _a.result;
            return result;
        }); });
    };
    var dispatch = function (action) { return worker.postMessage({
        type: messge_types_1.STORE_ACTION,
        payload: action
    }); };
    return {
        messageEvent$: messageEvent$,
        message$: message$,
        selectorResult$: selectorResult$,
        createSelectorResult$: createSelectorResult$,
        dispatch: dispatch,
    };
}
exports.createWorkerStore = createWorkerStore;
//# sourceMappingURL=client-streams.js.map