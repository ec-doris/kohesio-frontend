import { Component, Input } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { Filters } from "../../models/filters.model";
import { BeneficiaryService } from "../../../services/beneficiary.service";
import { FormGroup } from "@angular/forms";
import {ProjectService} from "../../../services/project.service";

@Component({
    selector: 'app-download-button',
    templateUrl: './download-button.component.html',
    styleUrls: ['./download-button.component.scss']
})
export class DownloadButtonComponent {

    @Input("form")
    public form: FormGroup;

    @Input("type")
    public type: string;

    public fileTypes = {
        csv:{
            extension: 'csv',
            type: 'text/csv'
        },
        excel:{
            extension: 'xls',
            type: 'application/vnd.ms-excel'
        }
    }

    constructor(public uxAppShellService: UxAppShellService,
                private beneficaryService: BeneficiaryService,
                private projectService: ProjectService){}

    getFile(filetype:string){
        const filters = new Filters().deserialize(this.form.value);

        let method = null;
        if (this.type == "beneficiaries"){
            method = this.beneficaryService.getFile(filters, filetype);
        }else if (this.type="projects"){
            method = this.projectService.getFile(filters, filetype);
        }

        method.subscribe(response=>{

            const newBlob = new Blob([response], { type: this.fileTypes[filetype].type });
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

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
