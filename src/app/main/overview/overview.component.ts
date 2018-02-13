import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import * as Global from '../../provider/globals';

// Component management
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverViewComponent implements OnInit, AfterViewInit {
    loadAPI: Promise<any>;
    constructor(private _elementRef: ElementRef) { }

    ngOnInit() {
        this.loadAPI = new Promise((resolve) => {
            console.log('resolving promise');
            Global.loadScript();
        });
    }
    ngAfterViewInit() {
      var s = document.createElement("script");
      s.text = `    
          $(function(){
              GalleryGrid();
          });
      `;
      this._elementRef.nativeElement.appendChild(s);
    }
}
