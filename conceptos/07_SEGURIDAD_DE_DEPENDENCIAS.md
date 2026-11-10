# 7. Seguridad de las dependencias

> Aquí van a aprender qué es una vulnerabilidad en una librería, cómo
> encontrarlas con `npm audit` y por qué en la EA3 se fija la versión exacta de
> Next.js. La EA3 exige **0 vulnerabilidades críticas o altas** y la captura de
> `npm audit` en `api/` y en `front/`.

## 7.1 ¿Qué es una vulnerabilidad?

Una **dependencia** es una librería que el proyecto usa (Express, cors, Next.js...).
Una **vulnerabilidad** es un error en esa librería que alguien malintencionado
podría aprovechar: leer datos, dañar el servidor o ejecutar su propio código.

Analogía: comprar una cerradura y luego enterarse de que ese modelo se abre con
cualquier llave. La casa (el código propio) está bien hecha, pero la cerradura
(la dependencia) falla. La solución: cambiarla por el modelo corregido.

Cuando se descubre una falla, los autores publican una **versión con el parche**
(la corrección). El trabajo de ustedes es **actualizar**.

## 7.2 npm audit

**`npm audit`** revisa todas las dependencias del proyecto contra una lista
pública de fallas conocidas y dice cuáles tienen problemas y qué tan graves son.

```bash
cd api        # entrar a la carpeta de la API
npm audit     # revisar sus dependencias
cd ../front   # entrar a la carpeta del frontend
npm audit     # revisar las del frontend
```

| Gravedad | Qué hacer en la EA3 |
|---|---|
| **critical** (crítica) | Corregir sí o sí |
| **high** (alta) | Corregir sí o sí |
| moderate (moderada) | Revisar; si se puede, actualizar |
| low (baja) | Revisar |

Si aparece una crítica o alta: actualicen esa dependencia (por ejemplo
`npm install next@16.4.3 --save-exact`), vuelvan a ejecutar `npm audit` y
expliquen en el README qué hicieron. El resultado ideal: `found 0 vulnerabilities`.

## 7.3 La versión exacta de Next.js (sin ^)

En `package.json`, el símbolo `^` delante de una versión significa "esta o una
más nueva compatible". Así se ve en la API de facturas: `"express": "^5.3.0"`.

| Escrito así | Qué instala `npm install` |
|---|---|
| `"next": "^16.4.3"` | La 16.4.3 **o** una más nueva de la serie 16, la que haya ese día |
| `"next": "16.4.3"` | **Exactamente** la 16.4.3, en todos los computadores |

Se publicaron vulnerabilidades críticas en Next.js, corregidas desde la versión
**16.4.1**. La clase usa la **16.4.3**. Al fijar la versión exacta:

- Todo el equipo tiene **la misma** versión, la que se sabe que está corregida.
- Nadie recibe por sorpresa una versión distinta que cambie algo.

```jsonc
"dependencies": {
  "next": "16.4.3",     // versión exacta: sin ^
  "react": "...",       // las demás como las deje el instalador
  "react-dom": "..."
}
```

## 7.4 Buenas costumbres

- Ejecutar `npm audit` antes de cada entrega.
- No subir `node_modules/` (se recrea con `npm install`).
- Instalar solo las librerías que de verdad se usan: cada una es una puerta más.
