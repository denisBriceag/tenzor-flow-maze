import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControllerComponent } from '../../../controller/controller.component';
import { CableComponent } from './cable/cable.component';
import { MatDialog } from '@angular/material/dialog';
import { WebcamComponent } from '../../../controller/webcam/webcam.component';
import { InstructionsModalComponent } from '../instructions-modal/instructions-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { GameService } from '../../../core/services/game-service.service';
import { storageSignal } from '../../../core/utils/storage.util';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ControllerComponent, CableComponent],
  template: `
    <div class="board">
      <router-outlet></router-outlet>
    </div>

    <app-cable></app-cable>
    <app-controller></app-controller>
  `,
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @ViewChild(WebcamComponent) webcamComponent?: WebcamComponent;

  public get controlsInitialized(): boolean {
    return !!(
      this.webcamComponent?.cameraFeedInitialized &&
      this.webcamComponent?.handDetectorInitialized
    );
  }

  public constructor(
    private readonly _gameService: GameService,
    private readonly _overlay: Overlay,
    private readonly _dialog: MatDialog,
  ) {
    this._gameService.setup({
      gridSize: { width: 22, height: 12 },
    });
    if (sessionStorage.getItem('controlsInitialized') !== 'true') {
      this.openInstructions();
    }
  }

  private openInstructions(): void {
    this._dialog.open(InstructionsModalComponent, {
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });
  }
}
