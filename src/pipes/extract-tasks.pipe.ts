import { Pipe, PipeTransform } from '@angular/core';
import {
  ECadrartArticleFamily,
  ECadrartJobMeasureType,
  ECadrartJobOrientation,
  ICadrartJob,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils';

export interface ICadrartExtractedTask {
  id?: number;
  count?: number;
  description?: string;
  location?: string;
  measure?: ECadrartJobMeasureType;
  orientation?: ECadrartJobOrientation;
  glassHeight?: number;
  glassWidth?: number;
  openingHeight?: number;
  openingWidth?: number;
  marginHeight?: number;
  marginWidth?: number;
  article?: string;
  articlePlace?: string;
  comment?: string;
}

export interface ICadrartExtractedTasks {
  assembly: ICadrartExtractedTask[];
  cardboard: ICadrartExtractedTask[];
  glass: ICadrartExtractedTask[];
  pass: ICadrartExtractedTask[];
  wood: ICadrartExtractedTask[];
}

const mapping: Record<ECadrartArticleFamily, keyof ICadrartExtractedTasks> = {
  [ECadrartArticleFamily.ASSEMBLY]: 'assembly',
  [ECadrartArticleFamily.CARDBOARD]: 'cardboard',
  [ECadrartArticleFamily.GLASS]: 'glass',
  [ECadrartArticleFamily.PASS]: 'pass',
  [ECadrartArticleFamily.WOOD]: 'wood'
};

@Pipe({
  name: 'cadrartExtractTasks',
  standalone: true
})
export class CadrartExtractTasksPipe implements PipeTransform {
  transform(jobs: PartialDeep<ICadrartJob[]> | null): ICadrartExtractedTasks {
    let data: ICadrartExtractedTasks = {
      glass: [],
      wood: [],
      cardboard: [],
      assembly: [],
      pass: []
    };

    if (!jobs) {
      return data;
    }

    for (const job of jobs) {
      if (!job.tasks) {
        continue;
      }

      data = this.extractTasks(data, job, job.tasks);
    }

    return data;
  }

  extractTasks(
    data: ICadrartExtractedTasks,
    job: PartialDeep<ICadrartJob>,
    tasks: Array<PartialDeep<ICadrartTask>>
  ): ICadrartExtractedTasks {
    for (const task of tasks) {
      if (!task.article || !task.article.family) {
        continue;
      }

      const family: keyof ICadrartExtractedTasks = mapping[task.article.family];

      data[family] = [...data[family], this.mapTask(job, task)];

      if (task.children && task.children.length) {
        data = this.extractTasks(data, job, task.children);
      }
    }

    return Object.assign({}, data);
  }

  mapTask(job: PartialDeep<ICadrartJob>, task: PartialDeep<ICadrartTask>): ICadrartExtractedTask {
    return {
      id: task.id,
      count: job.count,
      description: job.description,
      location: job.location?.name,
      measure: job.measure,
      orientation: job.orientation,
      glassHeight: job.glassHeight,
      glassWidth: job.glassWidth,
      openingHeight: job.openingHeight,
      openingWidth: job.openingWidth,
      marginHeight: job.marginHeight,
      marginWidth: job.marginWidth,
      article: task.article?.name,
      articlePlace: task.article?.place,
      comment: task.comment
    };
  }
}
