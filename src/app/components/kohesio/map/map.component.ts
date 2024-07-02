import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, of, Subject } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FiltersApi } from '../../../models/filters-api.model';
import { Filters } from '../../../models/filters.model';
import { FiltersComponent } from '../../../pages/projects2/dialogs/filters/filters/filters.component';
import { FilterService } from '../../../services/filter.service';
import { MapService } from '../../../services/map.service';
import { TranslateService } from '../../../services/translate.service';
import { MapMessageBoxComponent } from './map-message-box';
import { MapPopupComponent } from './map-popup.component';

declare let L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements AfterViewInit {
  filtersApi: FiltersApi;
  filtersCount = 0;
  @ViewChild('projectNear') projectNear!: ElementRef;
  projectNearButtonWidth: number = 0;
  public filters: Filters = new Filters();
  public europeBounds = L.latLngBounds(L.latLng(69.77369797436554, 48.46330029192563), L.latLng(34.863924198120645, -8.13826220807438));
  public europeBoundsMobile = L.latLngBounds(L.latLng(59.77369797436554, 34.46330029192563), L.latLng(24.863924198120645, -12.13826220807438));
  public europe = {
    label: $localize`:@@comp.map.europe:Europe`,
    region: undefined,
    bounds: this.europeBounds
  };
  public mapRegions: any = [];
  public isLoading = true;
  public dataRetrieved = false;
  public outermostRegions = [];
  // Format L.latLngBounds = southWest, northEast
  public overrideBounds = [ {
    id: 'Q20',
    bounds: L.latLngBounds(L.latLng(41.3403079293, -4.8450636176), L.latLng(51.2587688404, 9.7020364496))
  }, {
    id: 'Q7',
    bounds: L.latLngBounds(L.latLng(36.037266989, -9.2600844574), L.latLng(43.8462272853, 3.3209832112))
  }, {
    id: 'Q18',
    bounds: L.latLngBounds(L.latLng(36.8702042109, -9.5360565336), L.latLng(42.2278301749, -6.137649751))
  } ];
  @Input() showFilters = false;
  filterResult$$ = this.filterService.showResult.pipe(filter(_ => this.showFilters), takeUntilDestroyed());
  // projectNearButtonWidth = 229;
  @Input()
  public mapId = 'map';
  @Input()
  public openProjectInner: boolean = true;
  @Input()
  public isEmbeddedMap: boolean = false;
  @Input()
  public hideNavigation = false;
  @Input()
  public hideProjectsNearBy = false;
  public nearByView = false;
  @Input()
  public hideOuterMostRegions = false;
  @Input()
  public heatScale = false;
  public hideScale = false;
  public heatMapScale: any;
  public colorsHeatMap = [ '#fbe19e', '#fbc680', '#faac75', '#fe8067', '#ec5c5d', '#d14a64', '#a04a9d' ];
  public collapsedBreadCrumb = false;
  public mobileQuery: boolean;
  @ViewChild(MapMessageBoxComponent) public uiMessageBoxHelper!: MapMessageBoxComponent;
  public toggleDisclaimer: boolean = false;
  public hasQueryParams: boolean = false;
  public onlyOnceParamsApply: boolean = true;
  public queryParamMapRegionName = 'mapRegion';
  public queryParamParentLocation = 'parentLocation';
  private map: any;
  private markersGroup: any;
  //private labelsRegionsGroup;
  private layers: any[] = [];
  private destroyed = new Subject<void>();
  private lastFiltersSearch: any;

  constructor(private mapService: MapService,
              private filterService: FilterService,
              private _decimalPipe: DecimalPipe,
              private resolver: ComponentFactoryResolver,
              private datePipe: DatePipe,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private injector: Injector,
              private sanitizer: DomSanitizer,
              breakpointObserver: BreakpointObserver,
              @Inject(LOCALE_ID) public locale: string,
              private _route: ActivatedRoute,
              private _router: Router,
              private translateService: TranslateService) {
    this.filtersApi = this.route.snapshot.data['data'];
    this.mobileQuery = breakpointObserver.isMatched('(max-width: 768px)');

    breakpointObserver
      .observe([
        '(max-width: 768px)'
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          this.mobileQuery = result.breakpoints[query];
        }
      });

    if (this.mobileQuery) {
      this.europe.bounds = this.europeBoundsMobile;
    }

    this.mapService.getOutermostRegions().subscribe(data => {
      this.outermostRegions = data;
    });

    if (!this.isEmbeddedMap) {
      this.queryParamMapRegionName = this.translateService.queryParams.mapRegion;
    }

    //this.createLogScale();
  }

  //Starting the algorithm to create the log scale, dynamically
  createLogScale(data: any) {

    const values: number[] = [];
    data.subregions.forEach((subregion: any) => {
      values.push(subregion.count);
    });

    const scaleNumber = values.length >= 7 ? 7 : values.length;
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);
    const calMax = max - (max / 100 * 20);

    const logmin = Math.log(min ? min : 1);
    const logmax = Math.log(calMax);

    const logrange = logmax - logmin;
    const logstep = logrange / (scaleNumber - 1);

    const scales: any = [];
    for (let i = 1; i < scaleNumber; ++i) {
      const scale: number = Math.ceil(Math.exp(logmin + i * logstep));
      scales.push({
        from: scales.length ? scales[i - 2].to : 1,
        to: this.roundToNearest(scale),
        color: this.colorsHeatMap[i - 1]
      });
    }
    if (scales.length) {
      scales.push({
        from: scales[scales.length - 1].to,
        color: this.colorsHeatMap[scales.length]
      });
    }

    this.heatMapScale = scales;
  }

  roundToNearest(numToRound: number) {
    const numToRoundTo: number = parseInt('1' + new Array(numToRound.toString().length).join('0'));
    return Math.round(numToRound / numToRoundTo) * numToRoundTo;
  }

  generateQueryParams() {
    // let interventionFieldQueryParam: string[] = [];
    // if (this.lastFiltersSearch.interventionField && this.lastFiltersSearch.interventionField.length) {
    //   this.lastFiltersSearch.interventionField.forEach((interventionFieldValue: AutoCompleteItem) => {
    //     interventionFieldQueryParam.push(this.getFilterLabel('categoriesOfIntervention', interventionFieldValue as any));
    //   });
    // }
    return {
      [this.translateService.queryParams.keywords]: this.lastFiltersSearch.keywords ? this.lastFiltersSearch.keywords.trim() : null,
      [this.translateService.queryParams.country]: this.getFilterLabel('countries', this.lastFiltersSearch.country),
      [this.translateService.queryParams.region]: this.getFilterLabel('regions', this.lastFiltersSearch.region),
      [this.translateService.queryParams.theme]: this.getFilterLabel('thematic_objectives', this.lastFiltersSearch.theme),
      [this.translateService.queryParams.policyObjective]: this.getFilterLabel('policy_objectives', this.lastFiltersSearch.policyObjective),
      programPeriod: this.getFilterLabel('programmingPeriods', this.lastFiltersSearch.programPeriod),
      [this.translateService.queryParams.fund]: this.getFilterLabel('funds', this.lastFiltersSearch.fund),
      [this.translateService.queryParams.programme]: this.getFilterLabel('programs', this.lastFiltersSearch.program),
      // [this.translateService.queryParams.interventionField]: interventionFieldQueryParam.length ? interventionFieldQueryParam.toString() : null,
      [this.translateService.queryParams.totalProjectBudget]: this.getFilterLabel('totalProjectBudget', this.lastFiltersSearch.budgetBiggerThan + '-' + this.lastFiltersSearch.budgetSmallerThan),
      [this.translateService.queryParams.amountEUSupport]: this.getFilterLabel('amountEUSupport', this.lastFiltersSearch.budgetEUBiggerThan + '-' + this.lastFiltersSearch.budgetEUSmallerThan),
      [this.translateService.queryParams.projectStart]: this.lastFiltersSearch.startDateAfter ? this.datePipe.transform(this.lastFiltersSearch.startDateAfter, 'dd-MM-yyyy') : null,
      [this.translateService.queryParams.projectEnd]: this.lastFiltersSearch.endDateBefore ? this.datePipe.transform(this.lastFiltersSearch.endDateBefore, 'dd-MM-yyyy') : null,
      [this.translateService.queryParams.sdg]: this.getFilterLabel('sdg', this.lastFiltersSearch.sdg),
      [this.translateService.queryParams.interreg]: this.getFilterLabel('interreg', this.lastFiltersSearch.interreg),
      [this.translateService.queryParams.nuts3]: this.getFilterLabel('nuts3', this.lastFiltersSearch.nuts3 || ''),
      [this.translateService.queryParams.sort]: this.getFilterLabel('sort', this.lastFiltersSearch.sort),
      [this.translateService.queryParams.priorityAxis]: this.getFilterLabel('priority_axis', this.lastFiltersSearch.priority_axis),
      [this.translateService.queryParams.projectCollection]: this.getFilterLabel('project_types', this.lastFiltersSearch.projectTypes),
      [this.translateService.queryParams.town]: this.lastFiltersSearch.town ? this.lastFiltersSearch.town.trim() : null
    };
  }

  translateKeys = (obj: { [key: string]: any }, translationMap: { [key: string]: string }) => {
    const reverseMap = Object.fromEntries(Object.entries(translationMap).map(([ key, value ]) => [ value, key ]));

    return Object.entries(obj).reduce((acc, [ key, value ]) => {
      const translatedKey = reverseMap[key];
      if (translatedKey) {
        acc[translatedKey] = value;
      }
      return acc;
    }, {} as { [key: string]: any });
  };

  getDate(dateStringFormat: any) {
    if (dateStringFormat) {
      const dateSplit = dateStringFormat.split('-');
      const javascriptFormat = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
      return dateStringFormat ? new Date(javascriptFormat) : undefined;
    }
    return undefined;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.projectNearButtonWidth = this.projectNear.nativeElement.offsetWidth + 10;
    });
    this.filterResult$$.subscribe((formVal) => {
      this.lastFiltersSearch = formVal;
      this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language' && (value as [])?.length).length;
      this.loadMapRegion(this.lastFiltersSearch, undefined, true);
      this._router.navigate([], { relativeTo: this.route, queryParams: this.generateQueryParams() });
      // this.map.refreshView();
      // this.map.isLoading = true;
    });

    if (this.showFilters && !this._route.snapshot.queryParamMap.has(this.queryParamMapRegionName)) {
      if (this.route.snapshot.queryParamMap.get(this.translateService.queryParams.country)) {
        const queryParams: any = this.route.snapshot.queryParamMap;
        const cntr = this.filtersApi.countries?.find(x => x.value == queryParams.params[this.translateService.queryParams.country]).id;

        of(queryParams).pipe(
          concatMap(() => this.filterService.getRegions(cntr)),
          concatMap(() => this.filterService.getFilter('programs', { country: environment.entityURL + cntr })),
          concatMap(() => this.filterService.getFilter('nuts3', { country: environment.entityURL + cntr })),
          concatMap(() => this.filterService.getFilter('priority_axis', { country: environment.entityURL + cntr })),
          takeUntil(this.destroyed))
          .subscribe(_ => {
            const params: any = {};
            Object.keys(queryParams.params).forEach((key: any) => {
              if (this.translateService.paramMapping[key]) {
                if (key === this.translateService.queryParams.keywords || key === this.translateService.queryParams.town) {
                  params[key] = this.route.snapshot.queryParamMap.get(this.translateService.queryParams[key]);
                } else if (key === this.translateService.queryParams.nuts3) {
                  params[key] = this.getFilterKey(this.translateService.paramMapping[key], this.translateService.queryParams[key]).id;
                } else if (key === this.translateService.queryParams.projectStart || key === this.translateService.queryParams.projectEnd) {
                  params[key] = [ this.getDate(this.route.snapshot.queryParamMap.get(this.translateService.queryParams[this.translateService.paramMapping[key]])) ];
                } else {
                  params[key] = this.getFilterKey(this.translateService.paramMapping[key], key);
                }
              }
            });
            const translatedParams = this.translateKeys(params, this.translateService.queryParams);
            this.lastFiltersSearch = new Filters().deserialize(translatedParams);
            this.filtersCount = Object.entries(this.lastFiltersSearch).filter(([ key, value ]) => value !== undefined && key != 'language').length;
            this.loadMapRegion(this.lastFiltersSearch);
          });
      } else {
        // this.loadMapRegion(this.lastFiltersSearch);
      }
    }
    this.map = L.map(this.mapId,
      {
        preferCanvas: true,
        //dragging: !L.Browser.mobile,
        //tap: !L.Browser.mobile
        gestureHandling: true
      }).setView([ 48, 4 ], 4);
    const tiles = L.tileLayer('https://gisco-services.ec.europa.eu/maps/tiles/OSMCartoV4Composite' + this.locale.toUpperCase() + '/EPSG3857/{z}/{x}/{y}.png');


    // Normal Open Street Map Tile Layer
    /*const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });*/
    tiles.addTo(this.map);

    // Layer with countries name
    /*const tilesName = L.tileLayer('https://europa.eu/webtools/maps/tiles/countrynames_europe/{z}/{x}/{y}');
    tilesName.addTo(this.map);*/


    L.Icon.Default.prototype.options = {
      iconUrl: 'assets/images/map/marker-icon-2x.png',
      shadowUrl: 'assets/images/map/marker-shadow.png'
    };
  }

  public addMarker(latitude: any, longitude: any, centralize = true, zoomWhenCentralize = 15, popupContent: string = '') {
    const coords = [ latitude, longitude ];
    if (this.map) {
      if (!this.markersGroup) {
        this.markersGroup = new L.FeatureGroup();
        this.map.addLayer(this.markersGroup);
      }
      const marker = L.marker(coords,
        {
          icon: L.icon({
            iconUrl: 'assets/images/map/marker-icon-2x.png',
            shadowUrl: 'assets/images/map/marker-shadow.png',
            iconSize: [ 25, 41 ],
            iconAnchor: [ 12, 41 ],
            popupAnchor: [ 1, -34 ],
            tooltipAnchor: [ 16, -28 ],
            shadowSize: [ 41, 41 ]
          })
        }
      );

      if (popupContent) {
        marker.bindPopup(popupContent, {
          maxWidth: '600px',
          width: 'auto'
        });
      }

      this.markersGroup.addLayer(marker);

      if (centralize) {
        this.map.setView(coords, zoomWhenCentralize);
      }

      return marker;
    }
  }

  public goToProject(item: any) {
    console.log('goToProject=' + item);
  }

  public addCircleMarker(latitude: any, longitude: any, centralize = true, zoomWhenCentralize = 15, popupContent: any = undefined) {
    const coords = [ latitude, longitude ];
    if (this.map) {
      if (!this.markersGroup) {
        this.markersGroup = new L.FeatureGroup();
        this.map.addLayer(this.markersGroup);
      }

      const marker = L.circleMarker(coords, {
        color: popupContent.isHighlighted ? '#FF0000' : '#3388ff'
      });

      if (popupContent && popupContent.type != 'async') {
        marker.bindPopup(popupContent);
      } else if (popupContent && popupContent.type == 'async') {
        marker.on('click', () => {
          this.mapService.getProjectsPerCoordinate(popupContent.coordinates, popupContent.filters).subscribe(projects => {
            const component = this.resolver.resolveComponentFactory(MapPopupComponent).create(this.injector);
            component.instance.projects = projects;
            component.instance.openProjectInner = this.openProjectInner;
            marker.bindPopup(component.location.nativeElement, {
              maxWidth: 600
            }).openPopup();
            marker.getPopup().on('remove', () => {
              this.updateCoordsQueryParam(undefined);
            });
            this.updateCoordsQueryParam(popupContent.coordinates);
            const latLngs = [ marker.getLatLng() ];
            const markerBounds = L.latLngBounds(latLngs);
            this.map.fitBounds(markerBounds, {
              paddingTopLeft: [ 0, 350 ],
              maxZoom: this.map.getZoom()
            });
            if (this.mobileQuery) {
              this.collapsedBreadCrumb = true;
            }
            component.changeDetectorRef.detectChanges();
          });
        });
        marker.on('mouseout', () => {
          setTimeout(() => {
            this.map.dragging.enable();
            this.map.scrollWheelZoom.enable();
            if (this.map.tap) {
              this.map.tap.enable();
            }
          });
        });
      }

      /*this.map.on( 'popupclose', () => {
        this.updateCoordsQueryParam(undefined);
      });*/

      this.markersGroup.addLayer(marker);

      if (centralize) {
        this.map.setView(coords, zoomWhenCentralize);
      }

      return marker;
    }
  }

  public addCircleMarkerPopup(latitude: any, longitude: any, popupContent: any) {
    return this.addCircleMarker(latitude, longitude, false, 15, popupContent);
  }

  public addCountryLayer(countryLabel: string) {
    let countryGeoJson: any = undefined;
    this.filterService.getCountryGeoJson().then(data => {
      data.forEach((country: any) => {
        if (country.properties.name === countryLabel) {
          countryGeoJson = country;
        }
      });
      const countriesData = {
        'type': 'FeatureCollection',
        'features': [ countryGeoJson ]
      };
      L.geoJson(countriesData).addTo(this.map);
    });
  }

  public drawPolygons(polygons: any) {
    return L.geoJson(polygons, {
      style: this.defaultStyle
    }).addTo(this.map);
  }

  public addLayer(layerGeoJson: any, clickCallback: any, style: any) {
    const l = L.geoJson(layerGeoJson, {
      onEachFeature: clickCallback,
      style: style
    }).addTo(this.map);
    if (layerGeoJson.features[0].properties && layerGeoJson.features[0].properties.count) {
      const projectLabel = $localize`:@@comp.map.project:project`;
      const projectsLabel = $localize`:@@comp.map.projects:projects`;
      const html = '<div class=\'regionWrapper\'>' +
        '<div class=\'regionName\'>' + layerGeoJson.features[0].properties.regionLabel + '</div>' +
        '<div class=\'regionCount\'>' + this._decimalPipe.transform(layerGeoJson.features[0].properties.count, '1.0-3', 'fr') + ' ' +
        (layerGeoJson.features[0].properties.count > 1 ? projectsLabel : projectLabel) + '</div>' +
        '</div>';
      l.bindTooltip(html, { permanent: false, direction: 'center', sticky: true });
    }
    this.layers.push(l);
  }

  public cleanMap() {
    this.cleanAllLayers();
    this.removeAllMarkers();
  }

  public cleanAllLayers() {
    this.layers.forEach(layer => {
      this.map.removeLayer(layer);
    });
  }

  public refreshView() {
    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 100);
  }

  public removeAllMarkers() {
    if (this.map && this.markersGroup) {
      this.map.removeLayer(this.markersGroup);
      this.markersGroup = null;
    }
    /*if (this.map && this.labelsRegionsGroup) {
        this.map.removeLayer(this.labelsRegionsGroup);
        this.labelsRegionsGroup = null;
    }*/
  }

  public fitBounds(bounds: any) {
    if (this.map) {
      this.map.fitBounds(bounds);
    }
  }

  public onProjectsNearByClick() {
    this.cleanMap();
    this.nearByView = true;
    this.mapService.getPointsNearBy().subscribe(data => {
      data.list.slice().reverse().forEach((point: any) => {
        const coordinates = point.coordinates.split(',');
        const popupContent = {
          type: 'async',
          filters: undefined,
          coordinates: point.coordinates,
          isHighlighted: point.isHighlighted
        };
        this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
      });
      if (data.coordinates) {
        const c = data.coordinates.split(',');
        const coords = new L.LatLng(c[0], c[1], 5);
        L.circle(coords, {
          radius: 2000,
          fillColor: '#FF7800',
          color: '#FF7800'
        }).addTo(this.map);
        this.map.setView(coords, 8);
        this.restartBreadCrumbNavigation();
      }
      this.markersGroup.bringToFront();
    });
  }

  loadMapRegion(filters: Filters, granularityRegion?: string, euroLabel = false) {
    //this.isLoading = true;
    this.filters = filters;
    this.nearByView = false;
    if (this._route.snapshot.queryParamMap.has(this.queryParamMapRegionName) && this.onlyOnceParamsApply) {
      this.onlyOnceParamsApply = false;
      let regionsQueryParam = this._route.snapshot.queryParamMap.get(this.queryParamMapRegionName) + '';
      let regionsQueryParamArray = regionsQueryParam.split(',');
      granularityRegion = environment.entityURL + regionsQueryParamArray[regionsQueryParamArray.length - 1];
      this.hasQueryParams = true;
    } else {
      this.onlyOnceParamsApply = false;
    }
    if (!granularityRegion) {
      this.mapRegions = [];
      if ((filters.country || filters.region)) {
        granularityRegion = environment.entityURL +
          (filters.region ? filters.region : filters.country);
        const label = filters.region ? this.filterService.getFilterLabel('regions', filters.region) :
          this.filterService.getFilterLabel('countries', filters.country);
        this.mapRegions.push({
          label: label,
          region: granularityRegion
        });

      } else {
        this.mapRegions.push(this.europe);
      }
    }
    const index = this.mapRegions.findIndex((x: any) => x.region === granularityRegion);
    if (this.mapRegions.length && this.mapRegions[index].bounds) {
      this.fitBounds(this.mapRegions[index].bounds);
    }
    this.mapRegions = this.mapRegions.slice(0, index + 1);
    this.loadMapVisualization(filters, granularityRegion);
  }

  restartBreadCrumbNavigation() {
    this.mapRegions = [ this.europe ];
  }

  activeLoadingAfter1Second() {
    setTimeout(
      () => {
        if (!this.dataRetrieved) {
          this.isLoading = true;
        }
      }, 1000);
  }

  loadOutermostRegion(filters: Filters, outermostRegion: any) {
    const granularityRegion = environment.entityURL + outermostRegion.id;
    this.loadMapVisualization(filters, granularityRegion);
    this.mapRegions = this.mapRegions.slice(0, 1);

    if (this.mapRegions.length && !this.mapRegions[0].region) {
      this.mapRegions.push({
        label: outermostRegion.countryLabel,
        region: environment.entityURL + outermostRegion.country
      });
    }
    this.mapRegions.push({
      label: outermostRegion.label,
      region: granularityRegion
    });
  }

  loadMapVisualization(filters: Filters, granularityRegion?: string) {

    this.cleanMap();
    this.dataRetrieved = false;
    this.activeLoadingAfter1Second();

    this.mapService.getMapInfo(filters, granularityRegion).subscribe(data => {
      this.dataRetrieved = true;
      if (this._route.snapshot.queryParamMap.has(this.queryParamMapRegionName) && data.upperRegions && this.hasQueryParams) {
        this.mapRegions = [ this.europe ];
        data.upperRegions.reverse().forEach((upperRegion: any) => {
          if (upperRegion.region != environment.entityURL + 'Q1') {
            this.mapRegions.push({
              label: upperRegion.regionLabel,
              region: upperRegion.region
            });
          }
        });
        this.mapRegions.push({
          label: data.regionLabel,
          region: data.region
        });
        this.hasQueryParams = false;
        this.updateQueryParam(true);
      } else {
        this.updateQueryParam(this.onlyOnceParamsApply);
      }
      if (data.list && data.list.length) {
        //Draw markers to each coordinate
        this.uiMessageBoxHelper.close();
        this.hideScale = true;
        if (data.geoJson) {
          this.drawPolygonsForRegion(data.geoJson, null);
          this.fitToGeoJson(data.geoJson);
        }
        data.list.slice().reverse().forEach((point: any) => {
          const coordinates = point.coordinates.split(',');
          const popupContent = {
            type: 'async',
            filters: filters,
            coordinates: point.coordinates,
            isHighlighted: point.isHighlighted,
          };
          const marker = this.addCircleMarkerPopup(coordinates[1], coordinates[0], popupContent);
          this.hideOuterMostRegions = true;
          if (this._route.snapshot.queryParamMap.has('coords')) {
            const queryParamsCoords = this._route.snapshot.queryParamMap.get('coords');
            if (point.coordinates == queryParamsCoords) {
              marker.fire('click');
            }
          }
        });
      } else if (data.subregions && data.subregions.length) {
        this.hideScale = false;
        this.createLogScale(data);
        //Draw polygons of the regions
        if (data.region && data.geoJson && granularityRegion) {
          this.uiMessageBoxHelper.open();
          const regionId = granularityRegion.replace(environment.entityURL, '');
          const overrideBound: any = this.overrideBounds.find(region => {
            return region.id == regionId;
          });
          if (overrideBound) {
            this.fitBounds(overrideBound.bounds);
          } else {
            this.fitToGeoJson(data.geoJson);
          }
        }
        data.subregions.forEach((region: any) => {
          const countryProps = Object.assign({}, region);
          delete countryProps.geoJson;
          this.drawPolygonsForRegion(region.geoJson, countryProps);
        });
        this.hideOuterMostRegions = false;
      }

      this.isLoading = false;
    });
  }

  fitToGeoJson(rawGeoJson: any) {
    const validJSON = rawGeoJson.replace(/'/g, '"');
    const featureCollection = {
      'type': 'FeatureCollection',
      features: [ {
        'type': 'Feature',
        'properties': null,
        'geometry': JSON.parse(validJSON)
      } ]
    };
    const geojsonLayer = L.geoJson(featureCollection);
    this.fitBounds(geojsonLayer.getBounds());
  }

  drawPolygonsForRegion(rawGeoJson: any, properties: any) {
    if (rawGeoJson) {
      const features: any = [];
      const featureCollection = {
        'type': 'FeatureCollection',
        features: features
      };
      const validJSON = rawGeoJson.replace(/'/g, '"');
      featureCollection.features.push({
        type: 'Feature',
        properties: properties,
        geometry: JSON.parse(validJSON)
      });
      this.addFeatureCollectionLayer(featureCollection);
    }
  }

  showOutermostRegions() {
    if (this.hideOuterMostRegions || this.nearByView) {
      return false;
    }
    if (this.mapRegions.length > 1 || (this.mapRegions.length == 1 && this.mapRegions[0].region)) {
      const index = (this.mapRegions.length > 1 && !this.mapRegions[0].region) ? 1 : 0;
      const countryId = this.mapRegions[index].region.replace(environment.entityURL, '');
      const region = this.outermostRegions.filter((region: any) => {
        return region.country == countryId;
      });
      if (!region.length) {
        return false;
      }
      if (this.mapRegions.length > 2 || (this.mapRegions.length == 2 && this.mapRegions[0].region)) {
        const regionId = this.mapRegions[this.mapRegions.length - 1].region.replace(environment.entityURL, '');
        const regionT = this.outermostRegions.find((region: any) => {
          return region.id == regionId;
        });
        if (!regionT) {
          return false;
        }
      }
    }
    return true;
  }

  addFeatureCollectionLayer(featureCollection: any) {
    this.addLayer(featureCollection, (feature: any, layer: any) => {
      /*if (this.mapRegions.length>1){
          if (!this.labelsRegionsGroup){
              this.labelsRegionsGroup = new L.FeatureGroup();
              this.map.addLayer(this.labelsRegionsGroup);
          }
          if (feature.properties && feature.properties.regionLabel){
              const labelMarker = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                      className: 'label-regions',

                      html: feature.properties.regionLabel
                  })
              });
              this.labelsRegionsGroup.addLayer(labelMarker);
          }
      }*/
      layer.on({
        click: (e: any) => {
          if (e.target.feature.properties) {
            //this.isLoading = true;
            const region = e.target.feature.properties.region;
            const count = e.target.feature.properties.count;
            const label = e.target.feature.properties.regionLabel;
            if (count) {
              this.mapRegions.push({
                label: label,
                region: region
              });
              this.loadMapVisualization(this.filters, region);

              //Slice to force trigger the pipe of outermost regions
              this.mapRegions = this.mapRegions.slice(0, this.mapRegions.length);
            }
          }
        },
        mouseover: (e: any) => {
          const layer = e.target;
          if (layer.feature.properties) {
            layer.setStyle({
              fillOpacity: 1
            });
          }
        },
        mouseout: (e: any) => {
          const layer = e.target;
          if (layer.feature.properties) {
            layer.setStyle({
              fillOpacity: this.heatScale ? 0.8 : 0.5
            });
          }
          setTimeout(() => {
            this.map.dragging.enable();
            this.map.scrollWheelZoom.enable();
            if (this.map.tap) {
              this.map.tap.enable();
            }
          });
        },
      });
    }, (feature: any) => {
      return this.polygonsStyle(feature);
    });
  }

  ngOnDestroy() {
    const obj: any = document.getElementById(this.mapId);
    if (obj) {
      obj.outerHTML = '';
    }
    this.destroyed.next();
    this.destroyed.complete();
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  updateQueryParam(firstTime: boolean) {
    const regions = [];
    if (this.isEmbeddedMap) {
      if (this.mapRegions.length > 1) {
        const qid = this.mapRegions[this.mapRegions.length - 1].region.replace(environment.entityURL, '');
        regions.push(qid);
      }
    } else {
      for (let mapRegion of this.mapRegions.slice(1, this.mapRegions.length)) {
        regions.push(mapRegion.label.split(' ').join('-'));
      }
      if (regions.length) {
        const qid = this.mapRegions[this.mapRegions.length - 1].region.replace(environment.entityURL, '');
        regions.push(qid);
      }
    }
    const myRegionFragment = this.translateService.sections.myregion;
    let fragment = regions.length ||
    this._route.snapshot.fragment == myRegionFragment ||
    this._route.snapshot.queryParamMap.has(this.queryParamMapRegionName) ? myRegionFragment : undefined;
    if (this.isEmbeddedMap) {
      fragment = undefined;
    }

    this._router.navigate([], {
      relativeTo: this._route,
      fragment: fragment,
      queryParams: {
        [this.queryParamMapRegionName]: regions.length ? regions.join(',') : undefined,
        parentLocation: (window.location !== window.parent.location) ?
          (this._route.snapshot.queryParamMap.has(this.queryParamParentLocation) ? this._route.snapshot.queryParamMap.get(this.queryParamParentLocation) : 'embedMap') : undefined
      },
      queryParamsHandling: 'merge'
    });
  }

  updateCoordsQueryParam(coordinates: any) {
    let fragment: string | undefined = this._route.snapshot.fragment + '';
    if (!this._route.snapshot.fragment) {
      fragment = undefined;
    }
    this._router.navigate([], {
      relativeTo: this._route,
      fragment: fragment,
      queryParams: {
        coords: coordinates
      },
      queryParamsHandling: 'merge'
    });
  }

  openFilterDialog() {
    const config = this.mobileQuery ? {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog'
    } : {
      width: '50%',
      height: '100%',
      panelClass: 'filter-dialog'
    };
    this.dialog.open(FiltersComponent, config);
  }

  private getFilterLabel(type: string, label: string) {
    return this.filterService.getFilterLabel(type, label);
  }

  private getFilterKey(type: string, queryParam: string) {
    return this.filterService.getFilterKey(type, this.route.snapshot.queryParamMap.get(queryParam));
  }

  private polygonsStyle(feature: any) {
    let backgroundColor = '#ff7800';
    if (feature.properties && this.heatScale && this.heatMapScale && this.heatMapScale.length) {
      backgroundColor = this.heatMapScale[this.heatMapScale.length - 1].color;
      this.heatMapScale.forEach((scale: any) => {
        const count = feature.properties.count;
        if (count >= scale.from && count < scale.to) {
          backgroundColor = scale.color;
          return;
        }
      });
    }
    let style = {
      color: '#ff7800',
      opacity: 1,
      weight: 2,
      fillOpacity: 0.5,
      fillColor: backgroundColor
    };
    if (this.heatScale) {
      style.color = '#DDD';
      style.fillOpacity = 0.8;
    }

    if (feature.properties && !feature.properties.count) {
      style.fillColor = '#AAAAAA';
    }
    return style;
  }

  private getBackgroundColor(properties: any) {

  }

  private defaultStyle() {
    return {
      color: '#ff7800',
      opacity: 1,
      weight: 2,
      fillOpacity: 0.5,
      fillColor: '#ff7800',
    };
  }
}
