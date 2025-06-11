import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cadrart-job-size',
  imports: [],
  templateUrl: './job-size.component.html',
  styleUrl: './job-size.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadrartJobSizeComponent {
  public width = input<number>();
  public height = input<number>();
}
