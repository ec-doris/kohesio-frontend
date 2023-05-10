import {Component, Inject, LOCALE_ID, PLATFORM_ID} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";
import {UserService} from "../../../services/user.service";
import {isPlatformBrowser, Location, LocationStrategy} from "@angular/common";
import {User} from "../../../models/user.model";
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

  constructor(@Inject(LOCALE_ID) public locale: string,
              public locationStrategy: LocationStrategy,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object,
              public userService: UserService){

  }

  async ngOnInit(){

  }

  ngAfterViewInit(): void {
    /*this.userService.getUserDetails().subscribe((result:User)=>{
      if (result && result.id){
        this.logged = true;
        this.user = result;
      }
    });*/
  }

  onLoginBoxToggle(evt: MouseEvent) {
    //this.isLoginBoxActive = !this.isLoginBoxActive;
    evt.preventDefault();
  }

  getLoginBoxCssClasses(): string {
    return [
      'ecl-site-header__login-box',
      this.isLoginBoxActive ? 'ecl-site-header__login-box--active' : ''
    ].join(' ');
  }

  onOpenMenu(){
    this.opened = true;
  }

  onCloseMenu(){
    this.opened = false;
  }

}
