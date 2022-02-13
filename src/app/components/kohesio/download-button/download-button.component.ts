import { Component, Input } from '@angular/core';
import { BeneficiaryService } from "../../../services/beneficiary.service";
import { FormGroup } from "@angular/forms";
import {ProjectService} from "../../../services/project.service";
import { Filters } from 'src/app/models/filters.model';

@Component({
    selector: 'app-download-button',
    templateUrl: './download-button.component.html',
    styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent {

    @Input("form")
    public form!: FormGroup;

    @Input("type")
    public type!: string;

    public fileTypes:any = {
        csv:{
            extension: 'csv',
            type: 'text/csv'
        },
        excel:{
            extension: 'xlsx',
            type: 'application/vnd.ms-excel'
        }
    }

    constructor(private beneficaryService: BeneficiaryService,
                private projectService: ProjectService){}

    getFile(filetype:string){
        const filters = new Filters().deserialize(this.form.value);

        let method:any = null;
        if (this.type == "beneficiaries"){
            method = this.beneficaryService.getFile(filters, filetype);
        }else if (this.type="projects"){
            method = this.projectService.getFile(filters, filetype);
        }

        if (method){
            method.subscribe((response:any)=>{

                const newBlob = new Blob([response], { type: this.fileTypes[filetype].type });
                // IE doesn't allow using a blob object directly as link href
                // instead it is necessary to use msSaveOrOpenBlob
                //TODO ECL Side effect
                // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                //     window.navigator.msSaveOrOpenBlob(newBlob);
                //     return;
                // }

                const data = window.URL.createObjectURL(newBlob);

                let link = document.createElement('a');
                link.href = data;
                link.download = this.type + "." + this.fileTypes[filetype].extension;
                link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

                setTimeout(function () {
                    window.URL.revokeObjectURL(data);
                    link.remove();
                }, 100);
            })
        }
    }



}
