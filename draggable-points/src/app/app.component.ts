import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

interface Position {
  left: number;
  top: number;
}

interface Size {
  width: number;
  height: number;
}

const minDistance = 0;
const popupWidth = 1;
const popupHeight = 1;

interface Popup {
  id?: number;
  anchorMouseOffset: Position;
  anchorPosition: Position;
  isConstrained: boolean;
  popupPosition: Position;
}

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
  public containerRef!: ElementRef;
  public containerSize: Size;
  public popupsSize: Size;

  @ViewChildren('popups') popupsRef: QueryList<ElementRef>;
  public popups: Popup[] = [];

  private currentId: string;

  constructor() {
    const popup: Popup = {
      anchorMouseOffset: {
        left: 0,
        top: 0,
      },
      anchorPosition: {
        left: 0,
        top: 0,
      },
      popupPosition: {
        left: 50,
        top: 50,
      },
      isConstrained: false
    };
  }

  public ngAfterViewInit(): void {
    // fetch the containers dimensions
    this.containerSize = {
      width: (this.containerRef.nativeElement as HTMLElement).clientWidth,
      height: (this.containerRef.nativeElement as HTMLElement).clientHeight,
    };
  }

  public addPopup(): void {
    this.popups.push({
      id: this.popups.length,
      anchorMouseOffset: {
        left: 0,
        top: 0,
      },
      anchorPosition: {
        left: 0,
        top: 0,
      },
      popupPosition: {
        left: 50,
        top: 50,
      },
      isConstrained: false,
    });
  }

  public handleMousedown(event: MouseEvent): void {
    this.currentId = (event.srcElement as HTMLElement).id;
    const popup: Popup = this.popups[this.currentId];
    const element: ElementRef = this.popupsRef
      .find((ref) => (ref.nativeElement as HTMLElement).id === this.currentId);

    // Canceling the mousedown event helps prevent native 'selection' and 'dragging'
    // behaviors in the browser.
    event.preventDefault();

    // Calculate the local position of the mouse, relative to the top-left corner of
    // the popup element. This will allows us to create a more natural drag-effect
    // by maintaining this local offset as we reposition the popup relative to the
    // mouse.
    var popupRect = element.nativeElement.getBoundingClientRect();
    popup.anchorMouseOffset.left = (event.clientX - popupRect.left);
    popup.anchorMouseOffset.top = (event.clientY - popupRect.top);

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
    const popup: Popup = this.popups[this.currentId];
    const element: ElementRef = this.popupsRef
      .find((ref) => (ref.nativeElement as HTMLElement).id === this.currentId);

    popup.anchorPosition.left = event.clientX - popup.anchorMouseOffset.left;
    popup.anchorPosition.top = event.clientY - popup.anchorMouseOffset.top;

    // In order to prevent the popup from being positioned outside of the container,
    // and knowing its dimensions, we can limit offsets as the popup 
    // approaches the edge of the ewport.
    var popupRect = element.nativeElement.getBoundingClientRect();
    var popupWidth = popupRect.width;
    var popupHeight = popupRect.height;

    // Let's calculate the constrained position of the popup relative to the
    // container (such that the popup doesn't overlap with the edge of the container).

    // minLeft & minTop are the distances to keep from the edges
    var maxLeft = (this.containerSize.width - popupWidth - minDistance);
    var maxTop = (this.containerSize.height - popupHeight - minDistance);

    // Make sure we don't go too far right or left.
    popup.popupPosition.left = Math.min(popup.anchorPosition.left, maxLeft);
    popup.popupPosition.left = Math.max(minDistance, popup.popupPosition.left);

    // Make sure we don't go too far down or up.
    popup.popupPosition.top = Math.min(popup.anchorPosition.top, maxTop);
    popup.popupPosition.top = Math.max(minDistance, popup.popupPosition.top);

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