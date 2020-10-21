import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable } from 'rxjs';
import { findLocaleData } from '@angular/common/src/i18n/locale_data_api';
import { FunctionExpr } from '@angular/compiler';
import { ElementFinder } from 'protractor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Chat';
  public isClicked: any = [];
  addTaskValue = null;
  messages: any[] = [];
  users: Array<any> = [];
  receiver: any;
  sender: any;
  status: any;
  sadasd: any;
  already_exists: any;
  blocks: any = [];
  stickers = ['1.png', '2.png', '4.png', '5.png', '6.png', '7.png',
    '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png'];

  chat_history = {};



  constructor(
    private http: SocketService) { }

  off() {
    document.getElementById("overlay").style.display = "none";
  }

  ngOnInit() {

    this.initIoConnection();

    let modal = document.getElementById('myModal');
    let btn = document.getElementById("stickers_list");
    let span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;

    btn.onclick = function () {
      modal.style.display = "block";
    }

    span.onclick = function () {
      modal.style.display = "none";
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  getReceiver(user) {
    this.receiver = user;
    let check = document.getElementById(user);
    if (check == null) {
      this.blocks.push(user);
      // let div = document.createElement('div');
      // div.innerHTML =
      //   '<div id="'+ user + '" *ngSwitchCase="'+user+'"</div>';
      // document.getElementById('log').appendChild(div);
    }
    else { }

  }

  disconnect_user() {
    this.http.kick_out({ 'username': this.receiver });
  }

  submit_username(username) {
    this.http.send_username(username);
    this.sender = username;
  }

  send_private_message(message) {
    if (this.receiver == 'all') {
      this.http.broadcast_message({ 'username': this.receiver, 'from': this.sender, 'message': message });
      this.messages.push({ 'username': this.receiver, 'from': this.sender, 'data': message,'broadcast': 'true'
    });

    }
    else {
      this.http.private_message({ 'username': this.receiver, 'from': this.sender, 'message': message });
      this.messages.push({ 'username': this.receiver, 'from': this.sender, 'data': message, 'private': 'true' });

    }
    this.addTaskValue = null;
    // console.log(this.messages);
  }

  send_sticker(sticker) {
    this.http.send_sticker({ 'username': this.receiver, 'from': this.sender, 'message': sticker });
    if (this.receiver == 'all') {
      this.messages.push({ 'username': this.receiver, 'from': this.sender, 'sticker': sticker,'broadcast': 'true' });

    }
    else {
      this.messages.push({ 'username': this.receiver, 'from': this.sender, 'sticker': sticker,'private': 'true' });
  }
    
    // console.log(this.messages);
    document.getElementById('myModal').style.display = "none";

  }

  private initIoConnection(): void {

    this.http.initSocket();

    this.http.onSticker().subscribe((sticker: any) => {

     if (sticker.sender == this.sender){}
     else {this.messages.push(sticker);}

      let check = document.getElementById(sticker.sender);
      if (check == null) {
        this.blocks.push(sticker.sender);
        // let div = document.createElement('div');
        // div.innerHTML =
        //   '<div id="'+ sticker.sender + '"</div>';
        // document.getElementById('log').appendChild(div);
      }
      else { }

    });


    this.http.onMessage().subscribe((message: any) => {
      // console.log(message.sender);
      // let check = document.getElementById(message.sender);
      // console.log(check);
      if (document.getElementById(message.sender) == null) {
        this.blocks.push(message.sender);
        // console.log(this.blocks);
        // let div = document.createElement('div');
        // div.innerHTML =
        //   '<div id="'+ message.sender + '"</div>';
        // document.getElementById('log').appendChild(div);
      }


      if (message.data == "You were kicked") {
        document.body.innerHTML += '<div style="position:absolute;width:100%;\
      height:100%;opacity:1;z-index:100;background:#000; top:0; left: 0;">\
      <h1 style="color: white; margin: 0 auto; text-align: center;"> You were kicked out!</h1></div>';
      }
      else if (message.sender == this.sender){
      }

      else { this.messages.push(message);}
    });


    this.http.getUsers().subscribe((user: any) => {
      if (user.status) {
        this.status = user.status;
        this.users = user.data;
        // console.log(this.users);
      }
      else if (user.status1) {
        this.already_exists = user.status1;
        // console.log(this.already_exists);
        // console.log(user.status1);
      }
      else {
        this.users = user.data;
        // console.log(this.users);
      }
    });

  }
}