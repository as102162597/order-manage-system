export class ResponseWrapper<T> {
    statusCode: number;
    statusMessage: string;
    message: string;
    data: T;
    responseTime: Date;

    constructor(data: T, message = 'success', statusCode = 200, statusMessage = 'OK') {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.message = message;
        this.data = data;
        this.responseTime = new Date();
    }
};
