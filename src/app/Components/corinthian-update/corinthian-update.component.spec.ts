import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorinthianUpdateComponent } from './corinthian-update.component';

describe('CorinthianUpdateComponent', () => {
  let component: CorinthianUpdateComponent;
  let fixture: ComponentFixture<CorinthianUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorinthianUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorinthianUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
