import { PermissionDeniedError } from "openai";
import redisClient from "./redisClient";

export enum UserState {
    NEW = 'NEW',
    GREETED = 'GREETED',
}

export interface userField {
    state: UserState | UserState.NEW,
    receivedMessage?: string
}

// IMPLEMENTAR ESTO DE MANERA TAL QUE 
// SE PUEDA MANEJAR LOS ESTADOS DEL USUARIO
// Y VERIFICAR QUE BOTON PRESIONO PARA 
// MANDARLE NUEVAMNETE LA LISTA DE BOTONES
// SIN EL BOTON QUE PRESIONO

export class UserRepository {
    private static instance: UserRepository;

    private constructor() {

    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return this.instance;
    }

    private getUserKey(userPhoneNumber: string): string{
        return `userState: ${userPhoneNumber}`;
    } 

    async getUserState(userPhoneNumber: string): Promise<UserState> {
        const userState = await redisClient.get(this.getUserKey(userPhoneNumber));
        return (userState as UserState) || UserState.NEW;
    }

    async setUserState(userPhoneNumber: string, state: UserState){
        await redisClient.setEx(this.getUserKey(userPhoneNumber), 3600, state);
    }

    async clearUserState(userPhoneNumber: string): Promise<void> {
        await redisClient.del(this.getUserKey(userPhoneNumber));
    }


 

}