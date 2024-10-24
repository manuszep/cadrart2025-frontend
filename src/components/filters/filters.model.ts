import { ICadrartIcon } from '../icon/icon.model';

export interface ICadrartFilterOptionConfig {
  label: string;
  value: string | number;
  icon: ICadrartIcon;
}

export interface ICadrartFilterConfig {
  key: string;
  label?: string;
  type: 'toggle';
  config: ICadrartFilterOptionConfig[];
  value: string | number;
}

export type ICadrartFiltersConfig = ICadrartFilterConfig[];

export type ICadrartFilterEvent = {
  key: string;
  value: string | number;
};
