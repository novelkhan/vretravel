export interface User {
    firstName: string;
    lastName: string;
    jwt: string;
  }
  
  export interface ResetPassword {
    token: string;
    email: string;
    newPassword: string;
  }
  
  export interface Register {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface Login {
    userName: string;
    password: string;
  }
  
  export interface ConfirmEmail {
    token: string;
    email: string;
  }
  
  export interface MemberView {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    dateCreated: Date;
    isLocked: boolean;
    roles: string[];
  }
  
  export interface MemberAddEdit {
    id?: string;
    userName: string;
    firstName: string;
    lastName: string;
    password?: string;
    roles: string;
  }