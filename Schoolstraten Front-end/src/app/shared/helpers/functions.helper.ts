import { Feature } from "geojson";
import { Layer } from "leaflet";
import { MomentPipe } from "../pipes/moment.pipe";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TimepickerConfig } from "ngx-bootstrap/timepicker";
import { IDay, IReport, IWeather, IWeatherItem } from "../models";
// import * as moment from "moment";
import * as _ from "lodash";
import * as nearest from "nearest-date";
import { v4 as uuid } from "uuid";
import * as moment from "moment-timezone";
import { AbstractControl } from "@angular/forms";

export function getColor(value: number) {
  return value > 1050
    ? "#DE0D0D"
    : value > 900
    ? "#DE0D0D"
    : value > 750
    ? "#F03D14"
    : value > 600
    ? "#EF6C2E"
    : value > 450
    ? "#EDCC59"
    : value > 300
    ? "#bdb75e"
    : value > 150
    ? "#8faf64"
    : "#019875";
}

export function featureStyle(feature: Feature) {
  const ped = parseInt(feature.properties.pedestrian_avg) || 0;
  const bike = parseInt(feature.properties.bike_avg) || 0;
  const car = parseInt(feature.properties.car_avg) || 0;
  const lorry = parseInt(feature.properties.lorry_avg) || 0;
  const total = ped + bike + car + lorry;

  return {
    weight: 4.5,
    opacity: 0.45,
    color: getColor(total),
  };
}

export function onEachFeature(feature: Feature, layer: Layer) {
  layer
    .on("mouseover", function () {
      this.setStyle({ opacity: 1 });
    })
    .on("mouseout", function () {
      this.setStyle({ opacity: 0.45 });
    });
}

export function popUp(
  feature: Feature,
  translates: string[],
  internal: boolean = false,
  pid?: string
): string {
  const moment = new MomentPipe();
  const ped = feature.properties.pedestrian_avg
    ? parseInt(feature.properties.pedestrian_avg)
    : parseInt(feature.properties.pedestrian);
  const bike = feature.properties.bike_avg
    ? parseInt(feature.properties.bike_avg)
    : parseInt(feature.properties.bike);
  const car = feature.properties.car_avg
    ? parseInt(feature.properties.car_avg)
    : parseInt(feature.properties.car);
  const lorry = feature.properties.lorry_avg
    ? parseInt(feature.properties.lorry_avg)
    : parseInt(feature.properties.lorry);
  const lastPackage = feature.properties.last_data_package;
  const date = moment.transform(lastPackage);
  const id = feature.properties.id || feature.properties.oidn;
  const lang = getCookie("lang") ? getCookie("lang").split("-")[0] : "nl";
  const minDate = getCookie("start1") || "2020-03-01";
  const maxDate = getCookie("end1") || "2020-03-13";
  let dashboard;
  if (internal) {
    dashboard = `#/projects/${pid}/${minDate}/${maxDate}`;
  } else {
    dashboard = `https://telraam.net/${lang}/location/${id}/${minDate}/${maxDate}`;
  }

  return `
    <table class="table table-borderless">
        <tr>
            <td class="p-0 pb-2" colspan="2">${translates[0]}</td>
        </tr>
        <tr>
            <td class="font-weight-bold p-0">${translates[3]}</td>
            <td class="p-0">${ped}</td>
        </tr>
        <tr>
            <td class="font-weight-bold p-0">${translates[4]}</td>
            <td class="p-0">${bike}</td>
        </tr>
        <tr>
            <td class="font-weight-bold p-0">${translates[5]}</td>
            <td class="p-0">${car}</td>
        </tr>
        <tr>
            <td class="font-weight-bold p-0">${translates[6]}</td>
            <td class="p-0">${lorry}</td>
        </tr>
        <tr>
            <td class="p-0 pt-2 small" colspan="2"><span>${
              translates[1]
            }</span> <span class="font-weight-bold">${date}</span></td>
        </tr>
        <tr>
          <td class="p-0 small" colspan="2">${
            internal ? "Open dashboard" : translates[2]
          } <span class="font-weight-bold">${
    internal ? "" : id
  }</span> <a rel="noopener" href="${dashboard}" target="${
    internal ? "_self" : "_blank"
  }"><span class="fa fa-link"></span></a></td>
        </tr>
    </table>
  `;
}

