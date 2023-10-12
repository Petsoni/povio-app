import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";
import uploadedSolutionFiles from '../../../models/mock-data/files-solutions.json'
import uploadedProblemFiles from '../../../models/mock-data/files-problems.json'
import users from '../../../models/mock-data/users.json'
import Post from "../../../models/Post";
import {debounceTime, Subject} from "rxjs";
import {filterDocuments} from "../../../utils/filters";
import User from "../../../models/User";
import {getColorByTag} from "../../../utils/global-services";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../models/UserRole";
import userRoles from '../../../models/mock-data/roles.json';
import notificationList from '../../../models/mock-data/notifications.json'
import notification from "../../../models/Notification";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  protected readonly getColorByTag = getColorByTag;
  uploadedSolutionFiles: Post[] = [];
  uploadedProblemFiles: Post[] = [];
  selectedTag: any
  typingSubject = new Subject<any>();
  documentSearchValue: string = '';

  users: User[] = [];
  selectedUserRole: UserRole
  newPostCategory: UserRole;
  notificationList: any[] = [];

  userRoles: UserRole[] = []
  showExpansionPanel: boolean = false;

  addDocumentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    tag: new FormControl(null, Validators.required),
    lastModifiedBy: new FormControl(null, Validators.required),
    lastModified: new FormControl(new Date()),
    typeOfPost: new FormControl(null, Validators.required),
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
    this.getAllNotifications();
  }

  getUploadedFiles() {
    this.uploadedSolutionFiles = JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
    this.uploadedProblemFiles = JSON.parse(localStorage.getItem('uploadedProblemFiles'));
  }

  getAllUsers() {
    this.users = users;
  }

  getAllRoles() {
    this.userRoles = userRoles
  }

  getAllNotifications() {
    this.notificationList = notificationList;
  }

  openDocumentDialog(document?: any) {
    const dialogConfig = new MatDialogConfig();
    console.log(document);
    if (document) {
      dialogConfig.data = document;
    }
    dialogConfig.minWidth = '75dvw';
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
      this.uploadedProblemFiles = this.uploadedProblemFiles.filter(file => {
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

  findCategoryById(value: string) {
    this.userRoles.find(role => {
      role.subCategory.find(subCategory => {
        if (subCategory.value === value) {
          this.newPostCategory = role;
        } else {
          return null;
        }
      })
    })
  }

  findUserById(userId: number): User {
    return this.users.find(user => {
      return user.userId === userId
    })
  }

  savePost() {
    let localUser = this.findUserById(JSON.parse(localStorage.getItem('loggedInUser'))[0].userId);
    this.users.map((user) => {
      if (user.userId === localUser.userId) {
        this.addDocumentForm.value.lastModifiedBy = user;
      }
    });
    this.findCategoryById(this.addDocumentForm.value.tag)
    let newFileUpload: Post;
    newFileUpload = {
      postId: this.uploadedSolutionFiles.length + 1,
      title: this.addDocumentForm.value.title,
      description: this.addDocumentForm.value.description,
      author: localUser.username,
      lastModifiedBy: localUser.username,
      lastModified: this.addDocumentForm.value.lastModified.toLocaleDateString(),
      createdDate: new Date().toLocaleDateString(),
      category: this.newPostCategory.value,
      subCategory: this.addDocumentForm.value.tag,
      numberOfComments: 0,
      numberOfUpVotes: 0,
      comments: []
    }
    if (this.addDocumentForm.value.typeOfPost === 'solution') {
      this.uploadedSolutionFiles.push(newFileUpload);
      localStorage.setItem('uploadedSolutionFiles', JSON.stringify(this.uploadedSolutionFiles));
      console.log(localStorage.getItem('uploadedSolutionFiles'))
    }
    if (this.addDocumentForm.value.typeOfPost === 'problem') {
      this.uploadedProblemFiles.push(newFileUpload);
      localStorage.setItem('uploadedProblemFiles', JSON.stringify(this.uploadedProblemFiles));
    }
    this.getUploadedFiles();
    this.showExpansionPanel = false;
  }

  showExpansion() {
    this.showExpansionPanel = true;
  }

}
