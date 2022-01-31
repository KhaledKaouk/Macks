import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOfLadingComponent } from './bill-of-lading.component';

describe('BillOfLadingComponent', () => {
  let component: BillOfLadingComponent;
  let fixture: ComponentFixture<BillOfLadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOfLadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOfLadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
