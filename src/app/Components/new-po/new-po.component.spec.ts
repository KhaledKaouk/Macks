import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPoComponent } from './new-po.component';

describe('NewPoComponent', () => {
  let component: NewPoComponent;
  let fixture: ComponentFixture<NewPoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
