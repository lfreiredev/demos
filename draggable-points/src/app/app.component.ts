import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface Position {
  left: number;
  top: number;
}

interface Size {
  width: number;
  height: number;
}

const minDistance = 10;
const popupWidth = 100;
const popupHeight = 50;

@Component({
  selector: 'app-root',
  queries: {
    anchorRef: new ViewChild('anchorRef'),
    popupRef: new ViewChild('popupRef'),
    containerRef: new ViewChild('containerRef'),
  },
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  // offset of the mouse relative to the popup
  public anchorMouseOffset: Position;
  public anchorPosition: Position;
  public isConstrained: boolean;
  public popupPosition: Position;
  public popupRef!: ElementRef;
  public containerRef!: ElementRef;
  public containerSize: Size;
  public popupsSize: Size;

  constructor() {
    this.anchorMouseOffset = {
      left: 0,
      top: 0
    };
    this.isConstrained = false;
  }

  public ngAfterViewInit(): void {
    // fetch the containers dimensions
    this.containerSize = {
      width: (this.containerRef.nativeElement as HTMLElement).clientWidth,
      height: (this.containerRef.nativeElement as HTMLElement).clientHeight,
    };

    setTimeout(() => {
      // place the popup in the middle of the container
      this.popupPosition = {
        left: this.containerSize.width / 2 - popupWidth / 2,
        top: this.containerSize.height / 2 - popupHeight / 2
      };

      // place the anchor in the same place as the container
      this.anchorPosition = this.popupPosition;
    });
  }

  public addPopup(): void {
    console.log('add popup');
  }

  public handleMousedown(event: MouseEvent): void {
    // Canceling the mousedown event helps prevent native 'selection' and 'dragging'
    // behaviors in the browser.
    event.preventDefault();

    // Calculate the local position of the mouse, relative to the top-left corner of
    // the popup element. This will allows us to create a more natural drag-effect
    // by maintaining this local offset as we reposition the popup relative to the
    // mouse.
    var popupRect = this.popupRef.nativeElement.getBoundingClientRect();
    this.anchorMouseOffset.left = (event.clientX - popupRect.left);
    this.anchorMouseOffset.top = (event.clientY - popupRect.top);

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
    this.anchorPosition.left = event.clientX - this.anchorMouseOffset.left;
    this.anchorPosition.top = event.clientY - this.anchorMouseOffset.top;

    // In order to prevent the popup from being positioned outside of the container,
    // and knowing its dimensions, we can limit offsets as the popup 
    // approaches the edge of the ewport.
    var popupRect = this.popupRef.nativeElement.getBoundingClientRect();
    var popupWidth = popupRect.width;
    var popupHeight = popupRect.height;

    // Let's calculate the constrained position of the popup relative to the
    // container (such that the popup doesn't overlap with the edge of the container).

    // minLeft & minTop are the distances to keep from the edges
    var maxLeft = (this.containerSize.width - popupWidth - minDistance);
    var maxTop = (this.containerSize.height - popupHeight - minDistance);

    // Make sure we don't go too far right or left.
    this.popupPosition.left = Math.min(this.anchorPosition.left, maxLeft);
    this.popupPosition.left = Math.max(minDistance, this.popupPosition.left);

    // Make sure we don't go too far down or up.
    this.popupPosition.top = Math.min(this.anchorPosition.top, maxTop);
    this.popupPosition.top = Math.max(minDistance, this.popupPosition.top);

    // Check to see if the popup position has been constrained.
    // If it has touched any of the edges of the container.
    this.isConstrained =
      this.popupPosition.left === ((this.containerRef.nativeElement as HTMLElement).clientLeft + minDistance) ||
      this.popupPosition.left === maxLeft ||
      this.popupPosition.top === ((this.containerRef.nativeElement as HTMLElement).clientTop + minDistance) ||
      this.popupPosition.top === maxTop;
  }

  public handleMouseup = (): void => {
    window.removeEventListener('mousemove', this.handleMousemove);
    window.removeEventListener('mouseup', this.handleMouseup);
  }
}