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

    public countries: UxAutoCompleteTagItem[] = [
        new UxAutoCompleteTagItem({id: '12,DK', label: 'Denmark', iconClass: 'flag-icon flag-icon-dk'}),
        new UxAutoCompleteTagItem({id: '13,PL', label: 'Poland', iconClass: 'flag-icon flag-icon-pl'}),
        new UxAutoCompleteTagItem({id: '15,IT', label: 'Italy', iconClass: 'flag-icon flag-icon-it'}),
        new UxAutoCompleteTagItem({id: '2,IE', label: 'Ireland', iconClass: 'flag-icon flag-icon-ie'}),
        new UxAutoCompleteTagItem({id: '20,FR', label: 'France', iconClass: 'flag-icon flag-icon-fr'}),
        new UxAutoCompleteTagItem({id: '25,CZ', label: 'Czech Republic', iconClass: 'flag-icon flag-icon-cz'})
    ];
    public topics: UxAutoCompleteTagItem[] = [
        new UxAutoCompleteTagItem({id: 'TO01', label: 'Research and innovation', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO02', label: 'ICT and broadband', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO03', label: 'Competitiveness of SMEs', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO04', label: 'Low carbon economy', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO05', label: 'Climate change adaptation and risk management', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO06', label: 'Environment and resource efficiency', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO07', label: 'Transport and key network infrastructures', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO08', label: 'Employment and labour mobility', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO09', label: 'Social inclusion and combating poverty', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO10', label: 'Education, training and vocational training', iconClass: 'flag-icon topic-icon-TO01'}),
        new UxAutoCompleteTagItem({id: 'TO11', label: 'Institutional capacity efficient public administration', iconClass: 'flag-icon topic-icon-TO01'})
    ];
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
