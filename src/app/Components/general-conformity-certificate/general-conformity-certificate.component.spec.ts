import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConformityCertificateComponent } from './general-conformity-certificate.component';

describe('GeneralConformityCertificateComponent', () => {
  let component: GeneralConformityCertificateComponent;
  let fixture: ComponentFixture<GeneralConformityCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralConformityCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralConformityCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
