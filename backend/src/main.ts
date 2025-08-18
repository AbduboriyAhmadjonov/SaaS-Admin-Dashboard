import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });

    app.use(cookieParser());

    const port = 8000;

    await app.listen(8000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Ishga tushirishda xatolik yuz berdi:', error);
    process.exit(1);
  }
}
bootstrap();