export function getCookie(name: string) {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

export async function getAddressName(
  http: HttpClient,
  lang: string = "nl-BE",
  lat: number,
  lon: number
) {
  const params = new HttpParams({
    fromObject: {
      lat: lat.toString(),
      lon: lon.toString(),
      format: "json",
      "accept-language": lang,
    },
  });

  return await http
    .get<any>("https://nominatim.openstreetmap.org/reverse", { params })
    // .pipe(map((response: any) => response.display_name))
    .toPromise();
}

export function getTimepickerConfig(): TimepickerConfig {
  return Object.assign(new TimepickerConfig(), {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: false,
    readonlyInput: false,
    mousewheel: true,
    showMinutes: true,
    showSeconds: false,
    showSpinners: false,
    labelHours: "Hours",
    labelMinutes: "Minutes",
    labelSeconds: "Seconds",
  });
}

export function detectLanguage(lang?: string): string {
  if (!lang) return "nlbe";
  lang = lang.split("-")[0];
  switch (lang) {
    case "en":
      return "engb";
    case "nl":
      return "nlbe";
    case "fr":
      return "fr";
    default:
      return "engb";
  }
}

export function isActiveHour(array: IReport[], days: IDay[]) {
  return array.filter((value, index, values) => {
    let reportHour = value.date.split("T")[1].split(":")[0];
    let reportWeekday = moment(value.date).tz(value.timezone).day();
    // console.log(moment(value.date).tz("Europe/Brussels").format());
    let day = days.find((d) => d.weekday === reportWeekday);
    if (!day) return;
    let activeHours = day.periods
      .map((p) => [p.start.split(":")[0], p.end.split(":")[0]])
      .reduce((a, b) => [...new Set([...a, ...b])], []);
    return activeHours.includes(reportHour);
  });
}

// export function getWeatherItems(weather: IWeather[], target: Date) {
//   let items = _(weather).map("list").flatten().value();

//   let dates = items.map((i) => new Date(i.dt_txt));
//   const index = nearest(dates, target);
//   const winner = moment(new Date(dates[index])).format("YYYY-MM-DD HH:mm:ss");
//   return items.find((i) => i.dt_txt === winner);
// }

export function getWeatherItems(weather: IWeather[], target: number) {
  let dts = _(weather).map("list").flatten().map("dt").value();
  let items = _(weather).map("list").flatten().value();
  const winner = dts.sort(
    (a, b) => Math.abs(target - a) - Math.abs(target - b)
  )[0];
  return items.find((item) => item.dt === winner);
}

export function getWeatherIcon(item: IWeatherItem): string {
  if (item) {
    const id = item.weather[0].id;
    if (id >= 200 && id <= 232) return "assets/images/weather/thunderstorm.svg";
    else if (id >= 300 && id <= 321)
      return "assets/images/weather/shower_rain.svg";
    else if (id >= 500 && id <= 511) return "assets/images/weather/rain.svg";
    else if (id >= 520 && id <= 531)
      return "assets/images/weather/shower_rain.svg";
    else if (id >= 600 && id <= 622) return "assets/images/weather/snow.svg";
    else if (id >= 700 && id <= 781) return "assets/images/weather/mist.svg";
    else if (id === 800) return "assets/images/weather/clear_sky.svg";
    else if (id === 801) return "assets/images/weather/few_clouds.svg";
    else if (id === 802) return "assets/images/weather/scattered_clouds.svg";
    else if (id >= 803 && id <= 804)
      return "assets/images/weather/broken_clouds.svg";
    else return "assets/images/weather/unknown_weather.png";
  } else {
    return "assets/images/weather/unknown_weather.png";
  }
}

export function toFormData<T>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    formData.append(key, value);
  }

  return formData;
}

