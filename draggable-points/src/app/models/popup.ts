import { Position } from './position';

export interface Popup {
  id?: number;
  anchorMouseOffset: Position;
  anchorPosition: Position;
  popupPosition: Position;
  isConstrained: boolean;
  isSelected: boolean;
}