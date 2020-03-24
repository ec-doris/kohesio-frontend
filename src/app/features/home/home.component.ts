import {AfterViewInit, Component} from '@angular/core';
import { UxAutoCompleteTagItem, UxService } from '@eui/core';
import {ProjectService} from "../../project.service";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Project} from "../../shared/models/project.model";
import {Filters} from "../../shared/models/filters.model";
import {MarkerService} from "../module1/marker.service";
declare let L;

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {

    public countries: UxAutoCompleteTagItem[] = [];
    public topics: UxAutoCompleteTagItem[] = [];
    public projects: Project[] = [];
    public myForm: FormGroup;
    public isLoading = false;
    public map;
    public loadedDataPoints = false;

    constructor(private projectService: ProjectService,
                private formBuilder: FormBuilder,
                private uxService:UxService,
                private markerService:MarkerService){}

    ngOnInit(){
        this.myForm = this.formBuilder.group({
            countries: [
                { value: null, disabled: false }
            ],
            topics: [
                { value: null, disabled: false }
            ],
            term: ""
        });
        this.projectService.getFilters().then(result=>{
            //Countries
            for (let country of result.countries){
                let countryCode = country[0].split(",")[1].toLowerCase();
                this.countries.push(
                    new UxAutoCompleteTagItem({
                        id: country[0],
                        label: country[1],
                        iconClass: 'flag-icon flag-icon-' + countryCode
                    })
                )
            }
            //Topics
            for (let topic of result.topics){
                this.topics.push(
                    new UxAutoCompleteTagItem({
                        id: topic[0],
                        label: topic[1],
                        iconClass: 'topic-icon ' + topic[0]
                    })
                )
            }
        });
        this.getProjectList(null);
        this.markerService.getServerPoints().then(result=>{
            this.loadedDataPoints = result;
        });
    }

    ngAfterViewInit(): void {
    }

    private getProjectList(filters:Filters){
        this.isLoading = true;
        this.projectService.getProjects(filters).subscribe((result:Project[]) => {
            this.projects = result;
            this.isLoading = false;
        });
    }

    onSubmit(form: FormGroup) {
        this.projects = [];
        const filters = new Filters().deserialize(form.value);
        this.getProjectList(filters);
    }

    onMapModalAnimationEnd(event){
        if (!this.map) {
            this.map = L.map('map-inside').setView([48, 4], 5);
            const tiles = L.tileLayer('https://europa.eu/webtools/maps/tiles/osmec2/{z}/{x}/{y}', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '| &copy; <a href="https://ec.europa.eu/eurostat/web/gisco">GISCO</a>'
            });
            tiles.addTo(this.map);

            this.markerService.makeMarkers(this.map);
        }
    }

}
