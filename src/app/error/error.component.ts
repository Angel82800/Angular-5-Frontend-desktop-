import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../template/header/header.component';
import { FooterComponent } from '../template/footer/footer.component';
// Main Header Conmponent
import { MainHeaderComponent } from '../main/header/header.component';
import { MainFooterComponent } from '../main/footer/footer.component';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  valid: string = '';
  constructor() {   	
  	this.valid = localStorage.getItem('currentUser');
  }

  ngOnInit() {
  }

}
