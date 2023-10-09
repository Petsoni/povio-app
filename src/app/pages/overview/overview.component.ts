import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";
import uploadedFiles from '../../../models/mock-data/files.json'
import users from '../../../models/mock-data/users.json'
import FileDocument from "../../../models/File";
import {debounceTime, Subject} from "rxjs";
import {filterDocuments} from "../../../utils/filters";
import User from "../../../models/User";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  uploadedFiles: FileDocument[] = [];
  selectedUserRole: any;
  typingSubject = new Subject<any>();
  documentSearchValue: string = '';

  selectedUser: User | null;
  users: User[] = [];

  userRoles = [
    {
      value: 'BACKEND',
      displayName: 'Backend',
    },
    {
      value: 'FRONTEND',
      displayName: 'Frontend',
    },
    {
      value: 'DESIGN',
      displayName: 'Design',
    },
    {
      value: 'FINANCE',
      displayName: 'Finance',
    },
    {
      value: 'SUPPORT',
      displayName: 'Support',
    }
  ]

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
  }

  getUploadedFiles() {
    this.uploadedFiles = uploadedFiles
  }

  getAllUsers() {
    this.users = users;
  }

  openDocumentDialog(document?: any) {
    const dialogConfig = new MatDialogConfig();
    if (document) {
      dialogConfig.data = document;
    }
    dialogConfig.minWidth = '50%';
    this.dialog.open(AddDocumentComponent, dialogConfig);
  }

  filterDocumentsByTag() {
    if (this.selectedUserRole === 'ALL') {
      this.getUploadedFiles();
      this.selectedUserRole = null;
    } else {
      this.uploadedFiles = uploadedFiles.filter(file => file.tag === this.selectedUserRole);
    }
  }

  filterDocumentsByUser() {
    if (this.selectedUser === null) {
      this.getAllUsers();
    } else {
      this.users = users.filter(user => user.user_id === this.selectedUser!.user_id);
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

  getColorByTag(tag: string) {
    switch (tag) {
      case 'BACKEND':
        return '#a81627';
      case 'SUPPORT':
        return '#f5a623';
      case 'FRONTEND':
        return '#4a90e2';
      case 'DESIGN':
        return '#7ed321';
      case 'FINANCE':
        return '#9013fe';
      default:
        return '#000000';
    }
  }
}
