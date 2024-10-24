import { ICadrartIcon } from '../icon/icon.model';

export type ICadrartHeaderLink = {
  label: string;
  path: string;
  icon?: ICadrartIcon;
  disabled?: boolean;
};

export type ICadrartHeaderNavigation = ICadrartHeaderLink[];

export type ICadrartHeaderAction = {
  label: string;
  icon?: ICadrartIcon;
  tag?: string;
  hotkey?: string;
};
