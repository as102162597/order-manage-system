import { HttpException, HttpStatus } from "@nestjs/common";

export class Rejector {
    private defaultHttpStatus: number;

    constructor(defaultHttpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        this.defaultHttpStatus = defaultHttpStatus;
    }

    reject(
        response: string | Record<string, any> = 'Unknown error',
        status = this.defaultHttpStatus
    ): void {
        throw new HttpException(response, status);
    }
};
