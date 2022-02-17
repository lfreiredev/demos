import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Popup } from 'src/app/models/popup';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() popup: Popup;
  @Input() disabled: boolean = false;

  @Output() mousedownEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter();
  @Output() editEvent: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  public handleMousedown(event: MouseEvent): void {
    this.mousedownEvent.emit({ event, id: this.popup.id, el: this.el });
  }

  public handleDelete(): void {
    this.deleteEvent.emit(this.popup.id);
  }

  public handleEdit(): void {
    this.editEvent.emit({ id: this.popup.id, el: this.el });
  }
}
