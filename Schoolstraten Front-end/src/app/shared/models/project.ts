import { IDay } from "./day";
import { IRoadSegment } from "./roadSegment";

export interface IProject {
  neighbouringStreetCameras: IRoadSegment[];
  isActive: boolean;
  isActiveSince: Date;
  _id?: string;
  title: string;
  address: string;
  website: string;
  schoolStreetCamera: IRoadSegment;
  numberOfBikes: number;
  activeHoursPerDay: IDay[];
  roadNames?: IRoadSegment[];
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image: string;
}
