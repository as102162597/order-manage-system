import { HttpException, HttpStatus } from "@nestjs/common";

export class Rejector {
    reject(
        response: string | Record<string, any> = 'Unknown error',
        status = HttpStatus.INTERNAL_SERVER_ERROR
    ): void {
        throw new HttpException(response, status);
    }
};
