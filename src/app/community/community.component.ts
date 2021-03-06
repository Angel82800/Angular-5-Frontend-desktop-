import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../template/header/header.component';
import {FooterComponent } from '../template/footer/footer.component';

// Component management
@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit, AfterViewInit {
  
  constructor(private _elementRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    var s = document.createElement("script");
    s.text = `    
      $(function(){
          CateroryToggle();
          $('.pagination').rPage();
      });
    `;
    this._elementRef.nativeElement.appendChild(s);
  }

}
