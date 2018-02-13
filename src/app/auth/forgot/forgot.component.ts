import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from "../../provider/service/auth.service";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit, OnDestroy {
	token: string;
	private sub: any;

  constructor(private route: ActivatedRoute, private authService: AuthService, private toastrService: ToastrService) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
  		this.token = this.route.snapshot.params['token'];
  	});
  }

  change(form: NgForm) {
  	this.authService.changepass(
  		form.value.password,
  		form.value.confirm,
  		this.token
  		).subscribe(
        response => {
          this.toastrService.success(response.json().result);
          location.assign('/index');
        },
        error => {
          this.toastrService.error("Sorry. Server Error. Try Again Later.");
          form.reset();
        }
      );
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  }

}
