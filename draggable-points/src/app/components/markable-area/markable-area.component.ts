import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Popup } from 'src/app/models/popup';
import { Position } from 'src/app/models/position';
import { Size } from 'src/app/models/size';

const minDistance = 0;

interface SelectedPopup {
  popup: Popup;
  el: ElementRef;
}

@Component({
  selector: 'app-markable-area',
  styleUrls: ['./markable-area.component.scss'],
  templateUrl: './markable-area.component.html'
})
export class MarkableAreaComponent implements AfterViewInit {
  @Input() background: string;

  @ViewChild('containerRef') public containerRef: ElementRef;
  @ViewChildren('popups') popupsRef: QueryList<ElementRef>;

  public containerSize: Size;
  public containerPosition: Position;
  public popupsSize: Size;
  public initialPopupPosition: Position;
  public popups: Popup[] = [];

  private selectedPopup: SelectedPopup = {} as SelectedPopup;

  constructor() {}

  public ngAfterViewInit(): void {
    // fetch the containers dimensions
    this.containerSize = {
      width: (this.containerRef.nativeElement as HTMLElement).clientWidth,
      height: (this.containerRef.nativeElement as HTMLElement).clientHeight,
    };
    const containerPos = (this.containerRef.nativeElement as HTMLElement).getBoundingClientRect();
    this.containerPosition = {
      top: containerPos.top,
      left: containerPos.left,
    };

    this.initialPopupPosition = {
      top: containerPos.top + (containerPos.height / 2),
      left: containerPos.left + (containerPos.width / 2),
    };
  }

  public onClickContainer(): void {
    console.log('onClickContainer');
    this.selectedPopup = {} as SelectedPopup;
    this.popups.forEach(popup => popup.isSelected = false);
  }

  public onClickPopup(event: PointerEvent): void {
    event.stopPropagation();
  }

  public addPopup(): void {
    this.popups.push({
      id: this.popups.length === 0 ? 0 : this.popups[this.popups.length - 1].id + 1,
      anchorMouseOffset: {
        left: 0,
        top: 0,
      },
      anchorPosition: {
        left: 0,
        top: 0,
      },
      popupPosition: {
        top: this.initialPopupPosition.top,
        left: this.initialPopupPosition.left,
      },
      isConstrained: false,
      isSelected: false,
    });
  }

  public deletePopup(): void {
    if (this.selectedPopup && this.selectedPopup.popup) {
      this.delete(this.selectedPopup.popup.id);
    }
  }

  public handleDelete(event: number): void {
    this.delete(event);
  }

  public handleEdit(data: { id: number, el: ElementRef }): void {
    const popup: Popup = this.popups.find(popup => popup.id === data.id);
    this.popups.forEach(popup => popup.isSelected = false);
    popup.isSelected = true;
    this.selectedPopup = { 
      popup: popup,
      el: data.el
     };
  }

  private delete(id: number): void {
    let removeIndex = this.popups.map(item => item.id).indexOf(id);
    if (removeIndex >= 0) {
      this.popups.splice(removeIndex, 1);
    }
  }

  public handleMousedown(data: { event: MouseEvent, id: number, el: ElementRef }): void {
    if (!this.selectedPopup.popup || this.selectedPopup.popup.id !== data.id) {
      console.log('can\'t move');
      return;
    }

    // Canceling the mousedown event helps prevent native 'selection' and 'dragging'
    // behaviors in the browser.
    data.event.preventDefault();

    // Calculate the local position of the mouse, relative to the top-left corner of
    // the popup element. This will allows us to create a more natural drag-effect
    // by maintaining this local offset as we reposition the popup relative to the
    // mouse.
    var popupRect = ((data.el.nativeElement as HTMLElement).firstChild as HTMLElement).getBoundingClientRect();
    this.selectedPopup.popup.anchorMouseOffset.left = (data.event.clientX - popupRect.left);
    this.selectedPopup.popup.anchorMouseOffset.top = (data.event.clientY - popupRect.top);

    // PERFORMANCE NOTE: Since these events are being bound from within the NgZone,
    // it means that Angular will trigger a change-detection digest after each event.
    // If you wanted to have more control, you could bind these events outside of the
    // NgZone, and then dip back into the NgZone explicitly as needed. For the
    // purposes of this demo, I'm keeping things simple. Let's just let the digest
    // fire, as needed, since we're going to be updating the position a lot anyway.
    window.addEventListener('mousemove', this.handleMousemove);
    window.addEventListener('mouseup', this.handleMouseup);
  }

  public handleMousemove = (event: MouseEvent): void => {
    // Calculate the position of the anchor, by removing the anchor offset to the
    // x and y coordinates of the mouse. This will place the anchor in the same
    // place as the mouse.
    const popup: Popup = this.popups.find(popup => popup.id === this.selectedPopup.popup.id);
    const element: ElementRef = this.selectedPopup.el;

    popup.anchorPosition.left = event.clientX - popup.anchorMouseOffset.left;
    popup.anchorPosition.top = event.clientY - popup.anchorMouseOffset.top;

    // In order to prevent the popup from being positioned outside of the container,
    // and knowing its dimensions, we can limit offsets as the popup 
    // approaches the edge of the ewport.
    var popupRect = ((element.nativeElement as HTMLElement).firstChild as HTMLElement).getBoundingClientRect();
    var popupWidth = popupRect.width;
    var popupHeight = popupRect.height;

    // Let's calculate the constrained position of the popup relative to the
    // container (such that the popup doesn't overlap with the edge of the container).

    // minLeft & minTop are the distances to keep from the edges
    var maxLeft = (this.containerPosition.left + this.containerSize.width - popupWidth - minDistance);
    var maxTop = (this.containerPosition.top + this.containerSize.height - popupHeight - minDistance);

    // Make sure we don't go too far right or left.
    popup.popupPosition.left = Math.min(popup.anchorPosition.left, maxLeft);
    popup.popupPosition.left = Math.max(this.containerPosition.left + minDistance, popup.popupPosition.left);

    // Make sure we don't go too far down or up.
    popup.popupPosition.top = Math.min(popup.anchorPosition.top, maxTop);
    popup.popupPosition.top = Math.max(this.containerPosition.top + minDistance, popup.popupPosition.top);

    // Check to see if the popup position has been constrained.
    // If it has touched any of the edges of the container.
    popup.isConstrained =
      popup.popupPosition.left === ((this.containerRef.nativeElement as HTMLElement).clientLeft + minDistance) ||
      popup.popupPosition.left === maxLeft ||
      popup.popupPosition.top === ((this.containerRef.nativeElement as HTMLElement).clientTop + minDistance) ||
      popup.popupPosition.top === maxTop;
  }

  public handleMouseup = (): void => {
    window.removeEventListener('mousemove', this.handleMousemove);
    window.removeEventListener('mouseup', this.handleMouseup);
  }
}