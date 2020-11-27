export interface IWeather {
  _id: string;
  message: string;
  cnt: number;
  list: IWeatherItem[];
  city: IWeatherCity;
  createdAt: string;
  updatedAt: string;
}

export interface IWeatherItem {
  weather: {
    _id: string;
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  _id: string;
  dt: number;
  main: {
    _id: string;
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  clouds: { _id: string; all: number };
  wind: { _id: string; speed: number; deg: number };
  rain: { _id: string; "3h": number };
  sys: { _id: string; pod: string };
  dt_txt: string;
}

interface IWeatherCity {
  _id: string;
  id: number;
  name: string;
  coord: {
    _id: string;
    lat: number;
    lon: number;
  };
  country: string;
  timezone: number;
  sunrise: number;
  sunset: number;
}
