import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrightPriceUpdateComponent } from './fright-price-update.component';

describe('FrightPriceUpdateComponent', () => {
  let component: FrightPriceUpdateComponent;
  let fixture: ComponentFixture<FrightPriceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrightPriceUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrightPriceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
