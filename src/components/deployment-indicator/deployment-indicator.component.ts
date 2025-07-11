import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CadrartVersionService, IVersionInfo } from '../../services/version.service';

@Component({
  selector: 'app-deployment-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deployment-indicator.component.html',
  styleUrl: './deployment-indicator.component.scss'
})
export class DeploymentIndicatorComponent implements OnInit, OnDestroy {
  versionInfo: IVersionInfo | null = null;
  private subscription: Subscription | null = null;

  constructor(private versionService: CadrartVersionService) {}

  ngOnInit(): void {
    // Fetch version info immediately and then every 30 seconds
    this.subscription = interval(30000)
      .pipe(switchMap(() => this.versionService.getVersionInfo()))
      .subscribe({
        next: (info) => {
          this.versionInfo = info;
        },
        error: (error) => {
          console.warn('Failed to fetch version info:', error);
        }
      });

    // Initial fetch
    this.versionService.getVersionInfo().subscribe({
      next: (info) => {
        this.versionInfo = info;
      },
      error: (error) => {
        console.warn('Failed to fetch initial version info:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
