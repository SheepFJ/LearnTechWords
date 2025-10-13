// 定义一个用户接口
export interface User {
    id: number
    name: string
    email: string
    x?: string
}

export interface Certificate {
    _id: string
    typename: string
    introduce: string
    level: string
    passscore: number
    fullmarks: number
    exam: string
    created_at: string
    id?: number
}


export type Users = Array<User>
