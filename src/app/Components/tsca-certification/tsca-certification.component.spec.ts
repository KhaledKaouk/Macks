import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSCACertificationComponent } from './tsca-certification.component';

describe('TSCACertificationComponent', () => {
  let component: TSCACertificationComponent;
  let fixture: ComponentFixture<TSCACertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TSCACertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TSCACertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
