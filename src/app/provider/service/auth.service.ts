import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {} from 'jwt-decode';
import * as Global from '../globals';

import 'rxjs/add/operator/map';

// import firebase auth
import { AngularFireAuth } from 'angularfire4/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
    result: any;
    constructor(private http: Http, public af: AngularFireAuth) {}
 
 /**    
 *    Social Login 
   */
    loginWithSocial(category: string) {
        switch(category) {
            case 'g': {
                this.result = this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
                break;
            }
            case 'f': {
                this.result = this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
                break;
            }
            case 't': {
                this.result = this.af.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
                break;
            }
            default: {
                break;
            }
        }
        return this.result;
    }
    /**
     * Signu Up with Social
     */
    SignupwithSocial(email: string, accessToken: string, providerId: string) {
        return this.http.post(Global.API_URL + 'oAuth', {
            email: email,
            accessToken: accessToken,
            providerId: providerId
        },
        {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
    }

    storesocial(
            firstname: string, 
            lastname: string, 
            email: string, 
            username: string, 
            password: string, 
            accessToken: string, 
            providerId: string) 
        {

            return this.http.post(Global.API_URL + 'oAuth/set', {
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                password: password,
                accessToken: accessToken,
                providerId: providerId
            },
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
    }

    /**
    * Signup for Email
    */
    signup(firstname: string, lastname: string, username: string, email: string, password: string) {
        return this.http.post(Global.API_URL + 'user',
            {
                firstname: firstname,
                lastname: lastname,
                username: username,
                email: email,
                password: password
            },
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
    }
    /**
    *    Change Password
    */
    changepass(password: string, confirm: string, token: string) {
        return this.http.post(Global.API_URL + 'changepassword',
        {
            password: password,
            token: token
        },
        {headers: new Headers({'X-Requested-with': 'XMLHttpRequest'})});
    }

    /**
    * Signin for Email
    */
    signin(username: string, password: string) {
        return this.http.post(Global.API_URL + 'user/signin',
            {
                username: username,
                password: password
            },
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})})
            .map(
                (response: Response) => {
                    let user = response.json().token;
                        console.log(user);
                        // localStorage.setItem('currentUser', JSON.stringify(user));
                        localStorage.setItem('currentUser', JSON.stringify(user));
                }
            );
    }

    /**
    *    Forgot Password
    */
    forgotpassword(email: string) {
        return this.http.post(Global.API_URL + 'forgotpassword', { email: email });
    }
    /**
    *    Forgot UserName
    */
    forgotusername(email: string) {
        return this.http.post(Global.API_URL + 'forgotusername', { email: email });
    }
    /**
    *  Get User Info
    */
    getUser(id: number) {
        return this.http.get(Global.API_URL + 'user/' + id);
    }
    /**
    *    Logout
    */
    logout() {
        console.log('logout');
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}