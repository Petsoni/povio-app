import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import Post from "../../../../models/Post";
import {
  getColorByTag,
  getLoggedInUser,
  getProblemPosts,
  getSolutionPosts, getUserById, saveCommentToPost,
  updatePost
} from "../../../../utils/global-services";
import User from "../../../../models/User";
import {MatSnackBar} from "@angular/material/snack-bar";
import {showSuccessSnackbar} from "../../../../utils/snackbar-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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

  commentForm = new FormGroup({
    commentText: new FormControl(null, Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) documentData: any) {
    if (documentData) {
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
    this.passedDocument.comments.push({
      commentId: this.passedDocument.comments.length + 1,
      text: this.commentForm.value.commentText,
      author: getLoggedInUser()[0].username,
      createdDate: new Date().toLocaleDateString(),
      likes: 0,
      dislikes: 0,
    });
    this.commentForm.reset();
    saveCommentToPost(this.passedDocument)
    showSuccessSnackbar('Comment posted successfully', this.snackBar)
  }

  updateEditedPost() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      let oldDescription = this.passedDocument.description;
      let newDescription = document.getElementsByClassName('post-description')[0].innerHTML;
      if (newDescription === '') {
        document.getElementsByClassName('post-description')[0].innerHTML = oldDescription;
        showSuccessSnackbar('Paragraph cannot be empty', this.snackBar)
      } else {
        this.passedDocument.description = newDescription
        this.passedDocument.lastModified = new Date().toLocaleDateString();
        let lastModifiedBy = getLoggedInUser();
        let modifyUser = {} as User;
        getUserById(lastModifiedBy[0].userId).then(data => {
          modifyUser = data;
          this.passedDocument.lastModifiedBy = modifyUser.username;
        }).finally(() => {
          this.snackBar.open('Post updated successfully', 'Close')
          updatePost(this.passedDocument);
        });
      }
    }
  }
}
