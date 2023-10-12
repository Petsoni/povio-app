import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import Post from "../../../../models/Post";
import {
  getColorByTag,
  getLoggedInUser,
  getProblemPosts,
  getSolutionPosts, getUserById,
  updatePost
} from "../../../../utils/global-services";
import User from "../../../../models/User";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  protected readonly getColorByTag = getColorByTag;

  @ViewChild("documentDescription", {static: false}) documentDescription: HTMLParagraphElement;
  @ViewChild("commentInput", {static: false}) commentInput: HTMLTextAreaElement;

  passedDocument: any;
  uploadedSolutionFiles: Post[]
  uploadedProblemFiles: Post[]
  filePresent: boolean = false;
  isLiked: boolean = false;
  isEditable: boolean = false;

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

  upvotePost() {
    getSolutionPosts().then(data => {
      this.uploadedSolutionFiles = data;
    })
    getProblemPosts().then(data => {
      this.uploadedProblemFiles = data;
    })
    let foundFile: Post;
    this.uploadedSolutionFiles.map((file) => {
      if (file.postId === this.passedDocument.postId) {
        foundFile = file;
      }
    });
    this.uploadedProblemFiles.map((file) => {
      if (file.postId === this.passedDocument.postId) {
        foundFile = file;
      }
    });
    if (foundFile) {
      this.isLiked = !this.isLiked;
      this.isLiked ? this.passedDocument.numberOfUpVotes++ : this.passedDocument.numberOfUpVotes--;
      updatePost(this.passedDocument);
    }
  }

  postComment() {

  }

  setContentEditable() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.passedDocument.description = document.getElementsByClassName('post-description')[0].innerHTML;
      // this.passedDocument.lastModified = new Date().toLocaleDateString();
      let lastModifiedBy = getLoggedInUser();
      let modifyUser = getUserById(lastModifiedBy.userId) as User;
      this.passedDocument.lastModifiedBy = modifyUser.username;
      updatePost(this.passedDocument);
    }
  }
}
