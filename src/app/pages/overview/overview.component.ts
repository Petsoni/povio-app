import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddDocumentComponent} from "./add-document/add-document.component";
import uploadedSolutionFiles from '../../../models/mock-data/files-solutions.json'
import uploadedProblemFiles from '../../../models/mock-data/files-problems.json'
import users from '../../../models/mock-data/users.json'
import Post from "../../../models/Post";
import {debounceTime, Subject} from "rxjs";
import {filterDocuments} from "../../../utils/filters";
import User from "../../../models/User";
import {
  getAllNotifications,
  getColorByTag,
  getProblemPosts,
  getRecommendedPosts,
  getSolutionPosts, setANotificationForComment
} from "../../../utils/global-services";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserRole} from "../../../models/UserRole";
import userRoles from '../../../models/mock-data/roles.json';
import {MatExpansionPanel} from "@angular/material/expansion";
import Notification from "../../../models/Notification";
import {showSuccessSnackbar} from "../../../utils/snackbar-service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDrawerContainer} from "@angular/material/sidenav";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  @ViewChild('formPanel', {static: false}) formPanel: MatExpansionPanel;
  @ViewChild('drawer', {static: false}) drawer: MatDrawerContainer;

  protected readonly getColorByTag = getColorByTag;
  uploadedSolutionFiles: Post[] = [];
  uploadedProblemFiles: Post[] = [];
  recommendedPosts: Post[] = [];
  selectedTag: any
  typingSubject = new Subject<any>();
  documentSearchValue: string = '';

  users: User[] = [];
  selectedUserRole: UserRole
  newPostCategory: UserRole;
  notificationList: Notification[] = [];

  userRoles: UserRole[] = []
  showExpansionPanel: boolean = false;

  addDocumentForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    tag: new FormControl(null, Validators.required),
    lastModifiedBy: new FormControl(null),
    lastModified: new FormControl(new Date()),
    typeOfPost: new FormControl(null, Validators.required),
  });
  sortOrder: string = 'Newest';
  loading: boolean = false;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar) {
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
    this.loading = true;
    setTimeout(() => {
      getSolutionPosts().then((posts) => {
        this.uploadedSolutionFiles = posts;
        this.uploadedSolutionFiles.sort((a, b) => {
          return new Date(this.checkTime(b.lastModified)).getTime() - new Date(this.checkTime(a.lastModified)).getTime();
        });
      }).finally(() => {
        this.loading = false
      })

      getProblemPosts().then((posts) => {
        this.uploadedProblemFiles = posts;
        this.uploadedProblemFiles.sort((a, b) => {
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        });
      }).finally(() => {
        this.loading = false
      });
    }, 1000)
    this.recommendedPosts = getRecommendedPosts()
  }

  getAllUsers() {
    this.users = users;
  }

  getAllRoles() {
    this.userRoles = userRoles
  }

  getAllNotifications() {
    this.notificationList = getAllNotifications();
  }

  openDocumentDialog(document?: any) {
    const dialogConfig = new MatDialogConfig();
    console.log(document);
    if (document) {
      dialogConfig.data = document;
    }
    dialogConfig.minWidth = '75dvw';
    dialogConfig.minHeight = '95%';
    this.dialog.open(AddDocumentComponent, dialogConfig);
  }

  filterDocumentsByTag() {
    if (this.selectedTag === null) {
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
    }
    if (this.addDocumentForm.value.typeOfPost === 'problem') {
      this.uploadedProblemFiles.push(newFileUpload);
      localStorage.setItem('uploadedProblemFiles', JSON.stringify(this.uploadedProblemFiles));
    }
    this.getUploadedFiles();
    showSuccessSnackbar('Document added successfully', this.snackBar);

    // Set new mock notification for new comment on an uploaded post
    if(this.addDocumentForm.value.typeOfPost === 'solution'){
      setTimeout(() => {
        setANotificationForComment();
        this.snackBar.open('You have a new notification', 'View', {
          duration: 2000,
          verticalPosition: 'top',
        }).onAction().subscribe(() => {
          this.drawer.open();
        });
        this.getUploadedFiles()
        this.notificationList = getAllNotifications();
      }, 3000)
    } else {
      setTimeout(() => {
        setANotificationForComment();
        this.snackBar.open('You have a new notification', 'View', {
          duration: 2000,
          verticalPosition: 'top',
        }).onAction().subscribe(() => {
          this.drawer.open();
        });
        this.getUploadedFiles()
        this.notificationList = getAllNotifications();
      }, 3000)
    }
    this.showExpansionPanel = false;
  }

  showExpansion() {
    this.showExpansionPanel = !this.showExpansionPanel;
    if(!this.showExpansionPanel){
      this.formPanel.close();
    }
  }

  setSortOrder() {
    this.sortOrder = this.sortOrder === 'Oldest' ? 'Newest' : 'Oldest';
  }

  checkTime(date: string) {
    return date != null ? new Date(date).getTime() : null;
  }

  sortDocumentsByDate() {
    if (this.sortOrder === 'Newest') {
      this.uploadedSolutionFiles.sort((a, b) => {
        return new Date(this.checkTime(a.lastModified)).getTime() - new Date(this.checkTime(b.lastModified)).getTime();
      });
      this.uploadedProblemFiles.sort((a, b) => {
        return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
      });
    } else {
      this.uploadedSolutionFiles.sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      });
      this.uploadedProblemFiles.sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      });
    }
  }

}
