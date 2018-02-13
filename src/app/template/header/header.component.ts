import { ElementRef, Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';

import { NgForm } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute }  from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as NProgress from 'nprogress';


declare var jquery:any;
declare var $:any;

import { User } from './user.interface';

// import auth service
import { AuthService } from "../../provider/service/auth.service";
import * as Global from "../../provider/globals";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
    // dynamical Load Style
    loadAPI: Promise<any>;
    // Socail Infor
    socialfirstname: string;
    sociallastname: string;
    socialusername: string;
    socialemail: string;
    // -- End
    user: User;
    returnUrl: string;
    visible: boolean = true;
    confirmPassword: any;
    driver: string;  //social prvodier
    accessToken: string;
    providerId: string;
    constructor(private _elementRef: ElementRef, private authService: AuthService, private router: Router, 
    private route: ActivatedRoute, private toastrService: ToastrService, private _zone: NgZone) {
    }

    ngOnInit() {
        // dynamically Load Style
        this.loadAPI = new Promise((resolve) => {
            console.log('header loaded');
            Global.loadScript();
        });
        // initialize model here
        this.user = {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmpassword: ''
        }
        // reset login satus
        this.authService.logout();
        localStorage.removeItem('bot');
        localStorage.removeItem('reset');
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    @ViewChild('closeBtn') closeBtn: ElementRef;
    @ViewChild('loginBtn') loginBtn: ElementRef;
    @ViewChild('closeBtnLogin') closeBtnLogin: ElementRef;
    @ViewChild('signupBtn') signupBtn: ElementRef;

        // Custom Javascript code
    ngAfterViewInit() {
        var s = document.createElement("script");
        s.text = `
        function recaptchaCallback(){
            var testObject = {'verify': 1};
            localStorage.setItem('bot',JSON.stringify(testObject));
        }
        `;
        this._elementRef.nativeElement.appendChild(s);
    }
    // recaptcha
    handleCorrectCaptcha(){
        var testObject = {'verify': 1};
        localStorage.setItem('bot', JSON.stringify(testObject));
    }

    // Email Signup
    onSignup(model: User, isValid: boolean) {

        if(localStorage.getItem('bot'))
        {

            this.setLoading();
            this.visible = false;

            this.authService.signup(
                    model.firstname,
                    model.lastname,
                    model.username,
                    model.email,
                    model.password
                ).subscribe(
                    response => {
                        this.outLoading();

                        var temp = response.json();
                        localStorage.removeItem('bot');
                        this.toastrService.success("Successfully Registered! Next please check your email to confirm your identity and activate your account!");
                        this.loginBtn.nativeElement.click();
                    },
                    error => {
                        this.outLoading();

                        var temp = error.json();
                        console.log("Error", temp);
                        if(temp.username)
                        this.toastrService.warning(temp.username);
                        if(temp.email)
                        this.toastrService.warning(temp.email);
                    }
                );
        }
        else 
            this.toastrService.error("Error: Please complete the Captcha and prove you're a human!");
    }
    // --End Email Signup

    //---  Email Signin
    onSignin(form: NgForm) {
        this.setLoading();
        // set Progress
        NProgress.start();

        this.authService.signin(form.value.username, form.value.password)
            .subscribe(
                response => {
                    // set Progressbar to done
                    NProgress.done();
                    this.outLoading();
                    this.toastrService.success("Successfully logged in!");
                    this.closeBtnLogin.nativeElement.click();
                    let valid_user = Global.getUser();
                    this.router.navigate(['/profile/'+ valid_user.username]);
                },
                error => {
                    this.outLoading();
                    this.toastrService.warning(error.json().error);
                    form.reset();
                }
            );
    }
    // ---End Email Signin
    // Social Signup
    signup(category: string) {
        this.authService.loginWithSocial(category).then((data) => {
            // get social userinfo
            this.closeBtn.nativeElement.click();
            this.closeBtnLogin.nativeElement.click();
            console.log("_---source---",data);
            let user = data.user;
            let Name = user.displayName.split(" ");
            let firstname = Name[0]; let lastname = Name[1]; let email = user.email;
            this.socialemail = email;
            this.socialfirstname = firstname;
            this.sociallastname = lastname;
            this.accessToken = data.credential.accessToken;
            this.providerId = data.credential.providerId;
            // Server Request
            this.authService.SignupwithSocial(email, this.accessToken, this.providerId).subscribe(
                response => {
                    let currentUser = response.json().result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    this._zone.run(()=>{
                        this.router.navigate(['/profile/'+ currentUser.username]);
                    });
                    console.log(response);
                },
                error => {
                    this._zone.run(() =>{
                        this.driver = category;
                        let elem = <HTMLElement>document.querySelector('#setsocialBox');
                        elem.style.display = "block";
                    });
                    
                }
            );
        }/*, (error) => {
            alert(JSON.stringify(error));
        }*/);

    }
    // Social username and password setting
    setPass(form: NgForm){
        this.setLoading();
        console.log("**hi**", this.accessToken, this.providerId);
        this.authService.storesocial(
                this.socialfirstname, 
                this.sociallastname, 
                this.socialemail, 
                form.value.socialusername, 
                form.value.socialpassword,
                this.accessToken,
                this.providerId).subscribe(
            response => {
                this.outLoading();
                let currentUser = response.json().result;
                let elem = <HTMLElement>document.querySelector('#setsocialBox');
                elem.style.display = "none";
                this.toastrService.success("Success.");
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                form.reset();
                this._zone.run(() => {
                    this.router.navigate(['/profile/'+ currentUser.username]);
                });
                // this.loginBtn.nativeElement.click();
            },
            error => {
                this.outLoading();
                var erruser = error.json().username;
                var erremail = error.json().email;
                if(erruser)
                {
                    this.toastrService.error(erruser);
                }
                if(erremail)
                {
                    this.toastrService.error(erremail);
                }
            }
        );
    }
    // --End Social Signup

    // ForgotPassword
    onForgotPassword(form: NgForm) {
        this.setLoading();
        this.authService.forgotpassword(form.value.email).subscribe(
            response => {
                this.outLoading();
                this.toastrService.success(response.json().result);
                form.reset();
            },
            error => {
                this.outLoading();
                this.toastrService.error("Sorry. Server Error. Try Again Later");
                form.reset();
            }
        );
    }
    // -- End ForgotPassword

    // Forgot Username
    onForgotUsername(form: NgForm) {
        this.setLoading();
        this.authService.forgotusername(form.value.email).subscribe(
            response => {
                this.outLoading();
                this.toastrService.success(response.json().result);
                form.reset();
            },
            error => {
                this.outLoading();
                this.toastrService.error("Sorry. Server Error. Try Again Later.");
                form.reset();
            }
        );
    }
    // ----End Forgot Username

    // loading popup comes out
    setLoading() {
        let elem = <HTMLElement>document.querySelector('.loading');
        elem.style.display = "block";
    }
    outLoading() {
        let elem = <HTMLElement>document.querySelector('.loading');
        elem.style.display = "none";
    }
    // ---End Loading section

    resolved(captchaResponse: string) {
        console.log('Resolved captch with response ${captchaResponse}:');
    }

    // navigate page
    navigate(url) {
        $("#SignupBox").modal('hide');
        this.router.navigate(['/'+url]);
    }

}
