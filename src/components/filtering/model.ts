export interface ICadrartFilterConfigField {
  key: string;
  label?: string;
  type: 'toggle' | 'text' | 'select' | 'date' | 'number';
  values?: Array<{ label: string; value: string | number; icon?: string }>;
}

export interface ICadrartFilterConfig {
  fields: ICadrartFilterConfigField[];
}
