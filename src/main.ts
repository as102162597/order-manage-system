import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './filters/response.interceptor';
import { AllExceptionsFilter } from './filters/all.exception.filter';
import { configuration } from './configuration';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(configuration?.server?.port ?? 3000, configuration?.server?.host ?? '0.0.0.0');
}
bootstrap();
