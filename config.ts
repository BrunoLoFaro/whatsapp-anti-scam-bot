import dotenv from "dotenv"

dotenv.config({ path: '.env' });

interface configType {
    webPort?: number,
    wppAPIToken?: string,
    ownNumberID?: string,
    metaBaseUrl?: string,
    wppOwnWebhookToken?: string,
    openRouterApiKey?: string,
    openRouterBaseUrl?: string,
    openRouterModel?: string,
    promptInstructions?: string
};

class Config implements configType{
    public webPort = process.env.PORT ? parseInt(process.env.PORT) : undefined;
    public wppAPIToken = process.env.WHATSAPP_TOKEN;
    public ownNumberID = process.env.PHONE_NUMBER_ID;
    public metaBaseUrl = process.env.META_BASE_URL;
    public wppOwnWebhookToken = process.env.MY_WHATSAPP_TOKEN;
    public openRouterApiKey = process.env.OPENROUTER_API_KEY;
    public openRouterBaseUrl = process.env.OPENROUTER_BASE_URL;
    public openRouterModel = process.env.OPENROUTER_MODEL;
    public promptInstructions = process.env.PROMPT_INSTRUCTIONS;
};

export default new Config();