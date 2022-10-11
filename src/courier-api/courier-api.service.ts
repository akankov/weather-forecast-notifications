import { Injectable } from '@nestjs/common';
import { CourierClient, ICourierClient } from '@trycourier/courier';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Weather } from '../weather-provider/weather-provider.service';

@Injectable()
export class CourierApiService {
  private courier: ICourierClient;

  constructor(configService: ConfigService) {
    this.courier = CourierClient({
      authorizationToken: configService.get('COURIER_AUTH_TOKEN'),
    });
  }

  async sendWeatherNotification(
    user: User,
    weather: Weather,
  ): Promise<unknown> {
    return this.courier.send({
      message: {
        to: {
          email: user.email,
          phone_number: user.phoneNumber,
        },
        content: {
          title: 'weather forecast',
          body: this.generateMessageBody(weather),
        },
        routing: {
          method: 'all',
          channels: ['email', 'sms'],
        },
      },
    });
  }

  private generateMessageBody(weather: Weather): string {
    const messageParts = ['Weather forecast \n'];

    const dailyWeather = weather.daily;
    const tempUnit = weather.daily_units.temperature_2m_max;

    for (let i = 0; i < dailyWeather.time.length; i++) {
      const forecast =
        `${dailyWeather.time[i]}. ` +
        `max temp: ${dailyWeather.temperature_2m_max[i]}${tempUnit}, ` +
        `min temp: ${dailyWeather.temperature_2m_min[i]}${tempUnit} \n`;

      messageParts.push(forecast);
    }

    return messageParts.join('');
  }
}
