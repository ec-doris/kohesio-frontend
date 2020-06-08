import {AfterViewInit, Component, Inject, Renderer2, ViewChild} from '@angular/core';
import { UxService } from '@eui/core';
import {ProjectService} from "../../project.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import {Project} from "../../shared/models/project.model";
import {Filters} from "../../shared/models/filters.model";
import {MarkerService} from "../module1/marker.service";
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import {DOCUMENT} from "@angular/common";
declare let L;

@Component({
    templateUrl: './projects.component.html'
})
export class ProjectsComponent implements AfterViewInit {

    public countries: any[] = [];
    public regions: any[] = [];
    public themes: any[] = [];
    public projects: Project[] = [];
    public myForm: FormGroup;
    public isLoading = false;
    public map;
    public loadedDataPoints = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private projectService: ProjectService,
                private formBuilder: FormBuilder,
                private uxService:UxService,
                private markerService:MarkerService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _renderer2: Renderer2,
                @Inject(DOCUMENT) private _document: Document){}

    ngOnInit(){
        this.myForm = this.formBuilder.group({
            country: [this._route.snapshot.queryParamMap.get('country')],
            region: [this._route.snapshot.queryParamMap.get('regions')],
            theme: [this._route.snapshot.queryParamMap.get('topics')],
            keywords: this._route.snapshot.queryParamMap.get('keywords')
        });
        this.projectService.getFilters().then(result=>{

            //Countries
            for (let country of result.countries){
                let countryCode = country[0].split(",")[1].toLowerCase();
                let countryId= country[0].split(",")[0];
                this.countries.push({
                    id: countryId,
                    value: country[1],
                    iconClass: 'flag-icon flag-icon-' + countryCode
                })
            }
            if (this._route.snapshot.queryParamMap.get('country')){
                this.myForm.patchValue({
                    country: this.projectService.getFilterKey("countries",this._route.snapshot.queryParamMap.get('country'))
                });
                this.getRegions();
            }
            //Themes
            for (let topic of result.themes){
                let topicCode = topic[0].split(",")[1];
                let topicId= topic[0].split(",")[0];
                this.themes.push({
                    id: topicId,
                    value: topic[1],
                    iconClass: 'topic-icon ' + topicCode
                })
            }
            if (this._route.snapshot.queryParamMap.get('theme')){
                this.myForm.patchValue({
                    theme: this.projectService.getFilterKey("themes", this._route.snapshot.queryParamMap.get('theme'))
                });
            }
            if (this._route.snapshot.queryParamMap.get('region')){
                this.getRegions().then(regions=>{
                    this.myForm.patchValue({
                        region: this.projectService.getFilterKey("regions", this._route.snapshot.queryParamMap.get('region'))
                    });
                    this.getProjectList();
                });
            }else{
                this.getProjectList();
            }

        });
        this.markerService.getServerPoints().then(result=>{
            this.loadedDataPoints = result;
        });
    }

    ngAfterViewInit(): void {
        //this.onMapModalAnimationEnd();
        /*let script = this._renderer2.createElement('script');
        script.type = `application/json`;
        script.text = `
            {
                "service": "map",
                "renderTo" : "map-inside",
                "map": {
                    "center": [
                        46,
                        4
                    ],
                    "zoom": 4,
                    "background": [
                        "osmec"
                    ],
                    "maxZoom": 18
                },
                "version": "2.0"
            }
        `;
        this._renderer2.appendChild(this._document.body, script);*/
    }

    private getProjectList(){
        const filters = new Filters().deserialize(this.myForm.value);
        this.isLoading = true;
        this.projectService.getProjects(filters).subscribe((result:Project[]) => {
            this.projects = result;
            this.isLoading = false;
            this.paginator.firstPage();
        });
    }

    onSubmit() {
        this.projects = [];
        const filters = new Filters().deserialize(this.myForm.value);
        this.getProjectList();

        this._router.navigate([], {
            relativeTo: this._route,
            queryParams: this.getFormValues(),
            queryParamsHandling: 'merge'
        });
    }

    onMapModalAnimationEnd(){
        if (!this.map) {
            this.map = L.map('map-inside').setView([48, 4], 5);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);

            //this.markerService.makeMarkers(this.map);
        }
    }

    onPaginate(event){
    }

    getPageIndexStart(){
        return this.paginator ? this.paginator.pageSize * this.paginator.pageIndex : 0;
    }

    getPageIndexEnd(){
        return this.paginator ? this.getPageIndexStart() + this.paginator.pageSize : 15;
    }

    getFormValues(){
        return {
            keywords: this.myForm.value.keywords ? this.myForm.value.keywords : null,
            country: this.projectService.getFilterLabel("countries", this.myForm.value.country),
            region: this.projectService.getFilterLabel("regions", this.myForm.value.region),
            theme: this.projectService.getFilterLabel("themes", this.myForm.value.theme)
        }
    }

    onCountryChange(){
        this.getRegions();
        this.myForm.patchValue({
            region: null
        });
    }

    getRegions(): Promise<any>{
        return new Promise((resolve, reject) => {
            this.projectService.getRegions(this.myForm.value.country).subscribe(regions => {
                this.regions = [];
                for (let region of regions) {
                    let regionId = region[0];
                    this.regions.push({
                        id: regionId,
                        value: region[1]
                    })
                }
                resolve(true);
            });
        });
    }


}
