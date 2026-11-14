# Taller 3 - Sustentación

App web (React, Vite, Tailwind, TypeScript) para presentar el Taller 3 del curso de Integración y Entrega Continua: despliegue continuo en AWS ECS con Terraform.

En vivo: https://sjunka.github.io/taller3-sustentacion/

Vistas: inicio, arquitectura, pipeline, flujo y guion. Los diagramas se reproducen con Play/Pausa, Anterior/Siguiente o las flechas del teclado y la barra espaciadora. Abrir `#/pipeline?esc=fallo&paso=3` salta a un escenario y un paso.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # tsc + vite build, genera dist/
```

El despliegue a GitHub Pages lo hace `.github/workflows/deploy.yml` en cada push a `main`. El tema oscuro se fuerza con `?theme=dark` (por ejemplo para capturas).

## Datos pendientes

Todo lo que aún no existe (URLs de staging, producción, Docker Hub, SonarCloud y capturas) está en `src/data/pendientes.ts`. Mientras valga `null`, la app muestra un chip "pendiente". Cuando haya el dato real se escribe ahí y no hay que tocar nada más. Las capturas van en `public/` y se referencian por ruta relativa.

## Cómo agregar un diagrama nuevo

1. Crear `src/data/mi-diagrama.ts` con `ANCHO`, `ALTO`, `nodos`, `aristas` y `pasos` (tipos en `src/lib/tipos.ts`). Cada arista indica de qué nodo a qué nodo va y con qué etiqueta; cada paso lista los nodos y aristas que se iluminan.
2. Crear `src/views/MiDiagrama.tsx` que renderice `<Diagrama ancho alto nodos aristas pasos />` y, si hay guion, `<GuionVista vistas={[...]} />`.
3. Agregar una línea al arreglo de `src/views.ts`: `{ id, ruta, titulo, descripcion, componente }`.

La barra de navegación y la página de inicio (con la URL completa copiable) se generan desde ese arreglo. Si la vista tiene guion, agregar su clave en el tipo `Vista` de `src/data/guion.ts`.

## Logos

Los logos son SVG en `src/assets/logos/` (de svgl, devicon, lucide e Iconify `logos`) y se registran en `src/lib/logos.ts`. No se carga nada de CDN en tiempo de ejecución, salvo las tipografías de Google Fonts.
