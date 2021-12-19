import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePortComponent } from './update-port.component';

describe('UpdatePortComponent', () => {
  let component: UpdatePortComponent;
  let fixture: ComponentFixture<UpdatePortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
