import { Component, OnInit } from '@angular/core';
import * as Global from '../../provider/globals';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	loadAPI: Promise<any>;
    constructor() { }

    ngOnInit() {
        this.loadAPI = new Promise((resolve) => {
            console.log('resolving promise');
            Global.loadScript();
        });
    }
}
