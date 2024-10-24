import { environment } from '../environments/environment';

export function getEndpointUrl(name: string): string {
  return `${environment.apiUrl}${name}`;
}
