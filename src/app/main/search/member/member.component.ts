import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import * as Global from '../../../provider/globals';

// Component management
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit, AfterViewInit {
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
          $('.pagination').rPage();
      });
    `;
    this._elementRef.nativeElement.appendChild(s);
  }
}
