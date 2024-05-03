import { Injectable, NgZone, signal, WritableSignal } from '@angular/core';
import {
  Coordinates,
  DEFAULT_GRID_SIZE,
  DEFAULT_SPEED,
  Direction,
  GameConfig,
  GameState,
  GameStatus,
  GridSize,
  Snake,
} from '../models/game.model';
import { GameBaseService } from './game-base.service';
import { GameUtils } from '../utils/game.utils';
import { Maze } from '../models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService extends GameBaseService {
  // TODO ADD SPEED
  readonly #cols: number = 20;
  readonly #rows: number = 20;
  readonly #cellSize: number = 20;

  #notifyReset: Subject<void> = new Subject<void>();

  #directionState: Subject<Direction> = new Subject<Direction>();

  state = signal<GameState>({
    snake: this.snake,
    food: this.food,
    status: this.status,
  });

  get notifyReset(): Observable<void> {
    return this.#notifyReset.asObservable();
  }

  get directionState(): Observable<Direction> {
    return this.#directionState.asObservable();
  }

  setDirectionState(direction: Direction) {
    this.#directionState.next(direction);
  }

  public gridSize = signal<GridSize>(this.gridSizeInternal);

  public constructor(private readonly _zone: NgZone) {
    super();
  }

  setNotifyReset() {
    this.#notifyReset.next();
  }

  public setup(config?: GameConfig): void {
    this.gridSizeInternal = config?.gridSize
      ? config.gridSize
      : DEFAULT_GRID_SIZE;

    this.gridSize.set(this.gridSizeInternal);

    this.snake = config?.snake
      ? config.snake
      : new Snake([this.randomCoordinates()]);

    if (this.isOutsideOfBounds(this.snake.segments)) {
      console.warn(
        'Provided snake position was outside of bounds, resetting to a random position.',
      );
      this.snake.segments = [this.randomCoordinates()];
    }

    this.food = config?.food ? config.food : this.randomFoodCoordinates();

    if (
      this.isPointOutsideOfBounds(this.food) ||
      this.isPointOnSnake(this.food)
    ) {
      console.warn(
        'Provided food position was outside of bounds or on a snake, resetting to a random position.',
      );
      this.food = this.randomFoodCoordinates();
    }

    this.speed = config?.initialSpeed ? config.initialSpeed : DEFAULT_SPEED;

    this.status = GameStatus.Initial;

    this.state.set({
      snake: this.snake,
      food: this.food,
      status: this.status,
    });
  }

  public start(): void {
    this.status = GameStatus.Running;
    this.tick(0);
  }

  public setDirection(direction: Direction): void {
    if (this.snake.tail) {
      if (GameUtils.areDirectionsOpposite(direction, this.snake.direction)) {
        return;
      }
    }
    this.direction = direction;
  }

  public pause(): void {
    this.status = GameStatus.Paused;
    this.state.set({
      snake: this.snake,
      food: this.food,
      status: this.status,
    });
  }

  private tick(timestamp: number): void {
    if (this.status !== GameStatus.Running) {
      return;
    }
    if (timestamp - this.lastTick >= 1000 / this.speed) {
      this.lastTick = timestamp;
      this.moveSnake();
    }
    requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  private moveSnake(): void {
    this._zone.runOutsideAngular(() => {
      const directionCoordinates = GameUtils.directionToCoordinates(
        this.direction,
      );
      const newHead: Coordinates = {
        x: this.snake.head.x + directionCoordinates.x,
        y: this.snake.head.y + directionCoordinates.y,
      };

      this.snake.direction = this.direction;

      if (
        this.isPointOutsideOfBounds(newHead) ||
        this.isPointOnSnake(newHead)
      ) {
        this.status = GameStatus.GameOver;
        this.state.set({
          snake: this.snake,
          food: this.food,
          status: this.status,
        });
        return;
      }

      const isEatingFood = GameUtils.arePointsEqual(newHead, this.food);

      if (isEatingFood) {
        this.snake.segments.push(
          this.snake.segments[this.snake.segments.length - 1],
        );
      }
      this.snake.segments.pop();
      this.snake.segments.unshift(newHead);

      if (isEatingFood) {
        this.food = this.randomFoodCoordinates();
      }

      this.state.set({
        snake: this.snake,
        food: this.food,
        status: this.status,
      });
    });
  }

  initCanvas(
    maze: Maze,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ): void {
    maze = new Maze(this.#rows, this.#cols, this.#cellSize, ctx);
    canvas.width = this.#cols * this.#cellSize;
    canvas.height = this.#cols * this.#cellSize;
    maze.draw();
  }
}
