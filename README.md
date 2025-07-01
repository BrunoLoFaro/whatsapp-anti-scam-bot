# whatsapp-anti-scam-bot

Este proyecto es un backend en Node.js que se conecta con la API de WhatsApp Business de Meta para recibir mensajes y responder automáticamente. Es parte del desarrollo de un MVP para la detección de posibles estafas digitales.

---

## 🚀 Requisitos para correr el proyecto

- Node.js 22.x o superior 
- npm (v9+)  
- Visual Studio Code  
```bash
- Cuenta en [https://developers.facebook.com](https://developers.facebook.com) con perfil de desarrollador activado
- Número de prueba aprobado en el entorno sandbox de WhatsApp Cloud API

---

## 📁 Estructura del proyecto

```
/src
  /Application         → Casos de uso (lógica de negocio)
  /Infrastructure      → Integraciones externas (logger, API WhatsApp)
  /Interfaces          → Adaptadores (controladores Express)
  /Domain              → Modelos y tipos (entidades)
  /Config              → Variables de entorno, puertos, etc.
logs/                  → Carpeta donde se guardan los logs locales
.env                   → Variables de entorno
```

---

## ⚙️ Uso de Redis

Utilizamos Redis para el manejo de estados de usuario. Redis es una base de datos en memoria, volátil y de alta velocidad que almacena temporalmente el estado y el mensaje de Phishing que envio cada usuario. Cada clave de usuario se expira automáticamente a los **5 minutos**, lo que garantiza la limpieza de datos antiguos y previene el consumo excesivo de memoria.

---  

## ▶️ Pasos para ejecutar el proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-org/anti-scam-bot.git
cd anti-scam-bot
```
(o desde github desktop)

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar el archivo `.env`**

Crear un archivo `.env` en la raíz con:
```
PORT=3000                            # Puerto en el que corre el servidor local
WHATSAPP_TOKEN=<<token temporal>>    # Token de acceso generado por Meta
PHONE_NUMBER_ID=<<número de prueba>> # ID del número en el entorno sandbox
REDIS_URI=<<redis://localhost:6379>> #Ubicacion donde se encuentra corriendo la BD de Redis

# SAME AS DEV.META >> WHATSAPP >> WEBHOOK
MY_WHATSAPP_TOKEN=<<token configurado en WhatsApp -> Webhook >>
META_BASE_URL=https://graph.facebook.com           # URL base para la API de Meta

# OPENROUTER CONFIGURATION
OPENROUTER_API_KEY=<<tu api key de openrouter>>    # Clave de API para OpenRouter
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1   # URL base de la API de OpenRouter
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free  # Modelo de IA a utilizar
OPENROUTER_FALLBACK_MODEL1=deepseek/deepseek-r1-0528:free  # Modelo de IA a utilizar de Backup
OPENROUTER_FALLBACK_MODEL2=mistralai/devstral-small:free    # Modelo de IA a utilizar de Backup

# PROMPT INSTRUCTIONS INJECTION
PROMPT_INSTRUCTIONS=Necesito que evalues si el siguiente mensaje que recibi por WhatsApp que te voy a pasar podria ser un mensaje de phishing o no. No me digas si luego necesito ayuda con algo mas. Solo decime analiza el mensaje y dame tu devolucion. Hace una firma de tu modelo. Muy importante, necesitas saber que es para que lo lea una persona muy mayor de edad por lo que usa ejemplos, lenguaje claro y emojis. No uses tecnisismos ni palabras complicadas. # Instrucciones para el prompt que se enviará al modelo de IA

# USER MESSAGE FLOWS WHATSAPP TEMPLATE IDS
GREET_TEMPLATE_NAME=<<nombre en Wpp Business>> 
MID_FLOW_TEMPLATE_NAME=<<nombre en Wpp Business>>  
TERMINATE_FLOW_TEMPLATE_NAME=<<nombre en Wpp Business>> 
```
4. **correr el proyecto**
```bash
npm run dev
```

Una vez que estén corriendo el proyecto, Ingresen a localhost:3000/api/webhook/ desde un navegador para testear ese endpoint

