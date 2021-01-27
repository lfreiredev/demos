import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  messageList: string[] = [];

  lat = undefined;
  lng = undefined;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.sendMessage();
    this.chatService.getMessages().subscribe((message: any) => {
      this.messageList.push(message);
      this.lat = message.lat;
      this.lng = message.lng;
    });
  }

  sendMessage() {
    let coords = [
      [38.719961, -9.405623],
      [38.719925, -9.405897],
      [38.719745, -9.406273],
      [38.719661, -9.40681],
      [38.719284, -9.406869],
      [38.71861, -9.406668],
      [38.717498, -9.406258],
    ];

    coords.push(...coords);
    coords.push(...coords);
    coords.push(...coords);
    coords.push(...coords);

    for (let i = 0; i < coords.length; i++) {
      setTimeout(() => {
        this.chatService.sendMessage(coords[i][0], coords[i][1]);
      }, 500 * i);
    }
  }
}
