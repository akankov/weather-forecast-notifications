import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { WeatherProviderService } from '../weather-provider/weather-provider.service';
import { CourierApiService } from '../courier-api/courier-api.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly weatherProvider: WeatherProviderService;
  @Inject()
  private readonly courierApiService: CourierApiService;

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendWeatherNotifications(): Promise<void> {
    const users: User[] = await this.userService.getUsers();

    // group by coordinates and timezones to prevent duplicate calls to weather API
    const usersMap: Map<string, User[]> = users.reduce((acc, user) => {
      const key = `${user.latitude}_${user.latitude}_${user.timezone}`;
      const arr = acc.get(key) ?? [];

      arr.push(user);
      acc.set(key, arr);

      return acc;
    }, new Map());

    for (const users of usersMap.values()) {
      console.log(users);
      const firstUser: User = users[0];

      try {
        const weatherResponse = await this.weatherProvider.getWeather(
          firstUser.latitude,
          firstUser.longitude,
          firstUser.timezone,
        );

        if (!weatherResponse.data) {
          continue;
        }

        console.log(weatherResponse.data);

        for (const user of users) {
          await this.courierApiService.sendWeatherNotification(
            user,
            weatherResponse.data,
          );
        }
      } catch (e) {
        this.logger.error(e);
      }
    }

    this.logger.debug(
      'Done sending notifications. Count of users: ' + users.length,
    );
  }
}
