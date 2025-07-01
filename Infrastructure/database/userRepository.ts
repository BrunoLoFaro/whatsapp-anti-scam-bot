import redisClient from "./redisClient.js";

export enum UserState {
    NEW = 'NEW',
    GREETED = 'GREETED',
    MIDFLOW = 'MIDFLOW'
}

export interface userField {
    phoneNumber: string, 
    state?: UserState,
    receivedMessage?: string
}

// IMPLEMENTAR ESTO DE MANERA TAL QUE 
// SE PUEDA MANEJAR LOS ESTADOS DEL USUARIO
// Y VERIFICAR QUE BOTON PRESIONO PARA 
// MANDARLE NUEVAMNETE LA LISTA DE BOTONES
// SIN EL BOTON QUE PRESIONO

export class UserRepository {
    private static instance: UserRepository;
    private redisClient;

    private constructor() {
        this.redisClient = redisClient;
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return this.instance;
    }

    public async createUser(user: userField): Promise<void> {
        const key = `user:${user.phoneNumber}`;
        await this.redisClient.hSet(key, {
            state: user.state ?? UserState.NEW
        });
        // el usuario expira en 5 minutos
        await this.redisClient.expire(key, 300);
    }

    public async updateUser(user: userField): Promise<void> {
        const key = `user:${user.phoneNumber}`;
        await this.redisClient.hSet(key, {
            state: user.state ?? UserState.GREETED,
            message: user.receivedMessage ?? ''
        });
    }

    public async deleteUser(user: userField): Promise<void> {
        const key = `user:${user.phoneNumber}`;
        await this.redisClient.del(key);
    }

    public async retrieveUserState(userPhoneNumber: string): Promise<String | null> {
        const key = `user:${userPhoneNumber}`;
        const userState: String | null = await this.redisClient.hGet(key, 'state');
        return userState;        
    }

    public async retrieveUserReceivedMessage(userPhoneNumber: string): Promise<String | null> {
        const key = `user:${userPhoneNumber}`;
        const userReceivedMessage: String | null = await this.redisClient.hGet(key, 'message');
        return userReceivedMessage;     
    } 

}