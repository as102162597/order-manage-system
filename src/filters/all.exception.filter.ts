import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { StatusCodeTranslator } from "src/common/status.code.translator";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly translator = new StatusCodeTranslator();
    private readonly logger = new Logger();

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            statusMessage: this.translator.translate(status),
            message: exception instanceof Error ? exception.message : 'Something went wrong',
            errorCode: exception?.response?.errorCode
                || exception?.code
                || 'UNKNOWN_ERROR',
            path: request.url,
            responseTime: new Date()
        };

        // this.logger.debug(exception.stack);
        // console.log(exception);

        response.status(status).json(errorResponse);
    }
};
