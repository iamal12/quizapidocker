import { create } from 'zustand'


interface IUserStoreInterface {
    authToken: string;
    setToken: (value: string) => void
}

export const useUserStore = create<IUserStoreInterface>((set) => ({
    authToken: '',
    setToken: (authToken: string) => set((state) => ({ ...state, authToken }))
}))
