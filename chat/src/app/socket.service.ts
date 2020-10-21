import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private SERVER = 'http://10.1.1.230:5000/private';
  private socket;

  constructor() {
    this.socket = io(this.SERVER);
  }

  public initSocket(): void {
    this.socket = io(this.SERVER);
  }

  public private_message(payload: any): void {
    this.socket.emit('private_message', payload);
  }

  public broadcast_message(payload: any): void {
    this.socket.emit('broadcast_message', payload);
  }

  public send_sticker(payload: any): void {
    this.socket.emit('private_sticker', payload);
  }

  public send_username(username): void {
    this.socket.emit('username', username);
    console.log(username);
  }

  public kick_out(username): void {
    this.socket.emit('kick_out', username);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('new_private_message', (data: any) => observer.next(data));
    });
  }

  public onSticker(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('new_private_sticker', (data: any) => observer.next(data));
    });
  }

  public getUsers(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('my_users', (data) => observer.next(data));
    });
  }



}
