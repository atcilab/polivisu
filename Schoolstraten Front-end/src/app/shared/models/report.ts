export interface IReport {
  segment_id: string;
  date: string;
  pct_up: number;
  timezone: string;
  pedestrian: number;
  bike: number;
  car: number;
  lorry: number;
  pedestrian_lft: number;
  bike_lft: number;
  car_lft: number;
  lorry_lft: number;
  pedestrian_rgt: number;
  bike_rgt: number;
  car_rgt: number;
  lorry_rgt: number;
  car_speed_histogram: number[];
  car_speed_bucket: number[];
}
