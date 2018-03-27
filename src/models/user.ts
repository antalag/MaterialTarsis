export interface User {
  id: string;
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  cargo?:string;
  rol?:number;
}