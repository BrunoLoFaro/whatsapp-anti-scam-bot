import dotenv from "dotenv"

dotenv.config({ path: '.env' });

interface config {
    webPort: number,
    wppwppAPIToken: string,
    ownNumber: string
};

export const webPort = process.env.PORT;
export const wppAPIToken = process.env.WHATSAPP_TOKEN;
export const ownNumber = process.env.PHONE_NUMBER_ID;