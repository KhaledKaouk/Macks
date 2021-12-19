import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfemoComponent } from './alfemo.component';

describe('AlfemoComponent', () => {
  let component: AlfemoComponent;
  let fixture: ComponentFixture<AlfemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlfemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlfemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
