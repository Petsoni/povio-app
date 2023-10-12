import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import Post from "../../../../models/Post";
import {
  getColorByTag,
  getProblemPosts,
  getSolutionPosts,
  saveProblemPost,
  saveSolutionPost, updatePost
} from "../../../../utils/global-services";

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  @ViewChild("descriptionValue", {static: false}) descriptionValue: HTMLTextAreaElement;

  passedDocument: any;
  uploadedSolutionFiles: Post[]
  uploadedProblemFiles: Post[]
  filePresent: boolean = false;
  isLiked: boolean = false;

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
    this.uploadedSolutionFiles = getSolutionPosts();
    this.uploadedProblemFiles = getProblemPosts();
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

  protected readonly getColorByTag = getColorByTag;
}
