export interface Iterator {
    hasNext(): boolean;
    next(): any;
};

export interface Iterable {
    getIterator(): Iterator;
};
