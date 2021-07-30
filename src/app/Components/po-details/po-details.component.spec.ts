import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDetailsComponent } from './po-details.component';

describe('PoDetailsComponent', () => {
  let component: PoDetailsComponent;
  let fixture: ComponentFixture<PoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
