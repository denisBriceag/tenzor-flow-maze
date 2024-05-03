import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {GameService} from "../../core/services/game-service.service";

@Component({
  selector: 'app-control-buttons',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './control-buttons.component.html',
  styleUrl: './control-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlButtonsComponent {
  public get gameRunning(): boolean {
    return this.gameService.running;
  }

  @Input()
  public initialized = false;

  public constructor(protected readonly gameService: GameService) {}

  public startGame(): void {
    this.gameService.start();
  }

  public pauseGame(): void {
    this.gameService.pause();
  }

  public resetGame(): void {
    this.gameService.setNotifyReset();
  }
}
