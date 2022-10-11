import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

export type Weather = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    temperature_2m_max: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

@Injectable()
export class WeatherProviderService {
  @Inject()
  private readonly httpService: HttpService;

  getWeather(
    latitude: number,
    longitude: number,
    timezone: string,
  ): Promise<AxiosResponse<Weather>> {
    return this.httpService.axiosRef.get<Weather>(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude,
          longitude,
          timezone,
          daily: 'temperature_2m_max,temperature_2m_min',
        },
      },
    );
  }
}
