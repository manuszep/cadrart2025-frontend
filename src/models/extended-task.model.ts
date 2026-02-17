import { ECadrartArticleFamily, ECadrartOfferStatus, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';

export class CadrartExtendedTask extends CadrartEntity<ICadrartExtendedTask> {
  // Task properties
  get taskComment(): string | null { return this._data.taskComment ?? null; }
  get taskTotal(): number | null { return this._data.taskTotal ?? null; }
  get taskImage(): string | null { return this._data.taskImage ?? null; }
  get taskDoneCount(): number | null { return this._data.taskDoneCount ?? null; }

  get parent(): number | CadrartExtendedTask | null {
    if (!this._data.parent) return null;
    return typeof this._data.parent === 'number'
      ? this._data.parent
      : new CadrartExtendedTask(this._data.parent as ICadrartExtendedTask);
  }

  // Job properties
  get jobId(): number | null { return this._data.jobId ?? null; }
  get jobTasks(): CadrartExtendedTask[] {
    return (this._data.jobTasks ?? []).map((task) => new CadrartExtendedTask(task));
  }
  get jobCount(): number | null { return this._data.jobCount ?? null; }
  get jobOrientation(): number | null { return this._data.jobOrientation ?? null; }
  get jobMeasure(): number | null { return this._data.jobMeasure ?? null; }
  get jobDueDate(): Date | null { return this._data.jobDueDate ?? null; }
  get jobStartDate(): Date | null { return this._data.jobStartDate ?? null; }
  get jobOpeningWidth(): number | null { return this._data.jobOpeningWidth ?? null; }
  get jobOpeningHeight(): number | null { return this._data.jobOpeningHeight ?? null; }
  get jobMarginWidth(): number | null { return this._data.jobMarginWidth ?? null; }
  get jobMarginHeight(): number | null { return this._data.jobMarginHeight ?? null; }
  get jobGlassWidth(): number | null { return this._data.jobGlassWidth ?? null; }
  get jobGlassHeight(): number | null { return this._data.jobGlassHeight ?? null; }
  get jobDescription(): string | null { return this._data.jobDescription ?? null; }
  get jobImage(): string | null { return this._data.jobImage ?? null; }
  get jobLocation(): string | null { return this._data.jobLocation ?? null; }

  // Article properties
  get articleId(): number | null { return this._data.articleId ?? null; }
  get articleName(): string | null { return this._data.articleName ?? null; }
  get articlePlace(): string | null { return this._data.articlePlace ?? null; }
  get articleFamily(): ECadrartArticleFamily | null { return this._data.articleFamily ?? null; }
  get articleOutOfStock(): boolean { return this._data.articleOutOfStock ?? false; }

  // Offer properties
  get offerId(): number | null { return this._data.offerId ?? null; }
  get offerStatus(): ECadrartOfferStatus | null { return this._data.offerStatus ?? null; }
  get assignedToId(): number | null { return this._data.assignedToId ?? null; }
  get assignedToFirstName(): string | null { return this._data.assignedToFirstName ?? null; }
  get assignedToLastName(): string | null { return this._data.assignedToLastName ?? null; }

  // Client properties
  get clientId(): number | null { return this._data.clientId ?? null; }
  get clientFirstName(): string | null { return this._data.clientFirstName ?? null; }
  get clientLastName(): string | null { return this._data.clientLastName ?? null; }
  get clientFullName(): string | null {
    const { clientFirstName: fn, clientLastName: ln } = this._data;
    return [fn, ln].filter(Boolean).join(' ') || null;
  }
}
