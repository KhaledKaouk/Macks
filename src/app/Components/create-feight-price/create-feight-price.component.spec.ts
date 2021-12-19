import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeightPriceComponent } from './create-feight-price.component';

describe('CreateFeightPriceComponent', () => {
  let component: CreateFeightPriceComponent;
  let fixture: ComponentFixture<CreateFeightPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFeightPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeightPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
