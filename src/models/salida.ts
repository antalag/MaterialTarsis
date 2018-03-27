import {Observable} from "rxjs/Observable";
import {User} from "./user";

export interface Salida{
    id:string,
    usuario:Observable<User>,
    fechaSalida:Date,
    fechaEntrada:Date
}