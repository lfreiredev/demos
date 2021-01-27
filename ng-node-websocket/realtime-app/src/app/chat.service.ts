import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  public sendMessage(lat, lng) {
    this.socket.emit('new-message', { lat, lng });
  }

  public getMessages() {
    return new Observable((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }
}
