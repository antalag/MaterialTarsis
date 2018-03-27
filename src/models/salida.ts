import {Observable} from "rxjs/Observable";
import {User} from "./user";
import {Material} from "./material";

export interface Salida{
    id:string,
    user?:Observable<User>,
    material?:Observable<Material>,
    fechaSalida:Date,
    fechaEntrada:Date
}