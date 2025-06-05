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
```env
PORT=3000
WHATSAPP_TOKEN=<<token temporal de Meta>>
PHONE_NUMBER_ID=<<id del número de prueba>>
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


Cualquier duda, consulten!

Arquitectura

![image](https://github.com/user-attachments/assets/d1b24876-5ca3-4712-b28b-bc18117a563b)

