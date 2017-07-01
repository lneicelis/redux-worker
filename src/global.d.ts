interface Message {
    type: string;
    payload: any;
}

interface SelectorSubscription {
    subscriptionId: string;
    selectorName: string;
}

interface SelectorUnsubscription {
    subscriptionId: string;
}

interface SelectorResult {
    subscriptionId: string;
    result: any
}

interface Selector {
    (state: any): any;
}

interface SelectorRegistry {
    [key: string]: Selector;
}