# whatsapp-anti-scam-bot

Este proyecto es un backend en Node.js que se conecta con la API de WhatsApp Business de Meta para recibir mensajes y responder automáticamente. Es parte del desarrollo de un MVP para la detección de posibles estafas digitales.

---

## 🚀 Requisitos para correr el proyecto

- Node.js 18 o superior  
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

## ✅ Archivos importantes que deben estar presentes

- `.env` configurado
- Código fuente en `src/`
- `package.json`, `tsconfig.json`
- Carpeta `logs/` creada si no existe

---

Cualquier duda, consulten!

Arquitectura

![image](https://github.com/user-attachments/assets/174ab53e-dcef-461d-86b0-3610a5d82ca6)
