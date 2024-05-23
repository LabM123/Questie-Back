import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Questie API")
    .setDescription(
      "API que ofrece servicios para la administración de usuarios, cursos y contenido educativo en Questie, una aplicación de e-learning."
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Auth")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);
  app.enableCors();
  await app.listen(3001);
}

bootstrap();
