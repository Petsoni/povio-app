import Post from "../models/Post";

export function getColorByTag(tag: string) {
  switch (tag) {
    case 'Backend':
      return '#a4394b';
    case 'Support':
      return '#b98434';
    case 'Frontend':
      return '#4f83c1';
    case 'Design':
      return '#81b252';
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

export function getUserById(id: number) {
  const users = JSON.parse(localStorage.getItem('users'));
  return users.find((user: any) => user.userId === id);
}

export async function getSolutionPosts() {
  return await JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
}

export async function getProblemPosts() {
  return await JSON.parse(localStorage.getItem('uploadedProblemFiles'));
}

export function saveSolutionPost(post: any) {
  let uploadedSolutionFiles = JSON.parse(localStorage.getItem('uploadedSolutionFiles'));
  if (!uploadedSolutionFiles) {
    uploadedSolutionFiles = [];
  }
  uploadedSolutionFiles.push(post);
  localStorage.setItem('uploadedSolutionFiles', JSON.stringify(uploadedSolutionFiles));
}

export function getRecommendedPosts() {
  return JSON.parse(localStorage.getItem('recommendedPosts'));
}

export function saveProblemPost(post: any) {
  let uploadedProblemFiles = JSON.parse(localStorage.getItem('uploadedProblemFiles'));
  if (!uploadedProblemFiles) {
    uploadedProblemFiles = [];
  }
  uploadedProblemFiles.push(post);
  localStorage.setItem('uploadedProblemFiles', JSON.stringify(uploadedProblemFiles));
}

export function updatePost(post: any) {
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
