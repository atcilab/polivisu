import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import {
  Map,
  MapOptions,
  FeatureGroup,
  TileLayer,
  geoJSON,
  LatLng,
  easyButton,
  LayerGroup,
  marker,
  Icon,
} from "leaflet";
import { featureStyle, onEachFeature, popUp } from "src/app/shared/helpers";
import { Feature } from "geojson";
import { ApiService } from "src/app/shared/services/api.service";
import { TranslateService } from "@ngx-translate/core";
import "leaflet-gesture-handling";
import "leaflet-easybutton";
import { Subscription } from "rxjs";
import { IProject } from "src/app/shared/models";
import { WatcherService } from "../../../create/services/watcher.service";

@Component({
  selector: "project-camera-map",
  templateUrl: "./project-camera-map.component.html",
  styleUrls: ["./project-camera-map.component.scss"],
})
export class ProjectCameraMapComponent implements OnInit, OnDestroy {
  private _project: IProject;
  get project(): IProject {
    return this._project;
  }
  @Input() set project(val: IProject) {
    this._project = val;
    const segmentIDs: number[] = [
      val.schoolStreetCamera.id,
      ...val.neighbouringStreetCameras.map((x) => x.id),
    ];
    this.getSegments(segmentIDs, val.schoolStreetCamera.id);
  }
  subscription: Subscription;
  map: Map;
  mapOption: MapOptions;
  activeSegments: FeatureGroup = new FeatureGroup();
  markers: LayerGroup = new LayerGroup();
  baseLayer: TileLayer = new TileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a rel="noopener" href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  );

  constructor(
    private _api: ApiService,
    private _translate: TranslateService,
    private _watcher: WatcherService
  ) {
    this._translate.onLangChange.subscribe((language) => {
      const segmentIDs: number[] = [
        this.project.schoolStreetCamera.id,
        ...this.project.neighbouringStreetCameras.map((x) => x.id),
      ];
      this.getSegments(segmentIDs, this.project.schoolStreetCamera.id);
    });
  }

  ngOnInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initMap() {
    this.mapOption = {
      center: new LatLng(51.0271637, 4.4765423, 15),
      zoom: 14,
      layers: [this.baseLayer, this.activeSegments, this.markers],
      gestureHandling: true,
    } as any;
    this.map = new Map("project-camera-map", this.mapOption);

    const self = this;
    easyButton("fa-expand", function (btn, map) {
      map.fitBounds(self.activeSegments.getBounds());
    }).addTo(this.map);
  }

  private getSegments(values: number[], target: number) {
    this.activeSegments.clearLayers();
    this.subscription = this._api.getActiveSegments().subscribe((response) => {
      response.features.forEach((f) => {
        if (values.includes(f.properties.id)) {
          if (this._watcher.target) {
            const { id } = this._watcher.target;
            if (f.properties.id === id) {
              const center = geoJSON(f).getBounds().getCenter();
              const target = marker(center, {
                icon: new Icon({
                  iconUrl: "assets/images/marker.png",
                  iconSize: [62, 27], // size of the icon
                  iconAnchor: [5, 20], // point of the icon which will correspond to marker's location
                  popupAnchor: [0, -15], // point from which the popup should
                }),
              }).addTo(this.markers);
            }
          }
          geoJSON(f, {
            style: featureStyle,
            onEachFeature: onEachFeature,
          })
            .bindPopup(popUp(f, this.getTranslatedValues(f)))
            .addTo(this.activeSegments);
          this.map.fitBounds(this.activeSegments.getBounds());
        }
      });
    });
  }

  private getTranslatedValues(f: Feature) {
    const total =
      parseInt(f.properties.pedestrian_avg || 0) +
      parseInt(f.properties.bike_avg || 0) +
      parseInt(f.properties.car_avg || 0) +
      parseInt(f.properties.lorry_avg || 0);
    return [
      this._translate.instant("leafletPopup.totalObject", { total: total }),
      this._translate.instant("leafletPopup.lastPackage"),
      this._translate.instant("leafletPopup.cameraID", { id: f.properties.id }),
      this._translate.instant("leafletPopup.pedestrian"),
      this._translate.instant("leafletPopup.bike"),
      this._translate.instant("leafletPopup.car"),
      this._translate.instant("leafletPopup.lorry"),
    ];
  }
}
