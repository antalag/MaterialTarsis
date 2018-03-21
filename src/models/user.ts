export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  cargo?:string;
  rol?:number;
}