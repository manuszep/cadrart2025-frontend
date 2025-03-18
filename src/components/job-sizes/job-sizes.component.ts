import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cadrart-job-sizes',
  imports: [],
  templateUrl: './job-sizes.component.html',
  styleUrl: './job-sizes.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadrartJobSizesComponent {
  public openingWidth = input<number>();
  public openingHeight = input<number>();
  public marginWidth = input<number>();
  public marginHeight = input<number>();
  public glassWidth = input<number>();
  public glassHeight = input<number>();
}
