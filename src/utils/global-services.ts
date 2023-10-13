import Post from "../models/Post";
import Notification from "../models/Notification";
import uploadedSolutionFiles from "../models/mock-data/files-solutions.json"
import uploadedProblemFiles from "../models/mock-data/files-problems.json"

export function getColorByTag(tag: string) {
  switch (tag) {
    case 'Backend':
      return '#F94144';
    case 'Support':
      return '#F3722C';
    case 'Frontend':
      return '#277DA1';
    case 'Design':
      return '#43AA8B';
    case 'Finance':
      return '#503f96';
    default:
      return '#000000';
  }
}

export function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('loggedInUser'));
}

export function setUsersToLocalStorage(users: any) {
  localStorage.setItem('users', JSON.stringify(users));
}

export async function getUserById(id: number) {
  const users = await JSON.parse(localStorage.getItem('users'));
  return users.find((user: any) => user.userId === id);
}

export async function getSolutionPosts(): Promise<Post[]> {
  return await JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
}

export async function getProblemPosts() {
  return await JSON.parse(localStorage.getItem('uploadedProblemFiles'));
}

export function getRecommendedPosts() {
  return JSON.parse(localStorage.getItem('recommendedPosts'));
}

export function updatePost(post: Post) {
  let uploadedProblemFiles = JSON.parse(localStorage.getItem('uploadedProblemFiles'));
  let uploadedSolutionFiles = JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
  if (!uploadedProblemFiles) {
    uploadedProblemFiles = [];
  }
  if (!uploadedSolutionFiles) {
    uploadedSolutionFiles = [];
  }
  uploadedProblemFiles = uploadedProblemFiles.map((file: Post) => {
    if (file.postId === post.postId) {
      file = post;
    }
    return file;
  });
  uploadedSolutionFiles = uploadedSolutionFiles.map((file: Post) => {
    if (file.postId === post.postId) {
      file = post;
    }
    return file;
  });
  localStorage.setItem('uploadedProblemFiles', JSON.stringify(uploadedProblemFiles));
  localStorage.setItem('uploadedSolutionFiles', JSON.stringify(uploadedSolutionFiles));
}

export function getAllNotifications() {
  return JSON.parse(localStorage.getItem('notifications'));
}

export function setANotificationForComment() {
  let notifications = getAllNotifications();
  let newNotification: Notification = {
    notificationId: notifications.length + 1,
    title: 'New Comment',
    content: 'A new comment has been added to your post',
    date: new Date().toLocaleDateString(),
  }
  getSolutionPosts().then(data => {
    let newestPost = data[data.length - 1];
    newestPost.comments.push({
      commentId: newestPost.comments.length + 1,
      text: 'Great idea!',
      author: 'John Doe',
      likes: 0,
      dislikes: 0,
      createdDate: new Date().toLocaleDateString(),
    })
    newestPost.numberOfComments++;
    updatePost(newestPost);
  })
  notifications.push(newNotification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function saveCommentToPost(post: Post) {
  let uploadedProblemFiles = JSON.parse(localStorage.getItem('uploadedProblemFiles'));
  let uploadedSolutionFiles = JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
  if (!uploadedProblemFiles) {
    uploadedProblemFiles = [];
  }
  if (!uploadedSolutionFiles) {
    uploadedSolutionFiles = [];
  }
  uploadedProblemFiles = uploadedProblemFiles.map((file: Post) => {
    if (file.postId === post.postId) {
      file.comments = post.comments;
      file.numberOfComments = post.numberOfComments++;
    }
    return file;
  });
  uploadedSolutionFiles = uploadedSolutionFiles.map((file: Post) => {
    if (file.postId === post.postId) {
      file.comments = post.comments;
      file.numberOfComments = post.numberOfComments++;
    }
    return file;
  });
  localStorage.setItem('uploadedProblemFiles', JSON.stringify(uploadedProblemFiles));
  localStorage.setItem('uploadedSolutionFiles', JSON.stringify(uploadedSolutionFiles));
}
