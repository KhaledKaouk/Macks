import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-excel-file-view',
  templateUrl: './excel-file-view.component.html',
  styleUrls: ['./excel-file-view.component.sass']
})
export class ExcelFileViewComponent implements OnInit {

  html: string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogref: MatDialogRef<ExcelFileViewComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.html = this.data;
  }

}
