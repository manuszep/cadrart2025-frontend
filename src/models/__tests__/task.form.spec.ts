import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ECadrartArticlePriceMethod, ICadrartArticle, ICadrartTask } from '@manuszep/cadrart2025-common';
import { IEsfsDropdownOption } from '@manuszep/es-form-system';

import { CadrartArticleService } from '../../services/article.service';
import { CadrartTaskForm } from '../task.form';

class MockArticleService {
  getEntitiesAsOptions(): Observable<IEsfsDropdownOption<ICadrartArticle | undefined>[]> {
    return of([]);
  }

  getCombinableAsOptions(): Observable<IEsfsDropdownOption<ICadrartArticle | undefined>[]> {
    return of([]);
  }
}

describe('CadrartTaskForm', () => {
  let articleService: CadrartArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CadrartArticleService, useClass: MockArticleService }]
    });

    articleService = TestBed.inject(CadrartArticleService);
  });

  it('should create an instance', () => {
    const taskForm = new CadrartTaskForm(articleService);
    expect(taskForm).toBeTruthy();
  });

  describe('updatePrice', () => {
    let taskForm: CadrartTaskForm;

    beforeEach(() => {
      taskForm = new CadrartTaskForm(articleService);
    });

    it('should do nothing if no article is set', () => {
      // Act
      taskForm.updatePrice(100, 100, 10000, 0, 21);

      // Assert
      expect(taskForm.getTotal().value).toBe(0);
    });

    it('should calculate price by length', () => {
      // Setup
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 10,
        maxReduction: 50
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Act
      taskForm.updatePrice(100, 100, 10000, 0, 21);

      // Assert
      expect(taskForm.getTotalBeforeReduction().value).toBe(1000); // 10 * 100
      expect(taskForm.getTotal().value).toBe(1000); // No reduction
      expect(taskForm.getTotalWithVat().value).toBe(1210); // 1000 * 1.21
    });

    it('should calculate price by area', () => {
      // Setup
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
        sellPrice: 0.5,
        maxReduction: 50
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Act
      taskForm.updatePrice(100, 100, 10000, 0, 21);

      // Assert
      expect(taskForm.getTotalBeforeReduction().value).toBe(5000); // 0.5 * 10000
      expect(taskForm.getTotal().value).toBe(5000); // No reduction
      expect(taskForm.getTotalWithVat().value).toBe(6050); // 5000 * 1.21
    });

    it('should apply reduction', () => {
      // Setup
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 10,
        maxReduction: 50
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Act
      taskForm.updatePrice(100, 100, 10000, 20, 21);

      // Assert
      expect(taskForm.getTotalBeforeReduction().value).toBe(1000); // 10 * 100
      expect(taskForm.getTotal().value).toBe(800); // 1000 - 20%
      expect(taskForm.getTotalWithVat().value).toBe(968); // 800 * 1.21
    });

    it('should limit reduction to maxReduction', () => {
      // Setup
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 10,
        maxReduction: 30
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Act
      taskForm.updatePrice(100, 100, 10000, 40, 21);

      // Assert
      expect(taskForm.getTotalBeforeReduction().value).toBe(1000); // 10 * 100
      expect(taskForm.getTotal().value).toBe(700); // 1000 - 30% (limited by maxReduction)
      expect(taskForm.getTotalWithVat().value).toBe(847); // 700 * 1.21
    });

    it('should calculate sub-task totals', () => {
      // Setup parent task
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 10,
        maxReduction: 50
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Create a child task
      taskForm.addSubTask();
      const childTask = taskForm.getChildren().controls[0];
      const childArticle: Partial<ICadrartArticle> = {
        name: 'Child Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 5,
        maxReduction: 50
      };
      childTask.getArticle().setValue(childArticle as ICadrartArticle);

      // Act
      taskForm.updatePrice(100, 100, 10000, 0, 21);

      // Assert parent task
      expect(taskForm.getTotalBeforeReduction().value).toBe(1000); // 10 * 100
      expect(taskForm.getTotal().value).toBe(1000); // No reduction

      // Assert child task contribution
      expect(taskForm.getSubTasksTotal()).toBe(500); // 5 * 100
      expect(taskForm.getSubTasksTotalBeforeReduction()).toBe(500);
      expect(taskForm.getSubTasksTotalWithVat()).toBe(605); // 500 * 1.21
    });

    it('should trigger update price event', () => {
      // Setup
      const article: Partial<ICadrartArticle> = {
        name: 'Test Article',
        getPriceMethod: ECadrartArticlePriceMethod.BY_LENGTH,
        sellPrice: 10
      };
      taskForm.getArticle().setValue(article as ICadrartArticle);

      // Spy on the update event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateSpy = spyOn((taskForm as any)._updatePriceSubject, 'next');

      // Act
      taskForm.updatePrice(100, 100, 10000, 0, 21);

      // Assert
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('addSubTask', () => {
    let taskForm: CadrartTaskForm;

    beforeEach(() => {
      taskForm = new CadrartTaskForm(articleService);
    });

    it('should add a sub-task', () => {
      // Act
      taskForm.addSubTask();

      // Assert
      expect(taskForm.getChildren().length).toBe(1);
      expect(taskForm.getChildren().controls[0].getIsChild().value).toBe(true);
    });

    it('should add a sub-task with provided task data', () => {
      // Setup
      const taskData: Partial<ICadrartTask> = {
        id: 123,
        comment: 'Test comment',
        doneCount: 2
      };

      // Act
      taskForm.addSubTask(taskData as ICadrartTask);

      // Assert
      const childTask = taskForm.getChildren().controls[0];
      expect(childTask.get('id')?.value).toBe(123);
      expect(childTask.getComment().value).toBe('Test comment');
      expect(childTask.getDoneCount().value).toBe(2);
    });
  });

  describe('sendUpdates', () => {
    let taskForm: CadrartTaskForm;

    beforeEach(() => {
      taskForm = new CadrartTaskForm(articleService);
    });

    it('should emit updates for self and child tasks', () => {
      // Setup
      taskForm.addSubTask();
      const childTask = taskForm.getChildren().controls[0];

      // Spy on the update events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatesSpy = spyOn((taskForm as any).$updateEvents, 'next');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childUpdatesSpy = spyOn((childTask as any).$updateEvents, 'next');

      // Act
      taskForm.sendUpdates();

      // Assert
      expect(childUpdatesSpy).toHaveBeenCalled();
      expect(updatesSpy).toHaveBeenCalled();
      expect(updatesSpy).toHaveBeenCalledWith(taskForm.getRawValue());
    });
  });

  describe('getters', () => {
    let taskForm: CadrartTaskForm;

    beforeEach(() => {
      taskForm = new CadrartTaskForm(articleService);

      // Setup some values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (taskForm as any)._subTasksTotal = 100;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (taskForm as any)._subTasksTotalBeforeReduction = 120;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (taskForm as any)._subTasksTotalWithVat = 121;
    });

    it('should return correct sub-task totals', () => {
      expect(taskForm.getSubTasksTotal()).toBe(100);
      expect(taskForm.getSubTasksTotalBeforeReduction()).toBe(120);
      expect(taskForm.getSubTasksTotalWithVat()).toBe(121);
    });
  });
});
