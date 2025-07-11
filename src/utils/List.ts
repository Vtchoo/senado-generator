class List<T> {

    private values: T[] = []

    constructor(array?: T[]) {
        if (array)
            this.values = [...array]
    }

    add(item: T) {
        this.values.push(item);
    }

    get length(): number {
        return this.values.length;
    }

    get(index: number): T {
        return this.values[index];
    }

    set(index: number, value: T) {
        this.values[index] = value;
    }

    // sum(func: (obj: T) => number): number {
    //     return this.values.reduce((prev, curr) => prev + func(curr), 0);
    // }

    sum(func?: (obj: T) => number): number | never {
        if (typeof func === 'function') {
            return this.values.reduce((prev, curr) => prev + func(curr), 0);
        } else if (this.areAllNumbers()) {
            return (this.values as unknown as number[]).reduce((prev, curr) => prev + curr, 0);
        } else {
            throw new Error("No comparison function provided and List items are not numbers.");
        }
    }

    avg(func: (obj: T) => number): number {
        return this.sum(func) / this.values.length;
    }

    prod(func: (obj: T) => number): number {
        return this.values.reduce((prev, curr) => prev * func(curr), 1);
    }

    join(func: (obj: T) => string, separator = ','): string {
        return this.values.map(func).join(separator);
    }

    remove(item: T): void {
        this.values = this.values.filter(i => i !== item);
    }

    random(): T {
        const index = Math.floor(Math.random() * this.values.length);
        return this.values[index];
    }

    min(func: (obj: T) => number): number {
        return Math.min(...this.values.map(func));
    }

    distinct(func?: (obj: T) => any): List<T> {
        const identity = (obj: T) => obj;
        const comparator = func || identity;

        const distinctValues = this.values.reduce((result, item) => {
            if (!result.some(other => comparator(other) === comparator(item))) {
                result.push(item);
            }
            return result;
        }, [] as T[]);

        return new List<T>(distinctValues);
    }

    map<U>(callback: (value: T, index: number, array: T[]) => U): List<U> {
        return new List<U>(this.values.map(callback));
    }

    filter(predicate: (value: T) => boolean): List<T> {
        return new List<T>(this.values.filter(predicate));
    }

    sort(compareFn?: (a: T, b: T) => number): List<T> {
        return new List<T>([...this.values].sort(compareFn));
    }

    first(predicate?: (value: T) => boolean): T | undefined {
        if (predicate) {
            return this.values.find(predicate);
        }
        return this.values[0];
    }

    last(predicate?: (value: T) => boolean): T | undefined {
        if (predicate) {
            for (let i = this.values.length - 1; i >= 0; i--) {
                if (predicate(this.values[i])) {
                    return this.values[i];
                }
            }
        }
        return this.values[this.values.length - 1];
    }

    any(predicate: (value: T) => boolean): boolean {
        return this.values.some(predicate);
    }

    all(predicate: (value: T) => boolean): boolean {
        return this.values.every(predicate);
    }

    nonNullable(): List<NonNullable<T>> {
        return new List<NonNullable<T>>(this.values.filter((item): item is NonNullable<T> => item != undefined) as NonNullable<T>[]);
    }

    max(): T extends number ? number | undefined : never;
    max(func: (obj: T) => number): number;
    max(func?: (obj: T) => number): number | undefined | never {
        if (typeof func === 'function') {
            return Math.max(...this.values.map(func));
        } else if (this.areAllNumbers()) {
            return Math.max(...(this.values as unknown as number[]));
        } else {
            throw new Error("No comparison function provided and List items are not numbers.");
        }
    }

    private areAllNumbers(): this is List<number> {
        return this.values.every(item => typeof item === 'number');
    }

    toArray() {
        return [...this.values]
    }
}

export { List }
