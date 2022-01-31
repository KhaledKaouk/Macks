import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISFComponent } from './isf.component';

describe('ISFComponent', () => {
  let component: ISFComponent;
  let fixture: ComponentFixture<ISFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ISFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ISFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
