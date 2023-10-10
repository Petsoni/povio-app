import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";
import uploadedFiles from '../../../models/mock-data/files.json'
import users from '../../../models/mock-data/users.json'
import FileDocument from "../../../models/Post";
import {debounceTime, Subject} from "rxjs";
import {filterDocuments} from "../../../utils/filters";
import User from "../../../models/User";
import {getColorByTag} from "../../../utils/global-getters";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../models/UserRole";
import userRoles from '../../../models/mock-data/roles.json';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  protected readonly getColorByTag = getColorByTag;
  uploadedFiles: FileDocument[] = [];
  selectedTag: any
  typingSubject = new Subject<any>();
  documentSearchValue: string = '';
  typeOfUpload = [
    {
      value: 'WRITE',
      icon: 'edit',
      displayName: 'Write',
    },
    {
      value: 'ASK',
      icon: 'question_answer',
      displayName: 'Ask',
    }
  ]

  currentDate = new Date();
  users: User[] = [];
  selectedUserRole: UserRole

  userRoles: UserRole[] = []

  addDocumentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    tag: new FormControl(null, Validators.required),
    lastModifiedBy: new FormControl(null, Validators.required),
    lastModified: new FormControl(new Date())
  });

  constructor(private dialog: MatDialog) {
    this.typingSubject.pipe(
      debounceTime(100)
    ).subscribe(() => {
      this.filterDocumentsBySearchValue();
    });
  }

  ngOnInit() {
    this.getUploadedFiles();
    this.getAllUsers();
    this.getAllRoles();
  }

  getUploadedFiles() {
    this.uploadedFiles = uploadedFiles
  }

  getAllUsers() {
    this.users = users;
  }

  getAllRoles() {
    this.userRoles = userRoles
  }

  openDocumentDialog(document?: any) {
    const dialogConfig = new MatDialogConfig();
    console.log(document);
    if (document) {
      dialogConfig.data = document;
    }
    dialogConfig.minWidth = '95dvw';
    dialogConfig.maxHeight = '95dvh';
    this.dialog.open(AddDocumentComponent, dialogConfig);
  }

  filterDocumentsByTag() {
    if (this.selectedTag === 'ALL') {
      this.getUploadedFiles();
      this.selectedUserRole = null;
    } else {
      this.uploadedFiles = uploadedFiles.filter(file => file.category === this.selectedTag);
    }
  }

  onKeyUp(value: string) {
    this.documentSearchValue = value;
    this.typingSubject.next(value);
  }

  filterDocumentsBySearchValue() {
    this.uploadedFiles = uploadedFiles.filter(file => {
      return filterDocuments(file, this.documentSearchValue)
    });
  }

}
