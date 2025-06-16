# Prompts para desarrollar el minijuego "CryptoCatch" con Phaser

Quiero que desarrolles un minijuego online utilizando **Phaser** (JavaScript, HTML, CSS). El resultado debe ser un juego sencillo, visualmente atractivo y jugable en cualquier navegador de escritorio. El código debe estar **dividido en tres archivos** (`index.html`, `style.css`, `game.js`) y usar una carpeta `/assets` con los recursos gráficos indicados.

---

## 🎮 Mecánica y requisitos

- El jugador mueve un personaje con una **cesta** de izquierda a derecha usando las **teclas de dirección** (flechas).
- **Desde la parte superior** caen monedas de dos tipos:
  - **Bitcoin** (`coin1.png`), moneda amarilla con símbolo ₿.
  - **Ethereum** (`coin2.png`), moneda gris con símbolo Ξ.
  - Varias monedas caen simultáneamente y aleatoriamente por la pantalla.
- Si la **cesta colisiona** con una moneda, la recoge automáticamente.
- **A la derecha** de la pantalla hay un stand con la imagen `sell.png` y el texto **SELL**.
  - Para vender, el jugador debe mantener la cesta en la zona SELL **durante 2 segundos** pulsando la flecha derecha continuamente.
  - Al hacerlo, se venden **todas las monedas recogidas**.
- **A la izquierda**, aparecen **dos cajitas con gráficas de precios** (una para Bitcoin y otra para Ethereum):
  - Los precios suben y bajan de forma aleatoria cada segundo.
  - Si la variación respecto al punto anterior es **positiva**, la caja es **verde**; si es **negativa**, **roja**.
- **Precio y balance**:
  - Al recoger una moneda, se guarda el precio actual mostrado en la gráfica correspondiente.
  - Al vender, el beneficio de cada moneda es:  
    `(precio de venta - precio de recogida)`  
    Se suma al **balance en dólares** (muestra arriba a la derecha el balance en tiempo real y el total acumulado vendido).
- **El ritmo de caída de monedas es constante**.  
  Si una moneda toca el suelo simplemente desaparece, sin penalización.
- El **juego dura 2 minutos**.  
  Al finalizar, muestra un **popup** con el total conseguido y si es un **nuevo récord máximo** (guardado en `localStorage`).
- Al vender, aparece un pequeño **popup** encima del stand SELL con la ganancia de esa venta.
- **Efectos de sonido**:
  - Sonido simple al recoger moneda.
  - Sonido al vender.
  - Sonido especial al batir récord.
- **Gráficos estilo infantil**:  
  Usa las imágenes de la carpeta `/assets`:
  - `player.png` (muñeco con cesta)
  - `coin1.png` (Bitcoin)
  - `coin2.png` (Ethereum)
  - `sell.png` (stand SELL)
- **Separar en archivos**:
  - `index.html` (estructura y carga de Phaser)
  - `style.css` (estilos generales)
  - `game.js` (toda la lógica del juego)
- **Buen código**:
  - El código debe estar **comentado** y organizado.
  - Instrucciones claras para modificar sprites, tiempos y dificultad.
  - Sin frameworks adicionales.
  - No uses assets externos salvo los de `/assets`.

---

## ✅ Extras opcionales (pueden ir como comentarios en el código)

- Ajustes de dificultad o variantes (monedas especiales, caída progresiva, etc).
- Mejoras visuales o de sonido.

---

## ➡️ Genera el código completo para cada archivo (`index.html`, `style.css`, `game.js`) siguiendo todas las indicaciones anteriores y usando **Phaser** como framework de desarrollo de juegos.

dime dudas y sugerencias antes de ejecutar nada

---

# ITERACIONES

## Resolucion de dudas

1. Phaser 3
2. Resolución ajustable a la pantalla
3. Los Assets estan dentro de la carpeta assets del proyecto actual.
4. De momento sonidos generados por código

Suggerencias

1. Ok
2. Ok
3. No, el flujo de monedas tiene que ser constante
4. Ok

Si tus dudas y sugerencias están resueltas, dame una lista de tareas y subtareas verificables antes de continuar.

## Crear archivo README.md con las instrucciones para ejecutar el juego

## Correcciones varias

1. Especificar que las monedas caen verticalmente
2. Especificar el cambio de precios que sea mas estable y constante
3. Los movimientos de las monedas y de la cesta que sean mas fluidos y rapidos.
4. Mejoras graficas
5. Añadir musica y efectos sonoros
6. Correccion de errores de balances
