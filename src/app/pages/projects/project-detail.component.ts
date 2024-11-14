import {AfterViewInit, Component, Inject, Input, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import { filter } from 'rxjs';
import { ImageEditFormComponent } from '../../components/kohesio/image-edit-form/image-edit-form.component';
import {ProjectService} from "../../services/project.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProjectDetail} from "../../models/project-detail.model";
import { environment } from 'src/environments/environment';
import { MapComponent } from 'src/app/components/kohesio/map/map.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageOverlayComponent} from "src/app/components/kohesio/image-overlay/image-overlay.component"
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "../../services/translate.service";
import {DatePipe, DOCUMENT, isPlatformBrowser} from "@angular/common";
import {UserService} from "../../services/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogEclComponent} from "../../components/ecl/dialog/dialog.ecl.component";
import {SaveDraftComponent} from "./dialogs/save-draft.component";
import {EditService} from "../../services/edit.service";
import {EditVersion} from "../../models/edit.model";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

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

    public languages: any[] = [{
      id: "bg",
      value: "български"
    },{
      id: "es",
      value:"español"
    },{
      id: "cs",
      value:"čeština"
    },{
      id: "da",
      value:"dansk"
    },{
      id: "de",
      value:"Deutsch"
    },{
      id: "et",
      value:"eesti"
    },{
      id: "el",
      value:"ελληνικά"
    },{
      id: "en",
      value:"English"
    },{
      id: "fr",
      value:"français"
    },{
      id: "ga",
      value:"Gaeilge"
    },{
      id: "hr",
      value:"hrvatski"
    },{
      id: "it",
      value:"italiano"
    },{
      id: "lv",
      value:"latviešu"
    },{
      id: "lt",
      value:"lietuvių"
    },{
      id: "hu",
      value:"magyar"
    },{
      id: "mt",
      value:"Malti"
    },{
      id: "nl",
      value:"Nederlands"
    },{
      id: "pl",
      value:"polski"
    },{
      id: "pt",
      value:"português"
    },{
      id: "ro",
      value:"română"
    },{
      id: "sk",
      value:"slovenčina"
    },{
      id: "sl",
      value:"slovenščina"
    },{
      id: "fi",
      value:"suomi"
    },{
      id: "sv",
      value:"svenska"
    }];
    public versions:any[] = [];
    public originalVersion:any = {
      id:0,
      value:$localize `:@@page.edits.label.originalVersion:--ORIGINAL VERSION--`
    };
    public messageLanguageEditConflict?:string;
    public errorMessage?:string;
    public successMessage?:string;
    youTube!: string;
    tweet!: string;

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
                private datePipe: DatePipe,
                private editService: EditService,
                private _router: Router,
                private _route: ActivatedRoute){}

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
          'language': new FormControl(this.translateService.locale, {nonNullable: true}),
          youtube_video_id: new FormControl(this.project.youtube_video_id),
          twitter_username: new FormControl(this.project.twitter_username),
          facebook_user_id: new FormControl(this.project.facebook_user_id),
          instagram_username: new FormControl(this.project.instagram_username),
          image_url: new FormControl(this.project.image_url),
          image_description: new FormControl(this.project.image_description),
          image_copyright: new FormControl(this.project.image_copyright)
        })


        if (this._route.snapshot.queryParamMap.has("edit")){
          if (this.project.canEdit) {
            this.editProject();
          }else{
            this._router.navigate([], {
              queryParams: {
                edit:undefined,
                editVersion:undefined
              },
              queryParamsHandling: "merge"
            });
          }
        }
        this.youTube = this.project.videos[0];
        this.tweet = this.project.tweets[0];
        this.project.videos = this.sanitizeUrls(this.project.videos, 'YOUTUBE');

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
          // since <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> doesn't exist in index.html anymore
          // (<any>window).twttr.widgets.load();
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
      const link = `${location.origin}/${this.translateService.locale}/${this.translateService.routes.projects}/${this.project.item}`;
      window.open(link, "_blank");
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

    getYoutubeVideoEC(video:string): any{
      if (video) {
        //return this.sanitizer.bypassSecurityTrustResourceUrl("https://europa.eu/webtools/crs/iframe/?oriurl=https://www.youtube.com/embed/"+this.project.youtube_parser(video));
        return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+this.project.youtube_parser(video)+'?enablejsapi=1&amp;origin=https%3A%2F%2Fkohesio.local.ec.europa.eu&amp;widgetid=1');
      }
    }

    getTweetHTML(tweet: string) {
      return `<blockquote data-lang="${this.translateService.locale}" class="twitter-tweet"><a href="${tweet}"></a></blockquote>`;
    }

    getThemeURL(item: string): Params{
      return {
        [this.translateService.queryParams.theme]:item.split(' ').join('-')
      };
    }

    getInterventionFieldURL(item:string):Params{
      return {
        [this.translateService.queryParams.interventionField]:item.split(' ').join('-')
      };
    }

    getProgramURL(countryLabel:string, programmeLabel:string):Params{
      return {
        [this.translateService.queryParams.country]: countryLabel,
        [this.translateService.queryParams.programme]: programmeLabel.split(' ').join('-')
      };
    }

    isPlatformBrowser(){
      return isPlatformBrowser(this.platformId);
    }

    editProject(){
      this.versions = [this.originalVersion];
      this.editService.getLatestVersion({qid:this.project.item}).subscribe(edit=>{
        if (edit.language == this.translateService.locale || !edit.id) {
          if (edit && Object.keys(edit).length && edit.id) {
            if (edit.id) {
              this.myForm.patchValue({
                editId: edit.id
              });
            }
            if (edit.edit_versions) {
              for (const version of edit.edit_versions.reverse()) {
                this.versions.push({
                  id: version.edit_version_id,
                  value: version.status + ' - ' + version.creation_time?.toLocaleString(),
                  latestVersion: edit.latest_version && edit.latest_version.edit_version_id == version.edit_version_id
                })
              }
            }
            if (edit.latest_version) {
              if (this._route.snapshot.queryParamMap.has("editVersion")) {
                const editVersion:number = +this._route.snapshot.queryParamMap.get("editVersion")!;
                this.myForm.patchValue({
                  versionId: editVersion
                })
                this.onVersionSelect();
                this.startEditMode(editVersion);
              } else {
                this.myForm.patchValue({
                  versionId: edit.latest_version.edit_version_id,
                  status: edit.latest_version.status,
                  label: edit.latest_version.label,
                  description: edit.latest_version.summary,
                  language: edit.language
                });
                this.myForm.markAsPristine();
                this.startEditMode();
              }
            }
          } else {
            this.myForm.reset();
            this.startEditMode();
          }

        }else{
          this.translateService.translateUrl(edit.language).subscribe((url:string)=>{
            if (this._route.snapshot.queryParamMap.has("edit")){
              window.location.href = url+'?edit=true';
            }else{
              this.messageLanguageEditConflict = `We've found an edit in "${this.getLanguagePlaceHolder(edit.language)}".
                  <a href='${url}?edit=true'>Click here</a> to continue editing in this language`;
            }
          });
        }
      })
    }

    startEditMode(editVersion?:number){
      this.editMode = true;
      this._router.navigate([], {
        queryParams: {
          edit:true,
          editVersion:editVersion
        },
        queryParamsHandling: "merge"
      });
    }

    finishEditMode(){
      this.editMode = false;
      this._router.navigate([], {
        queryParams: {
          edit:undefined,
          editVersion:undefined
        },
        queryParamsHandling: "merge"
      });
    }


    updateQueryParams(key:string, value:Object|undefined){
      this._router.navigate([], {
        queryParams: {
          [key]: value
        },
        queryParamsHandling: 'merge'
      });
    }

    cancelEdit(){
      if (this.myForm.dirty){
        let dialogRef:MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
          disableClose: false,
          data:{
            confirmMessage: this.translateService.editManagement.messages.discardChanges
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result && result.action == 'primary') {
            this.myForm.reset();
            this.finishEditMode();
          }
        });
      }else {
        this.finishEditMode();
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
          this.updateQueryParams("editVersion", version.edit_version_id);
          this.myForm.markAsPristine();
        })
      }
    }

    onDeleteVersion(){
      let dialogRef:MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data:{
          confirmMessage: this.translateService.editManagement.messages.confirmDeleteVersion
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action == 'primary') {
          this.editService.deleteVersion(this.myForm.value.versionId).subscribe(()=>{
            this.myForm.patchValue({
              versionId: null,
              status: null
            });
            this._router.navigate([], {
              queryParams: {
                editVersion:undefined
              },
              queryParamsHandling: "merge"
            });
            this.editProject();
          })
        }
      });
    }

    saveVersion(status:string, title:string){
      if (this.myForm.dirty || status != "DRAFT") {
        let dialogRef: MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
          disableClose: false,
          autoFocus: false,
          data: {
            childComponent: SaveDraftComponent,
            title: title,
            primaryActionLabel: this.translateService.editManagement.buttons.actionSave,
            secondaryActionLabel: this.translateService.editManagement.buttons.actionCancel
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.action && result.action == 'primary') {
            if (status == 'REJECT'){
              status = 'DRAFT';
            }
            this.createEditVersion(result.data.comment, status);
          }
        });
      }else{
        this.errorMessage = this.translateService.editManagement.messages.noChangeDetected
      }
    }

  createEditVersion(version_comment:string, status: string){
      const edit:EditVersion = new EditVersion();
      edit.cci_qid=this.project.program[0].link.replace(environment.entityURL,"");
      edit.operation_qid=this.project.item as string;
      edit.edit_id=this.myForm.value.editId;
      edit.label=this.myForm.value.label;
      edit.summary=this.myForm.value.description;
      edit.version_comment=version_comment;
      edit.language = this.myForm.value.language;
      edit.youtube_video_id = this.myForm.value.youtube_video_id;
      edit.twitter_username = this.myForm.value.twitter_username;
      edit.facebook_user_id = this.myForm.value.facebook_user_id;
      edit.instagram_username = this.myForm.value.instagram_username;
      edit.image_url = this.myForm.value.image_url;
      edit.image_description = this.myForm.value.image_description;
      edit.image_copyright = this.myForm.value.image_copyright;
      edit.status=status;
      this.editService.createVersion(edit).subscribe((version:EditVersion)=>{
        if (status == 'APPROVED' || status == 'SUBMITTED'){
          this.project.label = version.label;
          this.project.description = version.summary;
          this.successMessage = status == 'APPROVED' ?
            this.translateService.editManagement.messages.approvedMessage
            : this.translateService.editManagement.messages.submittedMessage
          this.finishEditMode();
        }else{
          this._router.navigate([], {
            queryParams: {
              editVersion:undefined
            },
            queryParamsHandling: "merge"
          });
          this.editProject();
        }
      })
    }

  getLanguagePlaceHolder(language:string){
      for(let lang of this.languages){
        if (lang.id == language){
          return lang.value;
        }
      }
      return "";
  }

  sanitizeUrls(urls:any, type:string):any{
    const sanitizedUrls: string[] = [];
    urls.forEach((url:string)=>{
      if (type == 'YOUTUBE'){
        sanitizedUrls.push(<string>this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://europa.eu/webtools/crs/iframe/?oriurl=https://www.youtube.com/embed/" +
          this.project.youtube_parser(url)));
      }
    });
    return sanitizedUrls;
  }

  openEditImg() {
    const dialogRef = this.dialog.open(ImageEditFormComponent, {
      data: {
        image_url: this.myForm.value.image_url,
        image_description: this.myForm.value.image_description,
        image_copyright: this.myForm.value.image_copyright
      }
    });
    dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe(result => {
      this.myForm.patchValue({
        image_url: result.image_url,
        image_description: result.image_description,
        image_copyright: result.image_copyright
      });
    });
  }
}
