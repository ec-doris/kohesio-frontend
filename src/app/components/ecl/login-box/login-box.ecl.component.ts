import {Component, Inject, LOCALE_ID, PLATFORM_ID, ViewChild} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";
import {UserService} from "../../../services/user.service";
import {LocationStrategy} from "@angular/common";
import {User} from "../../../models/user.model";
import {CdkMenuTrigger} from "@angular/cdk/menu";
import {Router} from "@angular/router";
declare let ECL:any;

@Component({
    selector: 'kohesio-ecl-login-box',
    templateUrl: './login-box.ecl.component.html',
    styleUrls: ['./login-box.ecl.component.scss']
})
export class KohesioEclLoginBoxComponent {

  public logged:boolean = false;

  public isLoginBoxActive: boolean = false;

  public user?:User;
  public opened:boolean = false;

  @ViewChild(CdkMenuTrigger) cdkMenuTrigger?: CdkMenuTrigger;

  constructor(@Inject(LOCALE_ID) public locale: string,
              public locationStrategy: LocationStrategy,
              public translateService: TranslateService,
              public router: Router,
              @Inject(PLATFORM_ID) private platformId: Object,
              public userService: UserService){

  }

  ngOnInit(){

  }

  ngAfterViewInit(): void {
  }

  onOpenMenu(){
    this.opened = true;
  }

  onCloseMenu(){
    this.opened = false;
  }

  onMenuClick(router:string){
    this.cdkMenuTrigger?.close()
    this.router.navigate([router]);
  }

}
