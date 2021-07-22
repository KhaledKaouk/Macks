import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfemoUpdateComponent } from './alfemo-update.component';

describe('AlfemoUpdateComponent', () => {
  let component: AlfemoUpdateComponent;
  let fixture: ComponentFixture<AlfemoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlfemoUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlfemoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
