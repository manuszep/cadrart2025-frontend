export interface ICadrartFilterConfigField {
  key: string;
  label?: string;
  type: 'toggle' | 'text' | 'select' | 'date' | 'number';
  values?: Array<{ label: string; value: unknown }>;
}

export interface ICadrartFilterConfig {
  fields: ICadrartFilterConfigField[];
}
