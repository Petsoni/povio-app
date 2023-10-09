import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import FileDocument from "../../../../models/File";
import users from '../../../../models/mock-data/users.json';
import User from "../../../../models/User";
import file from "../../../../models/File";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  passedDocument: FileDocument;
  users: User[] = [];
  lastModifiedBy: User;
  currentDate: Date = new Date();
  filePresent: boolean = false;

  constructor(private dialogRef: MatDialogRef<AddDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) documentData: FileDocument) {
    if (documentData) {
      this.passedDocument = documentData;
      this.filePresent = true;
    }
  }

  ngOnInit() {
    this.getUsers();
  }

  getUserById() {
    this.users.map(user => {
      if (this.passedDocument?.last_modified_by === user?.user_id) {
        this.lastModifiedBy = user;
      }
    })
  }

  getUsers() {
    this.users = users;
    this.getUserById();
  }

  checkIfUserCanEdit() {
    this.users.map(user => {
      return user.user_id === this.passedDocument?.last_modified_by;
    })
  }
}
