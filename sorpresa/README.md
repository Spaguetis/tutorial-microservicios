# Sorpresa Floral

Landing romántica con fondo oscuro, flores animadas de colores y música.

## 1) Estructura

- `index.html`: contenido principal.
- `styles.css`: visual y animaciones.
- `script.js`: dibujo dinámico de flores en canvas.
- `crear-qr.ps1`: genera un PNG con QR de la URL pública.

## 2) Agregar la canción

Por derechos de autor, no se incluye audio en este repositorio.

1. Crea la carpeta `assets`.
2. Coloca tu archivo legalmente obtenido como `assets/Medialuna.mp4`.

## 3) Probar local

Con PowerShell en esta carpeta:

```powershell
python -m http.server 5500
```

Abre:

```text
http://localhost:5500
```

## 4) Publicar para compartir desde cualquier lugar

Opción rápida con GitHub Pages:

1. Sube estos archivos a un repositorio.
2. En Settings > Pages, elige desplegar desde la rama principal.
3. Obtén tu URL pública (ejemplo: `https://usuario.github.io/sorpresa`).

## 5) Crear QR de la URL pública

Ejemplo:

```powershell
./crear-qr.ps1 -Url "https://usuario.github.io/sorpresa" -Salida "qr-sorpresa.png"
```

Se generará la imagen `qr-sorpresa.png` lista para enviar.
