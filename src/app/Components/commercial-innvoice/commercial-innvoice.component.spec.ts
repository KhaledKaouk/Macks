import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInnvoiceComponent } from './commercial-innvoice.component';

describe('CommercialInnvoiceComponent', () => {
  let component: CommercialInnvoiceComponent;
  let fixture: ComponentFixture<CommercialInnvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialInnvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialInnvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
