import { Component } from '@angular/core';
import { UxAutoCompleteTagItem } from '@eui/core';
import {ProjectService} from "../../project.service";
import { UxDynamicModalService, UxDynamicModalConfig } from '@eui/core';
import {MapviewModalComponent} from "./components/mapview-modal/mapview-modal.component";


@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public countries: UxAutoCompleteTagItem[] = [];
    public topics: UxAutoCompleteTagItem[] = [];
    public projects = [];

    constructor(private projectService: ProjectService,
                public uxDynamicModalService: UxDynamicModalService){}

    ngOnInit(){
        this.projectService.getProjects().subscribe((result:any) => {
           const rawProjects = result.results.bindings;
           for(let rawProject of rawProjects){
               this.projects.push({
                   link: rawProject.s0.value,
                   objectiveId: rawProject.objectiveId.value,
                   countryCode: rawProject.countrycode.value,
                   title: rawProject.label.value.length > 60 ?
                       rawProject.label.value.substring(0, 60) + '...' :
                       rawProject.label.value,
                   startTimeFormatted: rawProject.startTime.value,
                   budget: rawProject.euBudget.value,
                   description: rawProject.description.value.length > 500 ?
                       rawProject.description.value.substring(0, 500) + '...' :
                       rawProject.description.value
               })
           }
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
                        iconClass: 'flag-icon topic-icon-' + topic[0]
                    })
                )
            }
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

}
