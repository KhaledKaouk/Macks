import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelFileViewComponent } from './excel-file-view.component';

describe('ExcelFileViewComponent', () => {
  let component: ExcelFileViewComponent;
  let fixture: ComponentFixture<ExcelFileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelFileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
