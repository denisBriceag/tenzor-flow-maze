import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {HandDetectorDirective} from "../../../core/directives/hand-detector.directive";
import {CameraFeedDirective} from "../../../core/directives/camera-feed.directive";
import {Direction} from "../../../core/models/game.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'snake-instructions',
  standalone: true,
  imports: [CommonModule, NgClass, CameraFeedDirective, HandDetectorDirective],
  templateUrl: './instructions-modal.component.html',
  styleUrls: ['instructions-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionsModalComponent {
  @ViewChild('scrollContainer', { static: true }) scrollContainer?: ElementRef;

  private _controlsInitializedInternal = false;

  constructor(@Inject(MAT_DIALOG_DATA) protected readonly data: {show: boolean}, private readonly _dialogRef: MatDialogRef<InstructionsModalComponent>) {
  }

  get controlsInitialized(): boolean {
    return this._controlsInitializedInternal;
  }

  close(): void {
    this._dialogRef.close();
  }

  public directionChange(direction: Direction): void {
    if (direction === Direction.Right) {
      this._controlsInitializedInternal = true;
    }
  }

  public play(): void {
    sessionStorage.setItem('controlsInitialized', 'true');
    this._dialogRef.close();
  }
}
