import { Component } from '@angular/core';
import { UxAutoCompleteTagItem } from '@eui/core';
import {ProjectService} from "../../project.service";
import { UxDynamicModalService, UxDynamicModalConfig } from '@eui/core';
import {MapviewModalComponent} from "./components/mapview-modal/mapview-modal.component";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Project} from "../../shared/models/project.model";
import {Filters} from "../../shared/models/filters.model";


@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public countries: UxAutoCompleteTagItem[] = [];
    public topics: UxAutoCompleteTagItem[] = [];
    public projects: Project[] = [];
    public myForm: FormGroup;


    constructor(private projectService: ProjectService,
                public uxDynamicModalService: UxDynamicModalService,
                private formBuilder: FormBuilder){}

    ngOnInit(){
        this.myForm = this.formBuilder.group({
            countries: [
                { value: null, disabled: false }
            ],
            topics: [
                { value: null, disabled: false }
            ]
        });
        this.getProjectList(null);
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
                        iconClass: 'flag-icon topic-icon-' + topic[0]
                    })
                )
            }
        });
    }

    private getProjectList(filters:Filters){
        this.projectService.getProjects(filters).subscribe((result:Project[]) => {
            this.projects = result;
        });
    }

    openMapModal(){
        const config = new UxDynamicModalConfig({
            id: 'MapViewModal',
            titleLabel: 'Map View',
            bodyInjectedComponent: {
                component: MapviewModalComponent
            }
        });

        this.uxDynamicModalService.openModal(config);
    }

    onSubmit(form: FormGroup) {
        const filters = new Filters().deserialize(form.value);
        this.getProjectList(filters);
    }

}
