import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPosComponent } from './my-pos.component';

describe('MyPosComponent', () => {
  let component: MyPosComponent;
  let fixture: ComponentFixture<MyPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