Si hacen algun cambio, al guardarlo se recompila e inicia solo.

## 📄 Logs

Los logs de eventos e errores se guardan en la carpeta `/logs`. Se rotan automáticamente y muestran los mensajes recibidos y enviados.

---

## 📦 Publicación de Releases

Para asegurar que los _builds_ se generen y publiquen correctamente junto con sus respectivos assets (como el ZIP del build), **las releases deben crearse directamente desde GitHub**. Esto dispara el workflow definido en el archivo [`.github/workflows/releasing.yml`](.github/workflows/releasing.yml).

### Cómo Funciona el Release Workflow

1. **Creación de la Release**  
   - Cuando creas una nueva release en GitHub (usando un tag único que no exista previamente), el workflow se dispara automáticamente.
   - **Importante:** El tag debe ser único, ya que si ya existe una release con ese tag GitHub tratará de actualizarla y podría generar errores de permisos.

2. **Ejecución del Workflow**  
   El workflow `releasing.yml` realizará los siguientes pasos:
   - Ejecutará los tests definidos en el workflow de testing.
   - Compilará el proyecto y comprimirá la carpeta de salida (por ejemplo, `dist`) en un archivo ZIP.
   - Creará la release en modo _draft_ (borrador), subirá el asset generado y, finalmente, publicará la release mediante una actualización de la misma.

3. **Recomendación**  
   - Siempre crea la release desde la interfaz de GitHub o mediante la CLI (por ejemplo, usando `gh release create`) **con un tag nuevo**.
   - De esta forma, el workflow se encargará de generar el _build_ y adjuntarlo automáticamente a la release.

Con este proceso, aseguras que cada release se publique con el _build_ actualizado sin errores de permisos ni conflictos al intentar modificar una release ya existente.

---

## 🌱 Flujo de trabajo con Git

Usamos **GitFlow**:

- `main`: rama estable de producción
- `develop`: rama de desarrollo donde se integran las features

Para agregar funcionalidades, crear ramas a partir de `develop` con el prefijo:

```
feature/nombre-claro-de-la-tarea
```

Ejemplo:
```
feature/guardar-mensajes-db
```

Al terminar, crear un **Pull Request a `develop`**. Pidanme una codereview para poder mergear a develop

---
## 📢 Regla de negocio: Envío de mensajes por WhatsApp Business API

La API de WhatsApp Business impone la siguiente regla:  
**Las empresas solo pueden iniciar conversaciones con mensajes plantilla (template messages).**  
Una vez que el usuario responde, se pueden enviar otros tipos de mensajes (texto, multimedia, etc.) dentro de una ventana de 24 horas.

> Referencia: [WhatsApp Business API Policy](https://developers.facebook.com/community/threads/651506520396074/)

Esta lógica está implementada en la función `sendReplyToWpp`.  
Asegúrate de respetar esta regla para evitar errores o bloqueos en el envío de mensajes.

---

## ✅ Archivos importantes que deben estar presentes

- `.env` configurado
- Código fuente en `src/`
- `package.json`, `tsconfig.json`
- Carpeta `logs/` creada si no existe

---

## ☝️ Importante: Sanitización de números de teléfono

Para números de Argentina, **es necesario eliminar el dígito "9" que aparece después del código de país (+54)** antes de enviar respuestas. Si el número contiene el "9", solo se recibe el mensaje pero no se puede responder correctamente.

Ejemplo:  
- Recibido: `+5491123456789`  
- Debe enviarse: `+541123456789`

Asegúrense de sanitizar los números antes de responder desde el bot.  
La lógica de sanitización debe implementarse antes de llamar a la función que envía la respuesta (por ejemplo, en el archivo `sendReply` o donde se gestione el envío de mensajes).

> **Tip:** Revisen el archivo donde se arma el número de destino antes de enviar la respuesta para aplicar esta regla solo a números de Argentina (`+54`).

---

Cualquier duda, consulten!

Arquitectura

![image](https://github.com/user-attachments/assets/d1b24876-5ca3-4712-b28b-bc18117a563b)

