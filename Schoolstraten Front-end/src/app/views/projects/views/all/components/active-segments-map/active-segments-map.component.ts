import { Component, OnInit, Input } from "@angular/core";
import {
  Map,
  TileLayer,
  MapOptions,
  LatLng,
  FeatureGroup,
  geoJSON,
  marker,
  Icon,
  LeafletEvent,
  LeafletMouseEvent,
} from "leaflet";
import { ApiService } from "src/app/shared/services/api.service";
import { onEachFeature, popUp, featureStyle } from "src/app/shared/helpers";
import { TranslateService } from "@ngx-translate/core";
import { Feature } from "geojson";
import "leaflet-gesture-handling";
import { IProject } from "src/app/shared/models";

@Component({
  selector: "active-segments-map",
  templateUrl: "./active-segments-map.component.html",
  styleUrls: ["./active-segments-map.component.scss"],
})
export class ActiveSegmentsMapComponent implements OnInit {
  private _projects: IProject[];
  get projects(): IProject[] {
    return this._projects;
  }
  @Input() set projects(val: IProject[]) {
    this._projects = val;
    const schoolProjects = val.map((p) => p.schoolStreetCamera.id);
    if (this.map) {
      this.showProjects(schoolProjects);
    }
  }
  map: Map;
  mapOption: MapOptions;
  activeSegments: FeatureGroup = new FeatureGroup();
  baseLayer: TileLayer = new TileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a rel="noopener" href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  );

  constructor(private api: ApiService, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((language) => {
      this.getSegments();
    });
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    this.mapOption = {
      center: new LatLng(51.0271637, 4.4765423, 15),
      zoom: 14,
      layers: [this.baseLayer, this.activeSegments],
      gestureHandling: true,
    } as any;
    this.map = new Map("active-segements-map", this.mapOption);
  }

  private getSegments() {
    this.activeSegments.clearLayers();
    this.api.getActiveSegments().subscribe((response) => {
      response.features.forEach((f) => {
        geoJSON(f, {
          style: featureStyle,
          onEachFeature: onEachFeature,
        })
          .bindPopup(popUp(f, this.getTranslatedValues(f)))
          .addTo(this.activeSegments);
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
      this.translate.instant("leafletPopup.totalObject", { total: total }),
      this.translate.instant("leafletPopup.lastPackage"),
      this.translate.instant("leafletPopup.cameraID", { id: f.properties.id }),
      this.translate.instant("leafletPopup.pedestrian"),
      this.translate.instant("leafletPopup.bike"),
      this.translate.instant("leafletPopup.car"),
      this.translate.instant("leafletPopup.lorry"),
    ];
  }

  showProjects(val: number[]) {
    this.activeSegments.clearLayers();
    Promise.all(val.map((p) => this.api.getSegment(p).toPromise()))
      .then((responses) => {
        responses.forEach((f) => {
          f.features.forEach((feature) => {
            const project = this.projects.find(
              (p) => p.schoolStreetCamera.id === feature.properties.oidn
            );

            let featureCenter = geoJSON(feature).getBounds().getCenter();
            marker(featureCenter, {
              icon: new Icon({
                iconUrl: "assets/images/marker.png",
                iconSize: [62, 27], // size of the icon
                iconAnchor: [5, 20], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -15], // point from which the popup should
              }),
            })
              .bindPopup(
                popUp(
                  feature,
                  this.getTranslatedValues(feature),
                  true,
                  project._id
                )
              )
              .addTo(this.activeSegments);
          });
        });
        this.map.fitBounds(this.activeSegments.getBounds(), {
          padding: [5, 5],
        });
      })
      .catch((error) => console.log(error));
  }
}
