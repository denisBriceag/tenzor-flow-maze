import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {Direction} from "../../core/models/game.model";

@Component({
  selector: 'app-arrows',
  standalone: true,
  imports: [],
  templateUrl: './arrows.component.html',
  styleUrl: './arrows.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrowsComponent {
  private directionClassInternal: 'up' | 'down' | 'left' | 'right' = 'right';

  @HostBinding('class')
  public get directionClass(): string {
    return `direction--${this.directionClassInternal}`;
  }

  @Input()
  public set direction(direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.directionClassInternal = 'up';
        break;
      case Direction.Down:
        this.directionClassInternal = 'down';
        break;
      case Direction.Left:
        this.directionClassInternal = 'left';
        break;
      case Direction.Right:
        this.directionClassInternal = 'right';
        break;
    }
  }
}
