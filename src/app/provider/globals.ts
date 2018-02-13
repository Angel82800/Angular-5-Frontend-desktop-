import { AuthService } from './service/auth.service';

'use strict';

// export const API_URL: string = 'http://dn-api.us-east-1.elasticbeanstalk.com/api/';
export const API_URL: string = 'http://localhost:8083/api/';
export const s3Url: string = 'https://s3.amazonaws.com/uploadwallpaper/';
export const s3Url_wallpaper: string = 'https://s3.amazonaws.com/gettestimage/';
export const wallpaper: string = 'http://localhost:4200/#/wallpaper/';
export const profile: string = 'http://localhost:4200/#/profile/';
// export const wallpaper: string = 'http://beta.desktopnexus.com/wallpaper/';
// export const profile: string = 'http://beta.desktopnexus.com/profile/';
// export user: any = [];


export function getUser() {
	let storageUser = localStorage.getItem('currentUser');
	let user = JSON.parse(storageUser);
	return user;
}

export function loadScript() {
	// script dynamic loading on Component load
	let arr = ["https://www.google.com/recaptcha/api.js", "assets/js/dropzone.min.js"];
	for(var i=0; i<arr.length; i++)
	{
		let node = document.createElement('script');
		node.src = arr[i];
		node.async = true;
		node.charset = 'utf-8';
		document.getElementsByTagName('head')[0].appendChild(node);		
	}
}

export function setLoading() {
    let elem = <HTMLElement>document.querySelector('.loading');
    elem.style.display = "block";
}

export function outLoading() {
    let elem = <HTMLElement>document.querySelector('.loading');
    elem.style.display = "none";
}

export function setApp() {
	let elem = <HTMLElement>document.querySelector('app-root');
    elem.style.display = "none";	
}

export function outApp() {
	let elem = <HTMLElement>document.querySelector('app-root');
    elem.style.display = "block";	
}
