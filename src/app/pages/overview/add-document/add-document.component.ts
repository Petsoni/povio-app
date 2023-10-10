import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import FileDocument from "../../../../models/File";
import users from '../../../../models/mock-data/users.json';
import User from "../../../../models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../../models/UserRole";
import userRoles from '../../../../models/mock-data/roles.json';
import Comment from "../../../../models/Comment";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  @ViewChild(HTMLTextAreaElement, {static: false}) commentInput: HTMLTextAreaElement;

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
  selectedRole: UserRole;
  editingUser: User;

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) documentData: any) {
    if (documentData) {
      this.passedDocument = documentData;
      this.filePresent = true;
    }
  }

  ngOnInit() {
    this.getAllUsers();
    this.getAllRoles();
  }

  getUserById() {
    this.users.map(user => {
      if (this.passedDocument?.lastModifiedBy === user?.userId) {
        this.lastModifiedBy = user;
        this.checkIfUserCanEdit();
      }
    })
  }

  getAllUsers() {
    this.users = users;
    this.getUserById();
  }

  getAllRoles() {
    this.userRoles = userRoles
  }

  saveFile() {
    console.log(this.addDocumentForm.value)
  }

  checkIfUserCanEdit() {
    let localUser = localStorage.getItem('loggedInUser');
    this.editingUser =  localUser !== null ? JSON.parse(localUser) : null;
    this.users.map(user => {
      return user.userId === this.passedDocument?.lastModifiedBy;
    })
  }
}
