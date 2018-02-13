import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../template/header/header.component';
import { FooterComponent } from '../template/footer/footer.component';
// Main Header Conmponent
import { MainHeaderComponent } from '../main/header/header.component';
import { MainFooterComponent } from '../main/footer/footer.component';
@Component({
	selector: 'app-ierror',
	templateUrl: './ierror.component.html',
	styleUrls: ['./ierror.component.css']
})
export class IerrorComponent implements OnInit {
	valid: string = '';
	constructor() {   	
		this.valid = localStorage.getItem('currentUser');
	}

	ngOnInit() {
	}

}
