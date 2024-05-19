import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { Cell, Direction, Maze } from '../../core';
import { GameService } from '../../core/services/game-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-gameboard',
  standalone: true,
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.scss',
})
export class GameboardComponent implements OnInit, AfterViewInit {
  #destroyRef = inject(DestroyRef);
  row = 12;
  col = 12;
  cellSize = 20; // cell size
  private maze: Maze = {} as Maze;
  private canvas: HTMLCanvasElement = {} as HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell = {} as Cell;
  private calc = 0;

  private speed = 15;

  constructor(protected readonly gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.speed$.subscribe((speed) => {
      this.speed = speed;
    });
  }

  ngAfterViewInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('maze');
    // @ts-ignore
    this.ctx = this.canvas.getContext('2d');
    this.drawMaze();
  }

  private _listenDirectionChange(): void {
    this.gameService.directionState
      .pipe(
        tap((val: Direction) => (this.calc = this.calc + 1)),
        filter(() => !(this.calc % this.speed)),
        tap((val: Direction) => this.move(val)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  private _listenToReset(): void {
    this.gameService.notifyReset
      .pipe(
        tap(() => this.drawMaze()),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
    this._listenToReset();
    this._listenDirectionChange();
  }

  move(direction: Direction) {
    let nextCell: Cell = {} as Cell;
    if (direction === Direction.Left) {
      if (this.currentCell.col < 1) return;
      nextCell =
        this.maze.cells[this.currentCell.row][this.currentCell.col - 1];
    }
    if (direction === Direction.Right) {
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell =
        this.maze.cells[this.currentCell.row][this.currentCell.col + 1];
    }
    if (direction === Direction.Up) {
      if (this.currentCell.row < 1) return;
      nextCell =
        this.maze.cells[this.currentCell.row - 1][this.currentCell.col];
    }
    if (direction === Direction.Down) {
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell =
        this.maze.cells[this.currentCell.row + 1][this.currentCell.col];
    }

    this._handlePath(nextCell);
  }

  private _handlePath(nextCell: Cell): void {
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }
}
