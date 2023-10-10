import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import users from '../../../../models/mock-data/users.json';
import User from "../../../../models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../../models/UserRole";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  @ViewChild("descriptionValue", {static: false}) descriptionValue: HTMLTextAreaElement;

  passedDocument: any;
  users: User[] = [];
  lastModifiedBy: User;
  filePresent: boolean = false;
  userRoles: UserRole[] = [];
  currentDate: Date = new Date();

  addDocumentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    tag: new FormControl(null, Validators.required),
    lastModifiedBy: new FormControl(null, Validators.required),
    lastModified: new FormControl(new Date())
  });
  editingUser: User;

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) documentData: any) {
    if (documentData) {
      console.log(documentData)
      this.passedDocument = documentData;
      this.filePresent = true;
    }
  }

  ngOnInit() {
  }

  saveFile() {
  }
}
