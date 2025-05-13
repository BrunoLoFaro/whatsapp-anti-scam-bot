import dotenv from "dotenv"

dotenv.config({ path: '.env' });

interface config {
    webPort: number,
    wppwppAPIToken: string,
    ownNumberID: number
};

export const webPort = process.env.PORT;
export const wppAPIToken = process.env.WHATSAPP_TOKEN;
export const ownNumberID = process.env.PHONE_NUMBER_ID;