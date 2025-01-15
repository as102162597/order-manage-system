import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './filters/response.interceptor';
import { AllExceptionsFilter } from './filters/all.exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
