import dotenv from "dotenv"

dotenv.config({ path: '.env' });

interface configType {
    webPort?: number,
    wppAPIToken?: string,
    ownNumberID?: string,
    baseUrl: string,
    wppOwnWebhookToken?: string
};

class Config implements configType{
    public webPort = process.env.PORT ? parseInt(process.env.PORT) : undefined;
    public wppAPIToken = process.env.WHATSAPP_TOKEN;
    public ownNumberID = process.env.PHONE_NUMBER_ID;
    public baseUrl = "https://graph.facebook.com";
    public wppOwnWebhookToken = process.env.MY_WHATSAPP_TOKEN;
};

export default new Config();