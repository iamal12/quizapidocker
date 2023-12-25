import { ICategory } from "./category.interface"
import { IUser } from "./user.interface"

export interface ITournament{
    name:string
    description:string
    startTime:string
    category?:ICategory
    id:number,
    users: IUser[]
}