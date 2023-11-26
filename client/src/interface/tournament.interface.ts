import { ICategory } from "./category.interface"

export interface ITournament{
    name:string
    description:string
    startTime:string
    category?:ICategory
    id:number
}