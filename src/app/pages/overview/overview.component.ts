import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(private dialog: MatDialog) {

  }

  ngOnInit() {

  }

  openDocumentDialog(document?: any) {
    const dialogConfig = new MatDialogConfig();
    if(document) {
      dialogConfig.data = document;
    }
    dialogConfig.minWidth = '50%';
    this.dialog.open(AddDocumentComponent, dialogConfig);
  }
}
