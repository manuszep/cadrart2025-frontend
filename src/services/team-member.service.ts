import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICadrartTeamMember, ICadrartEntityResponse } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CadrartTeamMemberService extends CadrartApiService<ICadrartTeamMember> {
  endpointName = 'team-member';

  public getName(entity: ICadrartTeamMember): string {
    const value = `${entity.firstName ?? ''} ${entity.lastName ?? ''}`;

    return value !== '' && value !== ' ' ? value : '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'TeamMember';
  }

  override mapEntityForOption(entity: ICadrartTeamMember): { label: string; value: ICadrartTeamMember } {
    return {
      label: `${entity.firstName} ${entity.lastName}`,
      value: entity
    };
  }

  public getEntityImageByMail(mail: string): Observable<{ image: string }> {
    return (
      this.cache.makeRequest('get', `${this.endpointName}/image/${mail}`) as Observable<
        ICadrartEntityResponse<{ image: string }>
      >
    ).pipe(
      map((response: ICadrartEntityResponse<{ image: string }>) => {
        return response.entity;
      })
    );
  }
}
