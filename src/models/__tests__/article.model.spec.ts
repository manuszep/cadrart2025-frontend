import { ECadrartArticleFamily, ECadrartArticlePriceMethod, ICadrartArticle, ICadrartProvider, ICadrartFormula, ICadrartTask } from '@manuszep/cadrart2025-common';

import { CadrartArticle } from '../article.model';

describe('CadrartArticle', () => {
  const baseData: Partial<ICadrartArticle> = {
    name: 'Test Article',
    place: 'A1',
    buyPrice: 10,
    sellPrice: 20,
    getPriceMethod: ECadrartArticlePriceMethod.BY_AREA,
    family: ECadrartArticleFamily.WOOD,
    maxReduction: 15,
    provider: { id: 1, name: 'Provider' } as ICadrartProvider,
    formula: { id: 2, name: 'Formula' } as ICadrartFormula,
    providerRef: 'REF-001',
    maxLength: 200,
    maxWidth: 100,
    combine: true,
    tasks: [{
      id: 1,
      comment: 'Test task',
      doneCount: 0,
      total: 0,
      totalBeforeReduction: 0,
      totalWithVat: 0,
      // Add other ICadrartTask properties as needed
    }] as ICadrartTask[]
  };

  it('should initialize with provided data', () => {
    const article = new CadrartArticle(baseData as ICadrartArticle);
    expect(article.name).toBe('Test Article');
    expect(article.place).toBe('A1');
    expect(article.buyPrice).toBe(10);
    expect(article.sellPrice).toBe(20);
    expect(article.getPriceMethod).toBe(ECadrartArticlePriceMethod.BY_AREA);
    expect(article.family).toBe(ECadrartArticleFamily.WOOD);
    expect(article.maxReduction).toBe(15);
    expect(article.provider).toEqual(baseData.provider ?? null);
    expect(article.formula).toEqual(baseData.formula ?? null);
    expect(article.providerRef).toBe('REF-001');
    expect(article.maxLength).toBe(200);
    expect(article.maxWidth).toBe(100);
    expect(article.combine).toBe(true);
    expect(article.tasks).toEqual(baseData.tasks ?? null);
  });

  it('should return default values when data is missing', () => {
    const article = new CadrartArticle({} as ICadrartArticle);
    expect(article.name).toBeNull();
    expect(article.place).toBeNull();
    expect(article.buyPrice).toBeNull();
    expect(article.sellPrice).toBeNull();
    expect(article.getPriceMethod).toBe(ECadrartArticlePriceMethod.BY_LENGTH);
    expect(article.family).toBe(ECadrartArticleFamily.GLASS);
    expect(article.maxReduction).toBeNull();
    expect(article.provider).toBeNull();
    expect(article.formula).toBeNull();
    expect(article.providerRef).toBeNull();
    expect(article.maxLength).toBeNull();
    expect(article.maxWidth).toBeNull();
    expect(article.combine).toBe(false);
    expect(article.tasks).toBeNull();
  });
});
