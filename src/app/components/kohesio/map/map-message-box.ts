import {Component} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-map-message-box',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        display: 'none',
        opacity: 0
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: 'map-message-box.html',
  styleUrls: ['map-message-box.scss']
})
export class MapMessageBoxComponent {
  isOpen = false;
  timeoutFunction:any;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  open(){
    this.isOpen = true;
    clearTimeout(this.timeoutFunction);
    this.timeoutFunction = setTimeout(() => {
      this.close();
    }, 3000);;
  }

  close(){
    this.isOpen = false;
  }

}
