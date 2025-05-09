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