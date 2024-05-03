import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { CameraFeedDirective } from '../../core/directives/camera-feed.directive';
import { HandDetectorDirective } from '../../core/directives/hand-detector.directive';
import { Direction } from '../../core/models/game.model';
import { GameService } from '../../core/services/game-service.service';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [AsyncPipe, CameraFeedDirective, HandDetectorDirective, NgClass],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamComponent {
  private cameraFeedInitializedInternal = false;
  private handDetectorInitializedInternal = false;
  private estimatedDirectionInternal?: Direction;

  @Output() detectedDirectionChange = new EventEmitter<Direction>();

  public get estimatedDirection(): Direction | undefined {
    return this.estimatedDirectionInternal;
  }

  public get cameraFeedInitialized() {
    return this.cameraFeedInitializedInternal;
  }

  public get handDetectorInitialized() {
    return this.handDetectorInitializedInternal;
  }

  constructor(private readonly gameService: GameService) {}

  public estimatedDirectionChange(direction: Direction): void {
    this.estimatedDirectionInternal = direction;
    this.gameService.setDirection(direction);
    this.detectedDirectionChange.emit(direction);
  }

  public detectorCreated(): void {
    this.handDetectorInitializedInternal = true;
  }

  public cameraFeedCreated(): void {
    this.cameraFeedInitializedInternal = true;
  }
}
