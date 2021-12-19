import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPortComponent } from './new-port.component';

describe('NewPortComponent', () => {
  let component: NewPortComponent;
  let fixture: ComponentFixture<NewPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
