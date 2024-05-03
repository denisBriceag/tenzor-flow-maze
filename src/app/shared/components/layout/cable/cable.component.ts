import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cable',
  standalone: true,
  styleUrl: 'cable.component.scss',
  template: `
    <div class="top"></div>
    <div class="middle"></div>
    <div class="bottom"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CableComponent {
}
