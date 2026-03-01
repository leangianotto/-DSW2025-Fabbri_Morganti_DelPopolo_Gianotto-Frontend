# 🛒 Proyecto E-commerce Frontend

![Angular](https://img.shields.io/badge/Angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Este es el frontend del proyecto de e-commerce desarrollado con **Angular** y **Bootstrap**. 
Diseñado para ser intuitivo, rápido y fácil de usar.

**[Ver Documentación Formal del Proyecto](./docs/README.md)** (Proposal, PRs, Tests, Deploy, etc.).

---

## Funcionalidades Principales

- **Autenticación**: Registro e inicio de sesión de usuarios de forma segura.
- **Catálogo de Productos**: Navegación ágil por el listado de productos disponibles.
- **Carrito de Compras**: Gestión de productos añadidos listos para la compra.
- **Detalles y Reseñas**: Vista detallada de cada producto junto con reseñas de usuarios.
- **Landing Page**: Página de inicio atractiva, responsiva y moderna.

---

## Requisitos Previos

Asegúrate de tener instalados en tu sistema:
- [Node.js](https://nodejs.org/) (v16 o superior)
- **Angular CLI** instalado globalmente. Puedes instalarlo con:
  ```bash
  npm install -g @angular/cli
  ```

---

## Instalación y Ejecución Local

Sigue estos pasos para instalar y poner en marcha el proyecto localmente, sin necesidad de conocimientos previos sobre su desarrollo.

**1. Clonar el repositorio:**
```bash
git clone https://github.com/leangianotto/-DSW2025-Fabbri_Morganti_DelPopolo_Gianotto-Frontend.git
cd -DSW2025-Fabbri_Morganti_DelPopolo_Gianotto-Frontend
```

**2. Instalar dependencias del proyecto:**
```bash
npm install
```

**3. Instalar librerías de UI (Bootstrap):**
```bash
npm install bootstrap bootstrap-icons
```
*(Los estilos y scripts de Bootstrap están referenciados de manera global desde `angular.json`)*.

**4. Levantar el servidor de desarrollo:**
Ejecuta el script de inicio definido en el proyecto:
```bash
npm start
```
*(Alternativamente, puedes usar directamente Angular CLI ejecutando `ng serve`)*.

La aplicación estará disponible en tu navegador ingresando a: **[http://localhost:4200](http://localhost:4200)**

---

## 🌐 Deploy y Enlaces de Acceso

La aplicación se encuentra desplegada y lista para usar en producción:

- **Frontend App (Vercel):** [https://dsw2025-ecommerce-frontend.vercel.app/](https://dsw2025-ecommerce-frontend.vercel.app/)
- **Backend API (Render):** [https://dsw2025-fabbri-morganti-delpopolo.onrender.com](https://dsw2025-fabbri-morganti-delpopolo.onrender.com)

*(El frontend ya está configurado para consumir esta API).*

---
