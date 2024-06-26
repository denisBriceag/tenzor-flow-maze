import {
  Coordinates,
  DEFAULT_DIRECTION, DEFAULT_GRID_SIZE,
  DEFAULT_SPEED,
  Direction, GameConfig,
  GameStatus,
  GridSize,
  Snake
} from "../models/game.model";
import {GameUtils} from "../utils/game.utils";

export abstract class GameBaseService {
  protected snake: Snake = new Snake([{ x: 0, y: 0 }], DEFAULT_DIRECTION);
  protected food: Coordinates = { x: 1, y: 0 };
  protected speed = DEFAULT_SPEED;
  protected direction: Direction = DEFAULT_DIRECTION;
  protected status = GameStatus.Initial;
  protected gridSizeInternal: GridSize = DEFAULT_GRID_SIZE;

  protected lastTick = 0;

  public get running(): boolean {
    return this.status === GameStatus.Running;
  }

  public abstract setup(config?: GameConfig): void;

  public abstract start(): void;

  public abstract setDirection(direction: Direction): void;

  public abstract pause(): void;

  protected randomCoordinates(avoidEdges?: boolean): Coordinates {
    let xMin = 0;
    let yMin = 0;
    let xMax = this.gridSizeInternal?.width - 1 || 9;
    let yMax = this.gridSizeInternal.height - 1 || 9;

    if (avoidEdges) {
      xMin++;
      yMin++;
      xMax--;
      yMax--;
    }
    const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;
    return {
      x,
      y,
    };
  }

  protected randomFoodCoordinates(): Coordinates {
    const randomCoordinates = this.randomCoordinates(true);
    return this.snake.segments.some((segment) =>
      GameUtils.arePointsEqual(randomCoordinates, segment),
    )
      ? this.randomFoodCoordinates()
      : randomCoordinates;
  }

  protected isOutsideOfBounds(points: Coordinates[]): boolean {
    return points.some((point) => this.isPointOutsideOfBounds(point));
  }

  protected isPointOutsideOfBounds(point: Coordinates): boolean {
    return (
      point.x < 0 ||
      point.x >= (this.gridSizeInternal?.width ?? 0) ||
      point.y < 0 ||
      point.y >= (this.gridSizeInternal?.height ?? 0)
    );
  }

  protected isPointOnSnake(position: Coordinates): boolean {
    return this.snake.segments.some((segment) => {
      return GameUtils.arePointsEqual(segment, position);
    });
  }
}
