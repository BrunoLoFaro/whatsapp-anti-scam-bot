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
    openRouterFallbackModel1?: string,
    openRouterFallbackModel2?: string
    promptInstructions?: string,,
    promptAdviceInstructions?: string,
    greetTemplateFlowName?: string,
    midFlowTemplateFlowName?: string,
    terminateFlowTemplateFlowName?: string,
    errorFlowTemplateFlowName?: string
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
    public openRouterFallbackModel1 = process.env.OPENROUTER_FALLBACK_MODEL1;
    public openRouterFallbackModel2 = process.env.OPENROUTER_FALLBACK_MODEL2;
    public promptAdviceInstructions = process.env.PROMPT_ADVICE_INSTRUCTIONS;
    public greetTemplateFlowName = process.env.GREET_TEMPLATE_NAME;
    public midFlowTemplateFlowName = process.env.MID_FLOW_TEMPLATE_NAME;
    public terminateFlowTemplateFlowName = process.env.TERMINATE_FLOW_TEMPLATE_NAME;
    public errorFlowTemplateFlowName = process.env.ERROR_FLOW_TEMPLATE_NAME;
};

export default new Config();