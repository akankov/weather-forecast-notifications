import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { WeatherProviderService } from './weather-provider/weather-provider.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user/user.service';
import { CourierApiService } from './courier-api/courier-api.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [],
  providers: [
    TaskService,
    WeatherProviderService,
    UserService,
    PrismaService,
    CourierApiService,
  ],
})
export class AppModule {}
