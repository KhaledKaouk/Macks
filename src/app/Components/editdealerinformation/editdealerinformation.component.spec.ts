import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdealerinformationComponent } from './editdealerinformation.component';

describe('EditdealerinformationComponent', () => {
  let component: EditdealerinformationComponent;
  let fixture: ComponentFixture<EditdealerinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditdealerinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdealerinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
