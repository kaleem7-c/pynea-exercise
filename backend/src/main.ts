import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT;
  if (typeof port !== 'string') {
    throw new Error('Environment variable "PORT" is not defined');
  }
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Serving GraphQL API at http://localhost:${port}/graphql`);
}
bootstrap();
