# 🎮 CryptoGame - Juego de Trading de Criptomonedas

Un emocionante minijuego de trading de criptomonedas desarrollado con **Phaser 3**, donde debes recoger monedas Bitcoin y Ethereum que caen del cielo, observar las fluctuaciones de precios en tiempo real, y vender en el momento óptimo para maximizar tus ganancias.

## 🚀 Características Principales

### 🎯 Mecánicas de Juego

- **Recolección Dinámica**: Recoge Bitcoin (₿) y Ethereum (Ξ) que caen del cielo
- **Trading Estratégico**: Observa las tendencias de precios y vende en el momento perfecto
- **Sistema de Tendencias**: Los precios siguen tendencias realistas de 5-15 segundos
- **Zona de Venta**: Mantén presionada la flecha derecha en la zona dorada por 2 segundos para vender
- **Duración**: Partidas de 2 minutos con máxima intensidad

### 💰 Sistema de Precios Avanzado

- **Precios Realistas**: Bitcoin (~$50,000) y Ethereum (~$3,000)
- **Tendencias Inteligentes**: Cambios de precio del 3% máximo por segundo
- **Indicadores Visuales**: Cajas verdes (subiendo) y rojas (bajando)
- **Predicción de Ganancias**: Visualiza tu ganancia potencial antes de vender

### 🎨 Efectos Visuales Espectaculares

- **Partículas Diferenciadas**: Efectos únicos para Bitcoin (dorado) y Ethereum (azul)
- **Sistema de Combos**: Recolecta monedas rápidamente para activar combos especiales
- **Lluvia de Monedas**: Eventos especiales con efectos de pantalla y partículas
- **Animaciones Fluidas**: Respiración del jugador, pulsación de precios, brillos dinámicos
- **Efectos de Éxito**: Partículas doradas y sonidos especiales para ventas exitosas

### 🔊 Audio Inmersivo

- **Sonidos Diferenciados**: Tonos únicos para Bitcoin y Ethereum
- **Audio de Venta**: Acordes ascendentes para ganancias, descendentes para pérdidas
- **Efectos Ambientales**: Sonidos de colisión y efectos especiales
- **Generación Procedural**: Todos los sonidos generados con Web Audio API

### 📊 Estadísticas Detalladas

- **Análisis Completo**: Monedas recolectadas, operaciones realizadas, tasa de éxito
- **Rendimiento**: Evaluación automática del desempeño (Excelente, Muy Bien, Bien)
- **Récords Persistentes**: Sistema de puntuación máxima guardado localmente
- **Métricas Avanzadas**: Ganancia media, ritmo de recolección, estadísticas por criptomoneda

## 🎮 Controles

| Acción                  | Teclas                            |
| ----------------------- | --------------------------------- |
| Mover Izquierda         | `←` o `A`                         |
| Mover Derecha           | `→` o `D`                         |
| Vender (en zona dorada) | Mantener `→` o `D` por 2 segundos |
| Ayuda Rápida            | `Espacio`                         |
| Pausa                   | Botón en pantalla                 |

## 🏗️ Estructura del Proyecto

```
cryptoGame-XRR/
├── index.html          # Página principal con diseño responsivo
├── style.css           # Estilos modernos con gradientes
├── game.js             # Lógica completa del juego (2000+ líneas)
├── assets/             # Recursos del juego
│   ├── player.png      # Sprite del jugador
│   ├── coin1.png       # Bitcoin
│   ├── coin2.png       # Ethereum
│   └── sell.png        # Stand de venta
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Phaser 3.70.0**: Framework de juegos HTML5
- **JavaScript ES6+**: Lógica del juego con clases modernas
- **HTML5 Canvas**: Renderizado de gráficos
- **Web Audio API**: Generación de sonidos en tiempo real
- **CSS3**: Diseño responsivo y efectos visuales
- **LocalStorage**: Persistencia de récords

## 🚀 Instalación y Ejecución

### Opción 1: Servidor Local (Recomendado)

```bash
# Clona el repositorio
git clone [URL_DEL_REPOSITORIO]
cd cryptoGame-XRR

# Inicia un servidor local
python3 -m http.server 8000
# o con Node.js: npx http-server

