import {AfterViewInit, Component } from '@angular/core';
import {NotificationService} from "../../../services/notification.service";
import {Notification} from "../../../models/notification.model";
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";

@Component({
    templateUrl: './notifications-dashboard.component.html',
    styleUrls: ['./notifications-dashboard.component.scss']
})
export class NotificationsDashboardComponent implements AfterViewInit {

    public notificationList?:Notification[];
    public myForm!: UntypedFormGroup;

    public filters:any = {
    };
    public filtersCount?:number;

    constructor(private notificationService: NotificationService,
                private userService: UserService,
                private formBuilder: UntypedFormBuilder){
    }

    ngOnInit(){
      this.getNotificationList();
      this.myForm = this.formBuilder.group({
        'seen': new FormControl("unread"),
      })
      this.onFormChanges();
    }

    onFormChanges(): void {
      this.myForm.valueChanges.subscribe(val => {
        this.getNotificationList();
      });
    }

    ngAfterViewInit(): void {
    }

    getNotificationList(){
      let seen:boolean|undefined = undefined;
      if (this.myForm) {
        if (this.myForm.value.seen == 'unread') {
          seen = false;
        } else if (this.myForm.value.seen == 'read') {
          seen = true;
        }
      }else{
        seen = false;
      }
      this.notificationService.getNotifications(seen).subscribe((notifications:Notification[])=>{
        this.notificationList = notifications;
      })
    }

    markAsRead(notification:Notification){
      this.notificationService.markAsRead(notification.notification_id).subscribe((result:boolean)=>{
        this.getNotificationList();
        this.userService.getCurrentUser().subscribe();
      })
    }

}
