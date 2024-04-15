import {AfterViewInit, Component } from '@angular/core';
import {NotificationService} from "../../../services/notification.service";
import {Notification} from "../../../models/notification.model";
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {Edit} from "../../../models/edit.model";
import {forkJoin} from "rxjs";
import {ProjectService} from "../../../services/project.service";
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './notifications-dashboard.component.html',
    styleUrls: ['./notifications-dashboard.component.scss']
})
export class NotificationsDashboardComponent implements AfterViewInit {

    public notificationList?:Notification[];
    public myForm!: UntypedFormGroup;
    public isLoading = false;

    public filters:any = {
    };
    public filtersCount?:number;

    constructor(private notificationService: NotificationService,
                private userService: UserService,
                private projectService: ProjectService,
                private formBuilder: UntypedFormBuilder,
                private translateService: TranslateService){
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
      this.isLoading = true;
      this.notificationList = [];
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
        if (notifications && notifications.length) {
          const projectObservables: any[] = [];
          notifications.forEach((notification: Notification) => {
            projectObservables.push(this.projectService.getProjectDetail(notification.operation_qid));
            const status = notification.notification_type.replace("EDIT_","").toLowerCase();
            notification.notification_type = this.translateService.editManagement.status[status];
          })
          forkJoin(projectObservables).subscribe((results: any) => {
            results.forEach((result: any, index: number) => {
              if (result && result.program && result.program.length) {
                notifications[index].projectTitle = result.label;
              }
            })
            this.notificationList = notifications;
            this.isLoading = false;
          })
        }else{
          this.isLoading = false;
        }
      })
    }

    markAsRead(notification:Notification){
      this.notificationService.markAsRead(notification.notification_id).subscribe((result:boolean)=>{
        this.getNotificationList();
        this.userService.getCurrentUser().subscribe();
      })
    }

}
