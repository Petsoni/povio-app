import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";
import uploadedSolutionFiles from '../../../models/mock-data/files-solutions.json'
import uploadedProblemFiles from '../../../models/mock-data/files-problems.json'
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
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  protected readonly getColorByTag = getColorByTag;
  uploadedSolutionFiles: FileDocument[] = [];
  uploadedProblemFiles: FileDocument[] = [];
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
  showExpansionPanel: boolean = false;

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
    this.uploadedSolutionFiles = uploadedSolutionFiles
    this.uploadedProblemFiles = uploadedProblemFiles
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
      this.uploadedSolutionFiles = uploadedSolutionFiles.filter(file => {
        return file.subCategory === this.selectedTag
      });
    }
  }

  onKeyUp(value: string) {
    this.documentSearchValue = value;
    this.typingSubject.next(value);
  }

  filterDocumentsBySearchValue() {
    this.uploadedSolutionFiles = uploadedSolutionFiles.filter(file => {
      return filterDocuments(file, this.documentSearchValue)
    });
    this.uploadedProblemFiles = uploadedProblemFiles.filter(file => {
      return filterDocuments(file, this.documentSearchValue)
    });
  }

  showExpansion() {
    this.showExpansionPanel = true;
  }

}