# Abre en tu navegador
http://localhost:8000
```

### Opción 2: Servidor Web

Sube todos los archivos a tu servidor web y accede desde cualquier navegador.

## 🎯 Estrategias de Juego

### 🟢 Para Principiantes

1. **Observa las Tendencias**: Las cajas verdes indican precios al alza
2. **Recolecta en Rojo**: Compra barato cuando las cajas están rojas
3. **Vende en Verde**: Maximiza ganancias vendiendo durante tendencias alcistas
4. **Gestiona el Tiempo**: Tienes solo 2 minutos, ¡actúa rápido!

### 🟡 Estrategias Avanzadas

1. **Sistema de Combos**: Recolecta monedas rápidamente para activar multiplicadores
2. **Diversificación**: Balancea tu cartera entre Bitcoin y Ethereum
3. **Timing Perfecto**: Espera el momento óptimo observando los indicadores
4. **Lluvia de Monedas**: Aprovecha los eventos especiales para maximizar recolección

### 🔴 Técnicas Expertas

1. **Análisis de Tendencias**: Las tendencias duran 5-15 segundos, planifica en consecuencia
2. **Gestión de Riesgo**: No vendas siempre, a veces es mejor esperar
3. **Optimización de Movimiento**: Usa el magnetismo sutil de las monedas
4. **Maximización de Combos**: Mantén combos altos para efectos especiales

## 📈 Sistema de Puntuación

### Evaluación del Rendimiento

- **🌟 Excelente**: $500+ (Maestro del Trading)
- **👍 Muy Bien**: $200-499 (Trader Competente)
- **👌 Bien**: $0-199 (En Desarrollo)
- **📈 Sigue Practicando**: Negativo (Aprende de los Errores)

### Métricas Clave

- **Balance Final**: Tu ganancia total
- **Tasa de Éxito**: Porcentaje de operaciones rentables
- **Ganancia Media**: Promedio por operación
- **Ritmo de Recolección**: Monedas por minuto
- **Diversificación**: Balance entre Bitcoin y Ethereum

## 🔧 Configuración Avanzada

El juego incluye un sistema de configuración centralizado en `GAME_SETTINGS`:

```javascript
const GAME_SETTINGS = {
  GAME_DURATION: 120000, // 2 minutos
  PLAYER_SPEED: 500, // Velocidad del jugador
  COIN_FALL_SPEED: 300, // Velocidad de caída
  PRICE_VOLATILITY: 0.03, // Volatilidad del 3%
  SELL_TIME: 2000, // 2 segundos para vender
  MAX_COINS_ON_SCREEN: 15, // Máximo de monedas
  PRICE_TREND_MIN_DURATION: 5000, // Tendencia mínima 5s
  PRICE_TREND_MAX_DURATION: 15000, // Tendencia máxima 15s
};
```

## 🐛 Solución de Problemas

### Problemas Comunes

**❌ El juego no carga**

- Asegúrate de usar un servidor local (no abrir directamente el HTML)
- Verifica que todos los archivos estén en la misma carpeta
- Comprueba la consola del navegador para errores

**❌ No hay sonido**

- Los navegadores modernos requieren interacción del usuario para audio
- Haz clic en cualquier parte de la pantalla antes de jugar
- Verifica que el audio no esté silenciado

**❌ Rendimiento lento**

- Cierra otras pestañas del navegador
- Usa un navegador moderno (Chrome, Firefox, Safari)
- Verifica que tu dispositivo tenga suficiente memoria

**❌ Controles no responden**

- Asegúrate de que el juego tenga el foco (haz clic en él)
- Verifica que no haya otras aplicaciones capturando las teclas
- Prueba tanto las flechas como WASD

## 🎨 Personalización

### Modificar Colores

Edita las variables de color en `game.js`:

```javascript
// Colores de Bitcoin
tint: 0xf7931a; // Naranja Bitcoin oficial

// Colores de Ethereum
tint: 0x627eea; // Azul Ethereum oficial
```

### Ajustar Dificultad

Modifica `GAME_SETTINGS` para cambiar la experiencia:

```javascript
COIN_FALL_SPEED: 200,        // Más lento = más fácil
PRICE_VOLATILITY: 0.05,      // Mayor volatilidad = más difícil
SELL_TIME: 1500,             // Menos tiempo = más difícil
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para Contribuir

- 🎵 Música de fondo
- 🏆 Sistema de logros
- 📱 Optimización móvil
- 🌐 Multijugador
- 📊 Gráficos de precios históricos
- 🎨 Nuevos temas visuales

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Phaser.js**: Por el increíble framework de juegos
- **Comunidad Crypto**: Por la inspiración en el mundo de las criptomonedas
- **Web Audio API**: Por hacer posible el audio generativo
- **Desarrolladores**: Por las herramientas y recursos utilizados

## 📞 Contacto

¿Tienes preguntas, sugerencias o encontraste un bug?

- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues]
- 💬 Discusiones: [GitHub Discussions]

---

**¡Disfruta del juego y que tengas trading exitoso! 🚀💰**

_Recuerda: Este es un juego educativo. El trading real de criptomonedas conlleva riesgos significativos._
