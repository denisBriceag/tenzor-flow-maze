import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { WebcamComponent } from './webcam/webcam.component';
import { ArrowsComponent } from './arrows/arrows.component';
import { ControlButtonsComponent } from './control-buttons/control-buttons.component';
import { MatDialog } from '@angular/material/dialog';
import { InstructionsModalComponent } from '../shared/components/instructions-modal/instructions-modal.component';
import { Direction } from '../core/models/game.model';
import { GameService } from '../core/services/game-service.service';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    CommonModule,
    ArrowsComponent,
    WebcamComponent,
    ControlButtonsComponent,
    OverlayModule,
  ],
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControllerComponent {
  private directionInternal: Direction = Direction.Right;

  constructor(
    private readonly _overlay: Overlay,
    private readonly _dialog: MatDialog,
    private readonly _gameService: GameService,
  ) {}

  public get direction(): Direction {
    return this.directionInternal;
  }

  public directionChange(direction: Direction): void {
    this.directionInternal = direction;
    this._gameService.setDirectionState(direction);
  }

  public showInstructions(): void {
    this._dialog.open(InstructionsModalComponent, {
      scrollStrategy: this._overlay.scrollStrategies.block(),
      data: { show: false },
    });
  }
}
