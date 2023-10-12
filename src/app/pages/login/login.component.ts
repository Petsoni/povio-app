import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import User from "../../../models/User";
import {HttpClient} from "@angular/common/http";
import mockUsers from '../../../models/mock-data/users.json';
import uploadedSolutionFiles from '../../../models/mock-data/files-solutions.json'
import uploadedProblemFiles from '../../../models/mock-data/files-problems.json'
import Post from "../../../models/Post";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  users: User[] = [];
  loginHistory: any[] = [];
  uploadedSolutionFiles: Post[] = [];
  uploadedProblemFiles: Post[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAllUsers() {
    this.users = mockUsers;
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  setLocalStorageItems() {
    this.uploadedSolutionFiles = uploadedSolutionFiles
    this.uploadedProblemFiles = uploadedProblemFiles
  }

  checkLogin() {
    this.users.forEach(user => {
      if (user.username === this.loginForm.value.username && user.password === this.loginForm.value.password) {
        window.open("http://localhost:4200/overview", "_self")
        this.loginHistory.push({
          userId: user.userId,
          loginTime: new Date()
        });
        this.setLocalStorageItems()
        JSON.stringify(this.loginHistory);
        localStorage.setItem("loggedInUser", JSON.stringify(this.loginHistory));
        localStorage.setItem('uploadedSolutionFiles', JSON.stringify(this.uploadedSolutionFiles));
        localStorage.setItem('uploadedProblemFiles', JSON.stringify(this.uploadedProblemFiles));
      }
    });
  }
}
