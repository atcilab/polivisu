import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  Map,
  MapOptions,
  FeatureGroup,
  TileLayer,
  LatLng,
  geoJSON,
  LeafletMouseEvent,
  latLng,
  LayerGroup,
  marker,
  Icon,
} from "leaflet";
import { ApiService } from "src/app/shared/services/api.service";
import { TranslateService } from "@ngx-translate/core";
import { getAddressName } from "src/app/shared/helpers";
import { GestureHandling } from "leaflet-gesture-handling";
import { HttpClient } from "@angular/common/http";
import { IRoadSegment } from "src/app/shared/models";
import { CreateProjectValidator } from "src/app/shared/validations/createProject.validation";
import Swal from "sweetalert2";
import { WatcherService } from "../../services/watcher.service";
import { take, auditTime } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "active-segments",
  templateUrl: "./active-segments.component.html",
  styleUrls: ["./active-segments.component.scss"],
})
export class ActiveSegmentsComponent implements OnInit, OnDestroy {
  @Input() set onRemove(val: IRoadSegment) {
    if (val) this.getSegments();
  }
  private _address: string;
  @Input() set address(val: string) {
    if (!val) return;
    this._address = val;

    this.api.focusOnAddress(val).subscribe((res) => {
      let address = res[0];
      if (this.map)
        this.map.setView(
          latLng(parseFloat(address.lat), parseFloat(address.lon)),
          12
        );
    });
  }
  get address(): string {
    return this._address;
  }
  isLoading: boolean = false;
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
  lastSelectedRoad: string;
  subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private http: HttpClient,
    public validator: CreateProjectValidator,
    private _watcher: WatcherService
  ) {
    Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    this.translate.onLangChange.subscribe((language) => {
      this.getSegments();
    });
  }

  ngOnInit() {
    this.initMap();
    this.getSegments();

    const watcher$ = this._watcher.target$
      .pipe(auditTime(1e3))
      .subscribe((val) => {
        if (this.map && val) {
          this.markers.clearLayers();
          this.activeSegments.eachLayer((layer) => {
            const { _layers } = layer as any;
            const property = Object.keys(_layers)[0];
            const { feature, _leaflet_id } = _layers[property];
            const { id } = feature.properties;
            if (id === val.id) {
              const center = geoJSON(feature).getBounds().getCenter();
              let target = marker(center, {
                icon: new Icon({
                  iconUrl: "assets/images/marker.png",
                  iconSize: [62, 27], // size of the icon
                  iconAnchor: [5, 20], // point of the icon which will correspond to marker's location
                  popupAnchor: [0, -15], // point from which the popup should
                }),
              }).addTo(this.markers);
            }
          });
        } else {
          this.markers.clearLayers();
        }
      });
    this.subscriptions.push(watcher$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private initMap() {
    this.mapOption = {
      center: new LatLng(51.0271637, 4.4765423, 15),
      zoom: 14,
      layers: [this.baseLayer, this.activeSegments, this.markers],
      gestureHandling: true,
    } as any;
    this.map = new Map("active-segments", this.mapOption);
  }

  private getSegments() {
    this.isLoading = true;
    const self = this;
    this.activeSegments.clearLayers();
    this.api.getActiveSegments().subscribe((response) => {
      this.isLoading = false;
      response.features.forEach((f) => {
        geoJSON(f, {
          style: {
            color: self.validator.roadNames.some(
              (s) => s.id === f.properties.id
            )
              ? "#004e6a"
              : "#019875",
            opacity: 0.75,
            weight: 5,
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", async function (event: LeafletMouseEvent) {
              this.setStyle({ color: "#004e6a" });
              const { address } = await getAddressName(
                self.http,
                self.translate.currentLang,
                event.latlng.lat,
                event.latlng.lng
              );

              const roadSegment: IRoadSegment = {
                id: feature.properties.id,
                address: address.town
                  ? `${address.road || address.pedestrian}, ${address.town}`
                  : `${address.road || address.pedestrian}, ${address.city}`,
              };

              // Check if road segment exists in the list of roads
              if (
                self.validator.roadNames.find((r) => r.id === roadSegment.id)
              ) {
                Swal.fire({
                  toast: true,
                  timer: 2500,
                  showConfirmButton: false,
                  position: "top-right",
                  icon: "info",
                  title: "Road exists",
                });
              } else {
                self.validator.roadName = roadSegment;
                self.lastSelectedRoad = roadSegment.address;
              }
            });
          },
        }).addTo(this.activeSegments);
      });
    });
  }
}
