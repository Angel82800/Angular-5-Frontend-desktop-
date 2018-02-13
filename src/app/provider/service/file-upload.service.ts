import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Global from '../globals';

import 'rxjs/add/operator/map';

@Injectable()
export class FileUploadService {

	constructor(private http: Http) { }

	// get Image information
	index(img_id: number, width: number, height: number){
		return this.http.post(Global.API_URL + 'image/getwallpaperinfo',
		{
			image_id: img_id,
			width: width,
			height: height
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
		/*return this.http.get(Global.API_URL + 'image/' + img_id);*/
	}

	getGroup(user_id: number)
	{
		return this.http.post(Global.API_URL + 'image/getgroup',
		{
			user_id: user_id
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}
	// get User information
	getUserIndex(user_id: number){
		return this.http.get(Global.API_URL + 'user/profile/' + user_id);
	}

	// get Image Count
	getImageCount(){
		return this.http.get(Global.API_URL + 'imagecount');
	}

	// when like click
	like(img_id: number, user_id: number) {
		return this.http.get(Global.API_URL + 'image/like/' + img_id + '/' + user_id);
	}

	// report wallpaper
	report(image_id: number, category: string, content: string){

		return this.http.post(Global.API_URL + 'report',
		{
			image_id: image_id,
			category: category,
			content: content
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	// comment Operation
	newComment(stick: string, newcmt: string, image_id:number, author: number, parent_cmt_id: number) {
		return this.http.post(Global.API_URL + 'image/cmt',
		{
			image_id: image_id,
			author: author,
			parent_id: parent_cmt_id,
			stick: stick,
			newcmt: newcmt
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	getComment(img_id: number){
		return this.http.get(Global.API_URL + 'image/cmt/' + img_id);
	}

	// image Delete
	imageDelete(id: number) {
		return this.http.delete(Global.API_URL + 'image/' + id);
	}

	// social Operation
	shareSocial(category: string) {
		return this.http.get(Global.API_URL + 'share/' + category);
	}

	socialInvite(fullname: string, email: string, content: string) {
		return this.http.post(Global.API_URL + 'invite', {
			fullname: fullname,
			email: email,
			content: content
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	follow(follower_id: string, user_id: string) {
		return this.http.post(Global.API_URL + 'follow', {
			follower_id: follower_id,
			user_id: user_id
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	favoriteImage(activeData: any, favData: any, image_id: number, user_id: number) {
		return this.http.post(Global.API_URL + 'fav/' + image_id, {
			activeData: activeData,
			favData: favData,
			user_id: user_id
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	getFavInfo(img_id: number, user_id: number) {
		return this.http.get(Global.API_URL + 'fav/' + img_id + '/' + user_id);
	}

	favDelete(img_id: number, user_id: number) {
		return this.http.delete(Global.API_URL + 'fav/' + img_id + '/' + user_id);
	}

	imageEdit(image: any, tags: any, imgGroup: any) {
		return this.http.post(Global.API_URL + 'image/edit', {
			image: image,
			tags: tags,
			imgGroup: imgGroup
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});

	}

	avatar_change(avatar: string, id: number) {
		return this.http.post(Global.API_URL + 'user/avatar/change', {
			avatar: avatar,
			id: id
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	banner_change(banner: string, id: number) {
		return this.http.post(Global.API_URL + 'user/banner/change', {
			banner: banner,
			id: id
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	setUserInformation(user_id: any, first: string, last: string, email: string)
	{
		return this.http.post(Global.API_URL + 'user/setinfo', {
			user_id: user_id,
			first: first,
			last: last,
			email: email
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	setSocialInfo(user_id: any, facebook: string, twitter: string, google: string)
	{
		return this.http.post(Global.API_URL + 'user/setsocial', {
			user_id: user_id,
			facebook: facebook,
			twitter: twitter,
			google: google
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}	

	setPassword(user_id: any, password: string, newpassword: string)
	{
		return this.http.post(Global.API_URL + 'user/setpass', {
			user_id: user_id,
			original: password,
			new: newpassword
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	setAbout(user_id: any, about: string)
	{
		return this.http.post(Global.API_URL + 'user/setabout', {
			user_id: user_id,
			about: about
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	setPost(user_id: any, author_id: any, post: string)
	{
		return this.http.post(Global.API_URL + 'user/setpost', {
			user_id: user_id,
			author_id: author_id,
			post: post
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	sendDiamond(user_id: any, uploader_id: any, amount: any)
	{
		return this.http.post(Global.API_URL + 'image/senddiamond', {
			user_id: user_id,
			uploader_id: uploader_id,
			amount: amount
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	resize(img_id: number, width: number, height: number) {
		return this.http.post(Global.API_URL + 'image/resize', {
			img_id: img_id,
			width: width,
			height: height
		},
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	onGallery() {
		return this.http.get(Global.API_URL + 'image/gallery');
	}

	onCategory(name: string) {
		return this.http.get(Global.API_URL + 'image/category/' + name);
	}

	onGroup(group_name: string) {
		return this.http.get(Global.API_URL + 'image/group/' + group_name);
	}

	onSearchTag(tag: string) {
		return this.http.get(Global.API_URL + 'image/search/' + tag);
	}

	onGroups() {
		return this.http.get(Global.API_URL + 'image/groups');
	}

	groupfollow(group_id: number, user_id: number){
		return this.http.post(Global.API_URL + 'image/groupfollow', {
			group_id: group_id,
			user_id: user_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	setBlacklist(user_id: number, block_name: any){
		return this.http.post(Global.API_URL + 'user/block', {
			uid: user_id,
			block_name: block_name
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});
	}

	isBannedByImageID(user_id: any, image_id: any)
	{
		return this.http.post(Global.API_URL + 'user/isblockedbyimageid', {
			uid: user_id,
			block_name: image_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	isBanned(user_id: any, banner_id: any)
	{
		return this.http.post(Global.API_URL + 'user/isblocked', {
			uid: user_id,
			block_name: banner_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	getEmailInfo(user_id: any)
	{
		return this.http.post(Global.API_URL + 'user/getmaillist', {
			uid: user_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	addEmail(user_id: any, mail: any)
	{
		return this.http.post(Global.API_URL + 'user/addmail', {
			uid: user_id,
			mail: mail
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	resendEmail(user_id: any, mail: any)
	{
		return this.http.post(Global.API_URL + 'user/resendmail', {
			uid: user_id,
			mail: mail
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	removeEmail(user_id: any, mail: any)
	{
		return this.http.post(Global.API_URL + 'user/removemail', {
			uid: user_id,
			mail: mail
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	setPrimary(user_id: any, mail: any)
	{
		return this.http.post(Global.API_URL + 'user/setprimary', {
			uid: user_id,
			mail: mail
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	downloadImage(ip_address: any, user_id: any, image_id: any)
	{
		return this.http.post(Global.API_URL + 'image/download', {
			img_id: image_id,
			ip: ip_address,
			user_id: user_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	socialUpdate(ip_address: any, user_id: any, image_id: any)
	{
		return this.http.post(Global.API_URL + 'image/socialupdate', {
			img_id: image_id,
			ip: ip_address,
			user_id: user_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});	
	}

	isAvail(img_id: any)
	{
		return this.http.post(Global.API_URL + 'image/isavail', {
			img_id: img_id
		}, 
		{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})});		
	}
}
