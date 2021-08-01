import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrightPricesComponent } from './fright-prices.component';

describe('FrightPricesComponent', () => {
  let component: FrightPricesComponent;
  let fixture: ComponentFixture<FrightPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrightPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrightPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
