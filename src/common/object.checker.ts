import { HttpStatus } from "@nestjs/common";
import { Rejector } from "./rejector";

export class ObjectChecker {
    private readonly rejector = new Rejector();

    constructor(private readonly className: string) {}

    isArray(array: any): void {
        if (!Array.isArray(array)) {
            this.reject(`${this.className} must be an array`);
        }
    }

    isObject(object: any): void {
        if (typeof object !== 'object') {
            this.reject(`${this.className} must be an object`);
        } else if (!object) {
            this.reject(`${this.className} cannot be null`);
        }
    }

    includes(target: any, reference: any, fields: string[]): void {
        if (!Array.isArray(target) || !Array.isArray(reference) || !Array.isArray(fields)) {
            return;
        }

        for (const field of fields) {
            const referenceFields = reference.map(object => object[field]);

            for (const item of target) {
                if (!referenceFields.includes(item[field])) {
                    this.reject(
                        `${this.className} ${field} ${item[field]} isn't associated with the current parent object or doesn't exist`
                    );
                }
            }
        }
    }

    hasFields(object: any, fields: string[]): void {
        if (Array.isArray(fields)) {
            for (const field of fields) {
                if (!object[field]) {
                    this.reject(`Field '${field}' is required in ${this.className}`);
                }
            }
        }
    }

    hasNoFields(object: any, fields: string[]): void {
        if (Array.isArray(fields)) {
            for (const field of fields) {
                if (object[field]) {
                    this.reject(`Field '${field}' must not exist in ${this.className}`);
                }
            }
        }

    }

    hasNoDuplicate(array: any, fields: string[]): void {
        if (Array.isArray(array) && Array.isArray(fields)) {
            for (const field of fields) {
                this.hasNoDuplicateContent(array, field);
            }
        }
    }

    argvExist(object: any): void {
        if (object && typeof object === 'object') {
            for (const field in object) {
                if (!object[field]) {
                    this.reject(`Argument '${field}' is required`);
                }
            }
        }
    }

    private hasNoDuplicateContent(array: any, field: string): void {
        const set = new Set();

        for (const item of array) {
            if (set.has(item[field])) {
                this.reject(`Field '${field}' in ${this.className}(s) must be unique`);
            } else if (item[field]) {
                set.add(item[field]);
            }
        }
    }

    private reject(
        response: string | Record<string, any> = 'Unknown error',
        status = HttpStatus.BAD_REQUEST
    ): void {
        this.rejector.reject(response, status);
    }
};
