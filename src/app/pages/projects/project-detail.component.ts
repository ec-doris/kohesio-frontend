import {AfterViewInit, Component, Inject, Input, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProjectDetail} from "../../models/project-detail.model";
import { environment } from 'src/environments/environment';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageOverlayComponent} from "src/app/components/kohesio/image-overlay/image-overlay.component"
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "../../services/translate.service";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogEclComponent} from "../../components/ecl/dialog/dialog.ecl.component";
import {SaveDraftComponent} from "./dialogs/save-draft.component";
import {EditService} from "../../services/edit.service";
import {EditVersion} from "../../models/edit.model";

declare let L:any;

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements AfterViewInit {

    @Input()
    public project!: ProjectDetail;

    @Input()
    public isModal: boolean = false;

    public wikidataLink!: string;
    public currentUrl: string = (this._document.location.protocol + '//' + this._document.location.hostname) +
                                (this._document.location.port != "" ? ':' + this._document.location.port : '');

    @ViewChild(MapComponent)
    public map!: MapComponent;

    public entityURL = environment.entityURL;

    public editMode:boolean = false;

    public myForm!: FormGroup;

    public languages:any[] = [{
      id:'en',
      value:'English'
    }];
    public versions:any[] = [];
    public originalVersion:any = {
      id:0,
      value:"--ORIGINAL VERSION--"
    };


    constructor(public dialog: MatDialog,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router,
                private sanitizer: DomSanitizer,
                public translateService: TranslateService,
                @Inject(DOCUMENT) private _document: Document,
                @Inject(PLATFORM_ID) private platformId: Object,
                public userService: UserService,
                private formBuilder: FormBuilder,
                private editService: EditService){}

    ngOnInit(){
        if (!this.project) {
            this.project = this.route.snapshot.data['project'];
        }
        this.currentUrl += '/projects/' + this.project.item;

        this.myForm = new FormGroup({
          'editId': new FormControl(),
          'versionId': new FormControl(0,{nonNullable:true}),
          'status': new FormControl(),
          'label': new FormControl(this.project.label, { nonNullable: true }),
          'description': new FormControl(this.project.description, { nonNullable: true }),
          'language': new FormControl(this.translateService.locale, {nonNullable: true})
        })

    }

    ngAfterViewInit(): void {
        let markers = [];
        if (this.isPlatformBrowser()) {
          if (this.project.coordinates && this.project.coordinates.length) {
            this.project.coordinates.forEach(coords => {
              const coord = coords.replace("Point(", "").replace(")", "").split(" ");
              const marker = this.map.addMarker(coord[1], coord[0], false);
              markers.push(marker);
            });
            this.map.refreshView();
          }
          if (this.project.geoJson) {
            const poly = this.map.drawPolygons(this.project.geoJson);
            this.map.fitBounds(poly.getBounds());
          } else {
            this.map.addCountryLayer(this.project.countryLabel);
          }
          (<any>window).twttr.widgets.load();
        }
    }

    openWiki(event: any){
        window.open("https://linkedopendata.eu/wiki/Item:" + this.project.item, "_blank");
    }

    openGraph(event: any){
        const entity = "https://linkedopendata.eu/entity/" + this.project.item;
        window.open(
            "https://query.linkedopendata.eu/embed.html#%23defaultView%3AGraph%0ASELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20VALUES%20%3Fitem%20%7B%20%3C"
            + entity
            + "%3E%7D%20%3Fitem%20%3FpDirect%20%3FlinkTo%20.%0A%20%20%3Fitem%20rdfs%3Alabel%20%3FitemLabel%20.%0A%20%20FILTER(lang(%3FitemLabel)%3D%22en%22)%0A%7D",
        "_blank");
    }

    openNewTab(){
        window.open(location.origin + "/projects/" + this.project.item, "_blank");
    }

    openWikidataLink(event: any){
        if (event){
            window.open(this.wikidataLink,'blank');
        }
    }

    openGDPRInfoBox(link: string){
        this.wikidataLink = link;
        //TODO ECL side effect
        //this.uxService.openMessageBox()
    }

    openImageOverlay(imgUrl:string, projectTitle:any, imageCopyright: any) {
        this.dialog.open(ImageOverlayComponent, {data: {imgUrl, title: projectTitle, imageCopyright}})
      }

    reportDataBug(){
        const to:string = "REGIO-KOHESIO@ec.europa.eu";
        const subject:string = "Reporting error or duplicate";
        let location:string = window.location.toString();
        if (this.project.item && !location.endsWith(this.project.item)){
            location += "projects/"+this.project.item;
        }
        const body:string = "Please describe the error or the duplicate with the URLs: " + location;
        //window.location.href=`mailto:${to}?subject=${subject}&body=${body}`
        window.open(`mailto:${to}?subject=${subject}&body=${body}`, 'mail');
    }

    getYoutubeEmbedUrl(video:string){
      return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+this.project.youtube_parser(video));
    }

    getVideoId(video:string): any{
      if (video) {
        return this.project.youtube_parser(video);
      }
    }

    getTweetHTML(tweet: string) {
      return `<blockquote data-lang="${this.translateService.locale}" class="twitter-tweet"><a href="${tweet}"></a></blockquote>`;
    }

    getThemeURL(item: string): Params{
      const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
      return {
        [this.translateService.queryParams.theme]:item.split(' ').join('-'),
        [this.translateService.queryParams.sort]: sort
      };
    }

    getInterventionFieldURL(item:string):Params{
      const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
      return {
        [this.translateService.queryParams.interventionField]:item.split(' ').join('-'),
        [this.translateService.queryParams.sort]: sort
      };
    }

    getProgramURL(countryLabel:string, programmeLabel:string):Params{
      const sort = $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`.split(' ').join('-');
      return {
        [this.translateService.queryParams.country]: countryLabel,
        [this.translateService.queryParams.programme]: programmeLabel.split(' ').join('-'),
        [this.translateService.queryParams.sort]: sort
      };
    }

    isPlatformBrowser(){
      return isPlatformBrowser(this.platformId);
    }

    editProject(){
      this.versions = [this.originalVersion];
      this.editService.getLatestVersion({qid:this.project.item}).subscribe(edit=>{
        if (edit && Object.keys(edit).length && edit.id){
          if (edit.id){
            this.myForm.patchValue({
              editId: edit.id
            });
          }
          if (edit.latest_version) {
            this.myForm.patchValue({
              versionId: edit.latest_version.edit_version_id,
              status:edit.latest_version.status,
              label: edit.latest_version.label,
              description: edit.latest_version.summary,
              language: edit.language
            });
          }
          if (edit.edit_versions){
            for(const version of edit.edit_versions.reverse()){
              this.versions.push({
                id: version.edit_version_id,
                value:  version.status + ' - ' +
                  (version.version_name ? version.version_name + ' - ' : '') +
                  (version.creation_time?.toLocaleString())
              })
            }
          }
        }else{
          this.myForm.reset();
        }
        this.editMode = true;
      })
    }

    cancelEdit(){
      if (this.myForm.dirty){
        let dialogRef:MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
          disableClose: false,
          data:{
            confirmMessage: "Do you want to discard the changes?"
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result && result.action == 'primary') {
            this.myForm.reset();
            this.editMode = false;
          }
        });
      }else {
        this.editMode = false;
      }

    }

    onVersionSelect(){
      if (this.myForm.value.versionId==this.originalVersion.id){
        this.myForm.reset();
      }else {
        this.editService.getVersion(this.myForm.value.versionId).subscribe((version: EditVersion) => {
          this.myForm.patchValue({
            versionId: version.edit_version_id,
            status: version.status,
            label: version.label,
            description: version.summary
          });
          this.myForm.markAsPristine();
        })
      }
    }

    onDeleteVersion(){
      let dialogRef:MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data:{
          confirmMessage: "Do you want to delete this version?"
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'primary') {
          this.editService.deleteVersion(this.myForm.value.versionId).subscribe(()=>{
            this.myForm.patchValue({
              versionId: null,
              status: null
            });
            this.editProject();
          })
        }
      });
    }

    saveVersion(status:string){
      let dialogRef: MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        autoFocus: false,
        data: {
          childComponent: SaveDraftComponent,
          title: "Save as",
          primaryActionLabel: "Save",
          secondaryActionLabel: "Cancel"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.action && result.action == 'primary') {
          this.createEditVersion(result.data.name, status);
        }
      });
    }

  createEditVersion(version_name:string, status: string){
      const edit:EditVersion = new EditVersion();
      edit.cci_qid=this.project.program[0].link.replace(environment.entityURL,"");
      edit.operation_qid=this.project.item as string;
      edit.edit_id=this.myForm.value.editId;
      edit.label=this.myForm.value.label;
      edit.summary=this.myForm.value.description;
      edit.version_name=version_name;
      edit.language=this.myForm.value.language;
      edit.status=status;
      this.editService.createVersion(edit).subscribe((version:EditVersion)=>{
        if (status == 'APPROVED'){
          this.project.label = version.label;
          this.project.description = version.summary;
          this.editMode = false;
        }else{
          this.editProject();
        }
      })
    }
}
