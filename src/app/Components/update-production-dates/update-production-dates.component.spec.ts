import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductionDatesComponent } from './update-production-dates.component';

describe('UpdateProductionDatesComponent', () => {
  let component: UpdateProductionDatesComponent;
  let fixture: ComponentFixture<UpdateProductionDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductionDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductionDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
