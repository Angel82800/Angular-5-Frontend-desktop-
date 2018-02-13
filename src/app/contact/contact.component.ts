import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../template/header/header.component';
import {FooterComponent } from '../template/footer/footer.component';

// Component management
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

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
