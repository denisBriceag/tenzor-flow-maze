import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { GameService } from '../../core/services/game-service.service';

@Component({
  selector: 'app-control-buttons',
  standalone: true,
  imports: [NgIf, AsyncPipe, DecimalPipe],
  templateUrl: './control-buttons.component.html',
  styleUrl: './control-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlButtonsComponent {
  public get gameRunning(): boolean {
    return this.gameService.running;
  }

  @Input()
  public initialized = false;

  public constructor(readonly gameService: GameService) {}

  public startGame(): void {
    this.gameService.start();
  }

  public pauseGame(): void {
    this.gameService.pause();
  }

  public resetGame(): void {
    this.gameService.setNotifyReset();
  }

  increaseSpeed(): void {
    const speed = this.gameService.speed$.value;
    if (speed <= 2) return;
    this.gameService.speed$.next(speed - 2);
  }

  reduceSpeed(): void {
    const speed = this.gameService.speed$.value;
    if (speed > 18) return;
    this.gameService.speed$.next(speed + 2);
  }
}