export function fixReports(
  aReports: IReport[] | any,
  bReports: IReport[] | any
) {
  let daysDiff = Math.abs(
    Math.round(moment(aReports[0].date).diff(bReports[0].date, "d", true))
  );
  let isNextWeek = moment(aReports[0].date).isAfter(bReports[0].date, "d");

  bReports = bReports.map((r) => ({
    ...r,
    date: isNextWeek
      ? moment(r.date).add(daysDiff, "days").toISOString()
      : moment(r.date).subtract(daysDiff, "days").toISOString(),
  }));

  let missingReports: IReport[] = [];
  if (aReports.length > bReports.length) {
    for (let i = 0; i < aReports.length; i++) {
      const r1 = aReports[i];
      if (!bReports.some((r2) => r2.date === r1.date)) missingReports.push(r1);
    }

    for (let i = 0; i < missingReports.length; i++) {
      const report = missingReports[i];
      bReports.push({
        ...report,
        bike: NaN,
        pedestrian: NaN,
        lorry: NaN,
        car: NaN,
      });
    }

    let dateTimes: string[] = aReports.map((r) => r.date);
    aReports = aReports.filter((r) => dateTimes.some((d) => d === r.date));
    bReports = bReports.filter((r) => dateTimes.some((d) => d === r.date));
    return {
      aReports: aReports.sort((a, b) => (a.date > b.date ? 1 : -1)),
      bReports: bReports.sort((a, b) => (a.date > b.date ? 1 : -1)),
    };
  } else {
    for (let i = 0; i < bReports.length; i++) {
      const r1 = bReports[i];
      if (!aReports.some((r2) => r2.date === r1.date)) missingReports.push(r1);
    }

    for (let i = 0; i < missingReports.length; i++) {
      const report = missingReports[i];
      aReports.push({
        ...report,
        bike: NaN,
        pedestrian: NaN,
        lorry: NaN,
        car: NaN,
      });
    }

    let dateTimes: string[] = bReports.map((r) => r.date);
    aReports = aReports.filter((r) => dateTimes.some((d) => d === r.date));
    bReports = bReports.filter((r) => dateTimes.some((d) => d === r.date));
    return {
      aReports: aReports.sort((a, b) => (a.date > b.date ? 1 : -1)),
      bReports: bReports.sort((a, b) => (a.date > b.date ? 1 : -1)),
    };
  }
}

export function toCSV(data: IReport[]) {
  const replacer = (key, value) =>
    value === null ? "" : value instanceof Array ? value.toString() : value;
  const header = Object.keys(data[0]);
  let csv: any = data.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  csv.unshift(header.join(","));
  csv = csv.join("\r\n");

  let csvBlob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  let downloadLinkElement = document.createElement("a");
  let url = URL.createObjectURL(csvBlob);
  let isSafariBrowser =
    navigator.userAgent.indexOf("Safari") != -1 &&
    navigator.userAgent.indexOf("Chrome") == -1;
  if (isSafariBrowser) {
    //if Safari open in new window to save file with random filename.
    downloadLinkElement.setAttribute("target", "_blank");
  }
  downloadLinkElement.setAttribute("href", url);
  downloadLinkElement.setAttribute("download", uuid() + ".csv");
  downloadLinkElement.style.visibility = "hidden";
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
}

export function checkReports(
  aReports: IReportShort[],
  bReports: IReportShort[]
) {
  const diff = parseInt(getCookie("totalDaysDiff"));
  const isNextWeek = moment(aReports[0].date)
    .tz("Europe/Brussels")
    .isAfter(moment(bReports[0].date).tz("Europe/Brussels"));

  aReports = aReports.map((r) => ({ ...r, date: moment(r.date).toJSON() }));
  bReports = bReports.map((r) => ({
    ...r,
    date: isNextWeek
      ? moment(r.date).add(diff, "days").toJSON()
      : moment(r.date).subtract(diff, "days").toJSON(),
  }));

  if (aReports.length > bReports.length) {
    const missingReports = _.differenceBy(aReports, bReports, "date");
    missingReports.forEach((r) =>
      bReports.push({
        pedestrian: NaN,
        bike: NaN,
        car: NaN,
        lorry: NaN,
        date: r.date,
      })
    );
    bReports = bReports.sort((a, b) => (a.date > b.date ? 1 : -1));
  }
  // else if (aReports.length < bReports.length) {
  //   const missingReports = _.differenceBy(bReports, aReports, "date");
  //   missingReports.forEach((r) =>
  //     aReports.push({
  //       pedestrian: NaN,
  //       bike: NaN,
  //       car: NaN,
  //       lorry: NaN,
  //       date: r.date,
  //     })
  //   );
  //   aReports = aReports.sort((a, b) => (a.date > b.date ? 1 : -1));
  // }

  return { aReports, bReports };
}

interface IReportShort {
  pedestrian: number;
  bike: number;
  car: number;
  lorry: number;
  date: string;
}

export function ValidateJSONType(
  control: AbstractControl
): { [key: string]: any } | null {
  const file: File = control.value;

  return !file
    ? null
    : file.type !== "application/json"
    ? { invalidType: "Invalid file type. Only JSON files" }
    : null;
}
