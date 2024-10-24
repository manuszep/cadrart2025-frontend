import { ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';

export class CadrartExtendedTask extends CadrartEntity<ICadrartExtendedTask> {
  get taskComment(): string | null {
    return this._data.taskComment ?? null;
  }

  get taskTotal(): number | null {
    return this._data.taskTotal ?? null;
  }

  get taskImage(): string | null {
    return this._data.taskImage ?? null;
  }

  get taskDoneCount(): number | null {
    return this._data.taskDoneCount ?? null;
  }

  get taskParentId(): number | null {
    return this._data.taskParentId ?? null;
  }

  get jobId(): number | null {
    return this._data.jobId ?? null;
  }

  get jobCount(): number | null {
    return this._data.jobCount ?? null;
  }

  get jobOrientation(): number | null {
    return this._data.jobOrientation ?? null;
  }

  get jobMeasure(): number | null {
    return this._data.jobMeasure ?? null;
  }

  get jobDueDate(): Date | null {
    return this._data.jobDueDate ?? null;
  }

  get jobStartDate(): Date | null {
    return this._data.jobStartDate ?? null;
  }

  get jobOpeningWidth(): number | null {
    return this._data.jobOpeningWidth ?? null;
  }

  get jobOpeningHeight(): number | null {
    return this._data.jobOpeningHeight ?? null;
  }

  get jobMarginWidth(): number | null {
    return this._data.jobMarginWidth ?? null;
  }

  get jobMarginHeight(): number | null {
    return this._data.jobMarginHeight ?? null;
  }

  get jobGlassWidth(): number | null {
    return this._data.jobGlassWidth ?? null;
  }

  get jobGlassHeight(): number | null {
    return this._data.jobGlassHeight ?? null;
  }

  get jobDescription(): string | null {
    return this._data.jobDescription ?? null;
  }

  get jobImage(): string | null {
    return this._data.jobImage ?? null;
  }

  get jobLocation(): string | null {
    return this._data.jobLocation ?? null;
  }

  get articleId(): number | null {
    return this._data.articleId ?? null;
  }

  get articleName(): string | null {
    return this._data.articleName ?? null;
  }

  get articlePlace(): string | null {
    return this._data.articlePlace ?? null;
  }

  get articleFamily(): number | null {
    return this._data.articleFamily ?? null;
  }

  get offerId(): number | null {
    return this._data.offerId ?? null;
  }

  get offerStatus(): number | null {
    return this._data.offerStatus ?? null;
  }

  get assignedToId(): number | null {
    return this._data.assignedToId ?? null;
  }

  get assignedToFirstName(): string | null {
    return this._data.assignedToFirstName ?? null;
  }

  get assignedToLastName(): string | null {
    return this._data.assignedToLastName ?? null;
  }

  get clientId(): number | null {
    return this._data.clientId ?? null;
  }

  get clientFirstName(): string | null {
    return this._data.clientFirstName ?? null;
  }

  get clientLastName(): string | null {
    return this._data.clientLastName ?? null;
  }
}
