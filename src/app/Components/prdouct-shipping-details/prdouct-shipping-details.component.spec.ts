import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdouctShippingDetailsComponent } from './prdouct-shipping-details.component';

describe('PrdouctShippingDetailsComponent', () => {
  let component: PrdouctShippingDetailsComponent;
  let fixture: ComponentFixture<PrdouctShippingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrdouctShippingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdouctShippingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
