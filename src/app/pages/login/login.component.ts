import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import User from "../../../models/User";
import {HttpClient} from "@angular/common/http";
import mockUsers from '../../../models/mock-data/users.json';
import uploadedSolutionFiles from '../../../models/mock-data/files-solutions.json'
import uploadedProblemFiles from '../../../models/mock-data/files-problems.json'
import recommendedPosts from '../../../models/mock-data/files-recommended.json'
import Post from "../../../models/Post";
import {setUsersToLocalStorage} from "../../../utils/global-services";

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
  recommendedPosts: Post[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getAllUsers() {
    this.users = mockUsers;
    setUsersToLocalStorage(this.users);
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  setLocalStorageItems() {
    this.uploadedSolutionFiles = uploadedSolutionFiles
    this.uploadedProblemFiles = uploadedProblemFiles
    this.recommendedPosts = recommendedPosts
    // localStorage.setItem("users", JSON.stringify(this.users));
    localStorage.setItem("loggedInUser", JSON.stringify(this.loginHistory));
    localStorage.setItem('uploadedSolutionFiles', JSON.stringify(this.uploadedSolutionFiles));
    localStorage.setItem('uploadedProblemFiles', JSON.stringify(this.uploadedProblemFiles));
    localStorage.setItem('recommendedPosts', JSON.stringify(this.uploadedProblemFiles));
  }

  checkLogin() {
    this.users.forEach(user => {
      if (user.username === this.loginForm.value.username && user.password === this.loginForm.value.password) {
        window.open("http://localhost:4200/overview", "_self")
        this.loginHistory.push({
          userId: user.userId,
          loginTime: new Date()
        });
        JSON.stringify(this.loginHistory);
        this.setLocalStorageItems()
      }
    });
  }
}
