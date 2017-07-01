"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var messge_types_1 = require("./messge-types");
var worker_streams_1 = require("./worker-streams");
function runWorkerStore(store, selectorRegistry, worker) {
    if (worker === void 0) { worker = self; }
    var streams = worker_streams_1.createWorkerStreams(store, __assign({ state: function (state) { return state; } }, selectorRegistry));
    streams.selectorResult$.subscribe(function (result) {
        worker.postMessage({
            type: messge_types_1.SELECTOR_RESULT,
            payload: result
        });
    });
    streams.storeAction$.subscribe(function (storeAction) {
        store.dispatch(storeAction);
    });
    return streams;
}
exports.runWorkerStore = runWorkerStore;
//# sourceMappingURL=index.js.map