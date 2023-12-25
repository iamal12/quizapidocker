export interface IUser {
    id: number,
    created?: string,
    updated?:string,
    name:string,
    mobileNo: number,
    email:string,
    role?: 'user' | 'admin'
}