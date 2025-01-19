export class FieldContainer {
    private fields = [];
    private container = {};

    constructor(target: any, source: any) {
        if (Array.isArray(source)) {
            this.constructWithArraySource(target, source);
        } else if (this.isObject(source)) {
            this.constructWithObjectSource(target, source);
        }
    }

    restore(object: any): void {
        this.overwrite(object, this.container);
    }

    private constructWithArraySource(target: any, source: any): void {
        this.constructWithObjectSource(
            target,
            source.reduce((object, field) => {
                object[field] = undefined;
                return object;
            }, {})
        );
    }

    private constructWithObjectSource(target: any, source: any): void {
        this.fields = Object.keys(source);
        this.overwrite(this.container, target);
        this.overwrite(target, source);
    }

    private overwrite(target: any, source: any): void {
        if (this.isObject(target) && this.isObject(source)) {
            for (const field of this.fields) {
                target[field] = source[field];
            }
        }
    }

    private isObject(object: any): boolean {
        return object && typeof object === 'object';
    }
};
