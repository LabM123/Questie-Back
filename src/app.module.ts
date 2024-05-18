import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ContentsModule } from './modules/contents/contents.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { StatsModule } from './modules/stats/stats.module';
import { EnrolmentsModule } from './modules/enrolments/enrolments.module';
import { AuthModule } from './modules/auth/auth.module';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UploadfileModule } from './modules/uploadfile/uploadfile.module';
import { PaypalModule } from './modules/payments/paypal/paypal.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SearchModule } from "./modules/search/search.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm') as DataSourceOptions,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    ContentsModule,
    InvoicesModule,
    StatsModule,
    EnrolmentsModule,
    AuthModule,
    UploadfileModule,
    PaypalModule,
    PaymentsModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
