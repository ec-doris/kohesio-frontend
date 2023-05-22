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
import {DraftService} from "../../services/draft.service";
import {DialogEclComponent} from "../../components/ecl/dialog/dialog.ecl.component";
import {SaveDraftComponent} from "./dialogs/save-draft.component";
import {Draft} from "../../models/draft.model";
import {EditService} from "../../services/edit.service";

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
    public editDraft:boolean = false;



    public myForm!: FormGroup;
    public drafts:any[] = [];

    public languages:any[] = [{
      id:'en',
      value:'English'
    }];

    //public draftSelected:any;

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
                private draftService: DraftService,
                private editService: EditService){}

    ngOnInit(){
        if (!this.project) {
            this.project = this.route.snapshot.data['project'];
        }
        this.currentUrl += '/projects/' + this.project.item;

        this.myForm = new FormGroup({
          'draftId': new FormControl(),
          'label': new FormControl(this.project.label, { nonNullable: true }),
          'description': new FormControl(this.project.description, { nonNullable: true }),
          'language': new FormControl(this.translateService.locale, {nonNullable: true})
        })

      this.getDraftsList();

    }

    ngAfterViewInit(): void {
        let markers = [];
        if (this.isPlatformBrowser()) {
          if (this.project.coordinates && this.project.coordinates.length) {
            this.project.coordinates.forEach(coords => {
              //this.project["coordinates"][0]; ??
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
      this.editMode = true;
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
            this.editDraft = false;
          }else {
            if (this.editDraft) {
              this.myForm.reset();
              this.editDraft = false;
            }
          }
        });
      }else {
        this.editMode = false;
        if(this.editDraft){
          this.myForm.reset();
          this.editDraft = false;
        }
      }

    }

    onDraftSelect($event:any){
      //console.log("DRAFT SELECTED",this.draftSelected);
      this.draftService.getDraft($event,this.project.item!).subscribe((draft:any)=>{
        this.myForm.patchValue({
          draftId: $event,
          label:draft.label,
          description:draft.summary,
          language:draft.language
        });
        this.myForm.markAsPristine();
        this.editMode = true;
        this.editDraft = true;
      })
    }

    deleteDraft(){
      let dialogRef:MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data:{
          confirmMessage: "Do you want to delete this draft?"
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'primary') {
          this.draftService.deleteDraft(this.myForm.value.draftId).subscribe(()=>{
            this.getDraftsList();
            this.editMode = false;
            this.editDraft = false;
          })
        }
      });
    }

    saveDraft(){
      if (this.myForm.value.draftId){
        this.draftService.editDraft(
          this.myForm.value.draftId,
          this.myForm.value.label,
          this.myForm.value.description,
          this.myForm.value.language).subscribe((draft: any) => {
          this.editMode = false;
          this.editDraft = false;
        });
      }else {
        let dialogRef: MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
          disableClose: false,
          autoFocus: false,
          data: {
            childComponent: SaveDraftComponent,
            title: "Save as draft",
            primaryActionLabel: "Save",
            secondaryActionLabel: "Cancel"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.action && result.action == 'primary') {
            this.draftService.addDraft(
              this.project.item!,
              this.myForm.value.label,
              this.myForm.value.description,
              this.myForm.value.language,
              result.data.name).subscribe((draft: Draft) => {
                this.drafts.push({
                  id: draft['id'],
                  value: draft.name ?
                    `${draft.name} - ${draft.creationTime.toLocaleString()}` :
                    draft.creationTime.toLocaleString()
                })
            })
            this.editMode = false;
            this.editDraft = false;
          }
        });
      }
    }

    getDraftsList(){
      this.drafts=[];
      this.draftService.getDrafts(this.project.item!).subscribe((drafts:Draft[])=>{
        drafts.forEach((draft:Draft)=>{
          this.drafts.push({
            id: draft.id,
            value: draft.name ?
              `${draft.name} - ${draft.creationTime.toLocaleString()}` :
              draft.creationTime.toLocaleString()
          })
        })
      })
    }

    submitEdit(){
      if (this.project.hasSubmitted) {
        let dialogRef: MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
          disableClose: false,
          data: {
            confirmMessage: "<p>There is already a submitted version, waiting for approval, do you want to submit this version?</p>" +
              "<p>This action will cancel the other version that was submitted before.</p>"
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.action == 'primary') {
            this.editService.submit(this.project.item!,
              this.myForm.value.draftId,
              this.myForm.value.label,
              this.myForm.value.description,
              this.myForm.value.language).subscribe(edit=>{
              this.editMode = false;
              this.project.hasSubmitted = true;
            })

          }
        });
      }else{
        this.editService.submit(this.project.item!,
          this.myForm.value.draftId,
          this.myForm.value.label,
          this.myForm.value.description,
          this.myForm.value.language).subscribe(edit=>{
          this.editMode = false;
          this.project.hasSubmitted = true;
        })
      }
    }
}
