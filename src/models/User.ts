import FileDocument from "./File";

export interface User {
  id: number,
  username: string,
  password: string,
  role: string,
  files?: FileDocument[]
}

export default User;
