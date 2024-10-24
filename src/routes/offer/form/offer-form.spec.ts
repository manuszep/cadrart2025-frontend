import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { CadrartOfferService } from '../../../services/offer.service';
import { CadrartClientService } from '../../../services/client.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartFooterService } from '../../../components/footer/footer.service';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartAlertService } from '../../../components/alert/alert.service';
import { CadrartTagService } from '../../../services/tag.service';
import { CadrartLocationService } from '../../../services/location.service';
import { CadrartTeamMemberService } from '../../../services/team-member.service';
import { CadrartArticleService } from '../../../services/article.service';
import { CadrartMockOfferService } from '../../../test-helpers/offer-service.mock';
import { CadrartMockClientService } from '../../../test-helpers/client-service.mock';
import { CadrartMockInspectorService } from '../../../test-helpers/inspector-service.mock';

import { CadrartRouteOfferFormComponent } from './offer-form.component';

describe('CadrartRouteOfferFormComponent', () => {
  let component: CadrartRouteOfferFormComponent;
  let fixture: ComponentFixture<CadrartRouteOfferFormComponent>;
  const offerService = new CadrartMockOfferService();
  const clientService = new CadrartMockClientService();
  const inspectorService = new CadrartMockInspectorService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CadrartRouteOfferFormComponent],
      providers: [
        { provide: CadrartOfferService, useValue: offerService },
        { provide: CadrartClientService, useValue: clientService },
        { provide: CadrartInspectorService, useValue: inspectorService },
        { provide: CadrartFooterService, useValue: {} },
        { provide: CadrartHeaderService, useValue: { setNavigation: () => null } },
        { provide: CadrartAlertService, useValue: {} },
        { provide: CadrartTagService, useValue: {} },
        { provide: CadrartLocationService, useValue: {} },
        { provide: CadrartTeamMemberService, useValue: {} },
        { provide: CadrartArticleService, useValue: {} },
        { provide: ActivatedRoute, useValue: { paramMap: of() } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadrartRouteOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create offer form', () => {
    expect(component.offerForm).toBeDefined();
  });

  it('should add job', () => {
    const addJobSpy = spyOn(component, 'addJob');

    component.addJob();
    expect(addJobSpy).toHaveBeenCalled();
  });

  // Add more tests as needed
});
