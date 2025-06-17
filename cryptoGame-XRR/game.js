/**
 * ===== CRYPTOGAME - JUEGO DE RECOLECCIÓN DE CRIPTOMONEDAS =====
 * 
 * Juego desarrollado con Phaser 3 donde el jugador recoge monedas
 * que caen del cielo y las vende en el momento óptimo según los precios.
 * 
 * Estructura del código:
 * 1. Configuración y variables globales
 * 2. Escenas del juego (MenuScene, GameScene, GameOverScene)
 * 3. Sistemas de juego (monedas, precios, venta, etc.)
 * 4. Interfaz de usuario y controles
 * 5. Utilidades y helpers
 */

// ===== CONFIGURACIÓN GLOBAL =====
// Nota: La configuración del juego se define después de las clases para evitar errores de referencia

// ===== VARIABLES GLOBALES =====
let game;

// Configuración del juego (fácil de modificar)
const GAME_SETTINGS = {
    GAME_DURATION: 120, // Duración del juego en segundos
    COIN_SPAWN_MIN: 300, // Tiempo mínimo entre spawns de monedas (ms) - Mucho más frecuente
    COIN_SPAWN_MAX: 1000, // Tiempo máximo entre spawns de monedas (ms) - Mucho más frecuente
    COIN_FALL_SPEED: 300, // Velocidad de caída de monedas (más rápida)
    COIN_FALL_SPEED_VARIATION: 80, // Variación en velocidad de caída
    PLAYER_SPEED: 500, // Velocidad de movimiento del jugador (más rápida)
    // NOTA: Aceleración y fricción eliminadas para movimiento directo
    SELL_TIME: 2000, // Tiempo necesario para vender (ms)
    PRICE_UPDATE_INTERVAL: 1000, // Intervalo de actualización de precios (ms)
    PRICE_VOLATILITY: 0.03, // Volatilidad de precios por actualización (3% máximo)
    PRICE_TREND_MIN_DURATION: 5000, // Duración mínima de una tendencia (ms)
    PRICE_TREND_MAX_DURATION: 15000, // Duración máxima de una tendencia (ms)
    INITIAL_BITCOIN_PRICE: 50000,
    INITIAL_ETHEREUM_PRICE: 3000,
    PLAYER_BOUNDS_MARGIN: 50, // Margen desde los bordes de la pantalla
    MAX_COINS_ON_SCREEN: 25, // Máximo número de monedas simultáneas (más monedas en pantalla)
    COIN_MAGNETISM_DISTANCE: 60, // Distancia para efecto de atracción sutil
    COIN_RAIN_INTERVAL: 12000 // Intervalo para lluvia de monedas (ms) - Más frecuente
};

// ===== ESCENA DE MENÚ =====
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        console.log('📦 Cargando assets en MenuScene...');
        
        // Cargar todos los sprites desde la carpeta assets
        this.load.image('player', 'assets/player.png');
        this.load.image('coin1', 'assets/coin1.png'); // Bitcoin
        this.load.image('coin2', 'assets/coin2.png'); // Ethereum
        this.load.image('sell', 'assets/sell.png');
        
        // Añadir eventos para verificar la carga
        this.load.on('filecomplete', (key, type, data) => {
            console.log(`✅ Archivo cargado: ${key} (${type})`);
        });
        
        this.load.on('loaderror', (file) => {
            console.error(`❌ Error cargando: ${file.key} desde ${file.url}`);
        });
        
        this.load.on('complete', () => {
            console.log('✅ Todos los assets cargados correctamente');
        });
        
        console.log('📦 Iniciando carga de assets...');
    }

    create() {
        console.log('🏗️ Creando MenuScene...');
        
        // Crear texturas de colores dinámicamente
        this.createColorTextures();
        
        // Fondo del menú
        this.add.rectangle(512, 384, 1024, 768, 0x87CEEB);
        
        // Título del juego
        this.add.text(512, 200, '🪙 CRYPTOGAME', {
            fontSize: '64px',
            fill: '#2d3748',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(512, 260, 'Recoge y vende criptomonedas', {
            fontSize: '24px',
            fill: '#4a5568',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Mostrar récord actual
        const record = localStorage.getItem('cryptoGameRecord') || 0;
        this.add.text(512, 320, `Récord actual: $${parseFloat(record).toFixed(2)}`, {
            fontSize: '20px',
            fill: '#2f855a',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Botón de inicio
        const startButton = this.add.rectangle(512, 400, 200, 60, 0x48bb78)
            .setInteractive()
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => startButton.setFillStyle(0x38a169))
            .on('pointerout', () => startButton.setFillStyle(0x48bb78));
        
        this.add.text(512, 400, 'JUGAR', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Instrucciones mejoradas
        const instructions = [
            '🏃‍♂️ Muévete: Flechas ← → o A D (movimiento suave)',
            '🪙 Recoge monedas Bitcoin (₿) y Ethereum (Ξ)',
            '📊 Observa los precios en tiempo real (verde=sube, rojo=baja)',
            '💰 Mantén flecha derecha en SELL por 2 segundos para vender',
            '⏰ Tienes 2 minutos para maximizar ganancias',
            '🎯 Estrategia: Compra barato, vende caro'
        ];
        
        instructions.forEach((instruction, index) => {
            this.add.text(512, 480 + (index * 25), instruction, {
                fontSize: '14px',
                fill: '#4a5568'
            }).setOrigin(0.5);
        });
        
        console.log('✅ MenuScene creado');
    }
    
    createColorTextures() {
        // Crear texturas de colores usando el sistema de texturas de Phaser
        const graphics = this.add.graphics();
        
        // Crear textura verde
        graphics.fillStyle(0x48bb78);
        graphics.fillRect(0, 0, 200, 60);
        graphics.generateTexture('greenBox', 200, 60);
        
        // Crear textura roja
        graphics.clear();
        graphics.fillStyle(0xf56565);
        graphics.fillRect(0, 0, 200, 60);
        graphics.generateTexture('redBox', 200, 60);
        
        // Crear textura azul
        graphics.clear();
        graphics.fillStyle(0x4299e1);
        graphics.fillRect(0, 0, 200, 60);
        graphics.generateTexture('blueBox', 200, 60);
        
        // Limpiar el objeto graphics
        graphics.destroy();
    }

    startGame() {
        console.log('🎮 Iniciando juego...');
        this.scene.start('GameScene');
    }


}

// ===== ESCENA PRINCIPAL DEL JUEGO =====
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Variables de la escena
        this.player = null;
        this.playerShadow = null; // Sombra del jugador para efecto visual
        this.coins = null;
        this.cursors = null;
        this.wasdKeys = null;
        this.spaceKey = null; // Tecla adicional para funciones especiales
        
        // Variables de control del jugador
        this.playerDirection = 0; // -1 izquierda, 0 parado, 1 derecha
        this.isMoving = false;
        this.lastDirection = 1; // Para recordar la última dirección
        
        // Sistema de precios
        this.bitcoinPrice = GAME_SETTINGS.INITIAL_BITCOIN_PRICE;
        this.ethereumPrice = GAME_SETTINGS.INITIAL_ETHEREUM_PRICE;
        this.bitcoinPriceHistory = [];
        this.ethereumPriceHistory = [];
        this.priceUpdateTimer = 0;
        
        // Sistema de tendencias de precios
        this.bitcoinTrend = {
            direction: 1, // 1 = subiendo, -1 = bajando
            duration: 0,
            maxDuration: Phaser.Math.Between(GAME_SETTINGS.PRICE_TREND_MIN_DURATION, GAME_SETTINGS.PRICE_TREND_MAX_DURATION)
        };
        this.ethereumTrend = {
            direction: -1, // Empieza opuesto a Bitcoin
            duration: 0,
            maxDuration: Phaser.Math.Between(GAME_SETTINGS.PRICE_TREND_MIN_DURATION, GAME_SETTINGS.PRICE_TREND_MAX_DURATION)
        };
        
        // Sistema de inventario y venta
        this.collectedCoins = [];
        this.sellZone = null;
        this.sellTimer = 0;
        this.isSelling = false;
        
        // UI y puntuación
        this.balanceText = null;
        this.currentGainText = null;
        this.bitcoinIcon = null;
        this.bitcoinCountText = null;
        this.ethereumIcon = null;
        this.ethereumCountText = null;
        this.timerText = null;
        this.bitcoinPriceText = null;
        this.ethereumPriceText = null;
        this.bitcoinPriceBox = null;
        this.ethereumPriceBox = null;
        this.sellProgressBar = null;
        this.sellProgressBg = null;
        this.controlsHintText = null;
        
        this.currentBalance = 0;
        this.totalSold = 0;
        this.gameTimer = GAME_SETTINGS.GAME_DURATION;
        this.gameStarted = false;
        
        // Timers de Phaser
        this.coinSpawnTimer = null;
        this.priceUpdateEvent = null;
        
        // Efectos visuales
        this.collectParticles = null;
        this.sellParticles = null;
    }

    create() {
        console.log('🏗️ Creando GameScene...');
        
        // Reinicializar todas las variables del juego
        this.resetGameState();
        
        // Fondo del juego con gradiente
        this.createBackground();
        
        // Configurar controles mejorados
        this.setupControls();
        
        // Crear elementos del juego
        this.createPlayer();
        this.createCoinSystem();
        this.createSellSystem();
        this.createPriceSystem();
        this.createUI();
        this.createParticleEffects();
        this.initializeTimers();
        
        console.log('✅ GameScene creado correctamente');
        this.gameStarted = true;
    }

    update(time, delta) {
        if (!this.gameStarted) return;
        
        // Actualizar sistemas
        this.updatePlayer(delta);
        this.updateCoins();
        this.updatePrices(delta);
        this.updateSellSystem(delta);
        this.updateGameTimer(delta);
        this.updateUI();
        this.updateVisualEffects();
    }

    // ===== FUNCIONES DE REINICIALIZACIÓN =====
    
    resetGameState() {
        // Reinicializar variables de juego
        this.currentBalance = 0;
        this.totalSold = 0;
        this.gameTimer = GAME_SETTINGS.GAME_DURATION;
        this.gameStarted = false;
        
        // Reinicializar inventario y estadísticas
        this.collectedCoins = [];
        this.totalCoinsCollected = 0;
        this.bitcoinCollected = 0;
        this.ethereumCollected = 0;
        this.totalSales = 0;
        this.profitableSales = 0;
        
        // Reinicializar sistema de venta
        this.sellTimer = 0;
        this.isSelling = false;
        
        // Reinicializar precios y tendencias
        this.bitcoinPrice = GAME_SETTINGS.INITIAL_BITCOIN_PRICE;
        this.ethereumPrice = GAME_SETTINGS.INITIAL_ETHEREUM_PRICE;
        this.bitcoinPriceHistory = [];
        this.ethereumPriceHistory = [];
        this.priceUpdateTimer = 0;
        
        // Reinicializar tendencias de precios
        this.bitcoinTrend = {
            direction: 1,
            duration: 0,
            maxDuration: Phaser.Math.Between(GAME_SETTINGS.PRICE_TREND_MIN_DURATION, GAME_SETTINGS.PRICE_TREND_MAX_DURATION)
        };
        this.ethereumTrend = {
            direction: -1, // Empieza opuesto a Bitcoin
            duration: 0,
            maxDuration: Phaser.Math.Between(GAME_SETTINGS.PRICE_TREND_MIN_DURATION, GAME_SETTINGS.PRICE_TREND_MAX_DURATION)
        };
        
        // Reinicializar estadísticas de recolección
        this.collectionStats = {
            bitcoin: { count: 0, totalValue: 0 },
            ethereum: { count: 0, totalValue: 0 }
        };
        
        // Reinicializar variables de control del jugador
        this.playerDirection = 0;
        this.isMoving = false;
        this.lastDirection = 1;
        
        console.log('🔄 Estado del juego reinicializado');
    }

    // ===== FUNCIONES DE CREACIÓN DE ELEMENTOS =====

    createBackground() {
        // Crear fondo con gradiente y elementos decorativos
        this.add.rectangle(512, 384, 1024, 768, 0x87CEEB);
        
        // Añadir algunas nubes decorativas
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(100, 900),
                Phaser.Math.Between(50, 200),
                Phaser.Math.Between(80, 120),
                Phaser.Math.Between(40, 60),
                0xffffff,
                0.7
            );
            
            // Animación suave de las nubes
            this.tweens.add({
                targets: cloud,
                x: cloud.x + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(8000, 12000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Línea del suelo
        this.add.rectangle(512, 720, 1024, 96, 0x68d391, 0.3);
    }

    setupControls() {
        // Configurar controles principales
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Eventos de teclado para mejor control
        this.input.keyboard.on('keydown', (event) => {
            this.handleKeyDown(event);
        });
        
        this.input.keyboard.on('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    createPlayer() {
        // Crear sombra del jugador primero (debajo)
        this.playerShadow = this.add.ellipse(512, 680, 60, 20, 0x000000, 0.3);
        this.playerShadow.setDepth(50); // Capa intermedia para la sombra
        
        // Crear sprite del jugador
        this.player = this.physics.add.sprite(512, 650, 'player');
        
        // Configurar propiedades físicas del jugador
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.9); // Tamaño más grande y apropiado
        this.player.setSize(80, 100); // Hitbox ajustada
        this.player.setOffset(10, 10); // Centrar hitbox
        
        // Configurar física del jugador para movimiento DIRECTO (sin drag ni aceleración)
        this.player.setDrag(0); // Sin fricción para parada inmediata
        this.player.setMaxVelocity(GAME_SETTINGS.PLAYER_SPEED, 0);
        
        // Asegurar que el jugador esté por encima de otros elementos
        this.player.setDepth(100); // Por debajo de las monedas pero por encima del resto
        
        // Configurar límites personalizados (no tocar los bordes exactos)
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBoundsRectangle(
            new Phaser.Geom.Rectangle(
                GAME_SETTINGS.PLAYER_BOUNDS_MARGIN,
                500, // Límite superior
                1024 - (GAME_SETTINGS.PLAYER_BOUNDS_MARGIN * 2),
                200  // Altura permitida para el jugador
            )
        );
        
        // Animación de respiración sutil
        this.tweens.add({
            targets: this.player,
            scaleY: 0.72,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        console.log('👤 Jugador creado con controles mejorados');
    }

    createCoinSystem() {
        // Crear grupo de monedas con configuración física
        this.coins = this.physics.add.group({
            // Configuración por defecto para todas las monedas
            defaultKey: 'coin1',
            maxSize: -1, // Sin límite en el grupo, lo controlamos manualmente
            runChildUpdate: true
        });
        
        // Timer para spawn constante de monedas
        this.coinSpawnTimer = this.time.addEvent({
            delay: Phaser.Math.Between(GAME_SETTINGS.COIN_SPAWN_MIN, GAME_SETTINGS.COIN_SPAWN_MAX),
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
        });
        
        // Timer adicional para spawn múltiple ocasional (lluvia de monedas)
        this.coinRainTimer = this.time.addEvent({
            delay: GAME_SETTINGS.COIN_RAIN_INTERVAL,
            callback: this.spawnCoinRain,
            callbackScope: this,
            loop: true
        });
        
        // Configurar colisiones con área de detección más generosa
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        
        // NO configurar colisiones entre monedas para evitar movimiento horizontal
        // this.physics.add.collider(this.coins, this.coins, this.handleCoinCollision, null, this);
        
        console.log('🪙 Sistema de monedas creado con spawn constante');
    }
    
    spawnCoinRain() {
        // Crear lluvia ocasional de monedas con efectos especiales
        if (!this.gameStarted) return;
        
        const rainCount = Phaser.Math.Between(5, 8);
        
        // Activar partículas de lluvia especial
        this.rainParticles.start();
        this.time.delayedCall(3000, () => {
            this.rainParticles.stop();
        });
        
        // Mostrar mensaje de evento especial
        this.showSpecialEventMessage('🌧️ ¡LLUVIA DE MONEDAS!');
        
        for (let i = 0; i < rainCount; i++) {
            // Delay escalonado para que no aparezcan todas a la vez
            this.time.delayedCall(i * 150, () => {
                this.spawnCoin();
            });
        }
        
        // Efecto de pantalla (flash sutil)
        this.cameras.main.flash(200, 255, 215, 0, false);
        
        console.log(`🌧️ Lluvia de monedas especial: ${rainCount} monedas`);
    }
    
    showSpecialEventMessage(message) {
        // Crear mensaje de evento especial
        const eventText = this.add.text(512, 120, message, {
            fontSize: '28px',
            fill: '#ffd700',
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animación del mensaje
        this.tweens.add({
            targets: eventText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 2,
            ease: 'Back.easeOut'
        });
        
        // Desvanecer después de 2.5 segundos
        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: eventText,
                alpha: 0,
                y: eventText.y - 40,
                duration: 800,
                ease: 'Power2',
                onComplete: () => eventText.destroy()
            });
        });
    }
    
    handleCoinCollision(coin1, coin2) {
        // Efecto visual cuando las monedas chocan
        const midX = (coin1.x + coin2.x) / 2;
        const midY = (coin1.y + coin2.y) / 2;
        
        // Crear pequeño efecto de chispa
        const spark = this.add.circle(midX, midY, 3, 0xffffff, 0.8);
        
        this.tweens.add({
            targets: spark,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 200,
            onComplete: () => spark.destroy()
        });
        
        // Sonido sutil de colisión
        this.playCoinCollisionSound();
    }

    createSellSystem() {
        // Crear zona visual para el área de venta (más visible)
        this.sellZoneArea = this.add.rectangle(900, 400, 180, 350, 0xffd700, 0.15);
        this.sellZoneArea.setStrokeStyle(3, 0xffd700, 0.8);
        
        // Crear stand de venta
        this.sellZone = this.add.image(900, 400, 'sell');
        this.sellZone.setScale(0.9);
        this.sellZone.setDepth(10); // Asegurar que esté detrás del jugador
        
        // Añadir texto SELL con efecto mejorado
        this.sellText = this.add.text(900, 500, 'SELL', {
            fontSize: '36px',
            fill: '#2d3748',
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.sellText.setDepth(90); // Por encima del stand de venta
        
        // Animación del texto SELL
        this.tweens.add({
            targets: this.sellText,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Instrucciones de venta
        this.sellInstructionText = this.add.text(900, 540, 'Mantén → por 2 seg', {
            fontSize: '14px',
            fill: '#4a5568',
            fontWeight: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.sellInstructionText.setDepth(90); // Por encima del stand de venta
        
        // Fondo de la barra de progreso (más visible)
        this.sellProgressBg = this.add.rectangle(900, 80, 140, 16, 0x2d3748, 0.8);
        this.sellProgressBg.setStrokeStyle(2, 0x4a5568);
        this.sellProgressBg.setVisible(false);
        this.sellProgressBg.setDepth(90); // Por encima del stand de venta
        
        // Barra de progreso de venta
        this.sellProgressBar = this.add.rectangle(900, 80, 0, 12, 0x48bb78);
        this.sellProgressBar.setVisible(false);
        this.sellProgressBar.setDepth(95); // Por encima del fondo de la barra
        
        // Texto de progreso
        this.sellProgressText = this.add.text(900, 60, 'VENDIENDO...', {
            fontSize: '12px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.sellProgressText.setVisible(false);
        this.sellProgressText.setDepth(95); // Por encima del stand de venta
        
        // Indicador de valor del inventario
        this.potentialGainText = this.add.text(900, 110, '', {
            fontSize: '16px',
            fill: '#48bb78',
            fontWeight: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.potentialGainText.setDepth(90); // Por encima del stand de venta
        
        console.log('💰 Sistema de venta mejorado creado');
    }

    createPriceSystem() {
        // Crear paneles de fondo para las gráficas
        this.bitcoinGraphPanel = this.add.rectangle(150, 240, 280, 100, 0x1a202c, 0.9);
        this.bitcoinGraphPanel.setStrokeStyle(2, 0x4a5568);
        
        this.ethereumGraphPanel = this.add.rectangle(150, 360, 280, 100, 0x1a202c, 0.9);
        this.ethereumGraphPanel.setStrokeStyle(2, 0x4a5568);
        
        // Crear contenedores para las gráficas (centrados con los paneles)
        this.bitcoinGraphContainer = this.add.container(150, 240);
        this.ethereumGraphContainer = this.add.container(150, 360);
        
        // Inicializar objetos de gráficas
        this.bitcoinGraph = this.add.graphics();
        this.ethereumGraph = this.add.graphics();
        
        // Añadir gráficas a sus contenedores
        this.bitcoinGraphContainer.add(this.bitcoinGraph);
        this.ethereumGraphContainer.add(this.ethereumGraph);
        
        // Configuración de las gráficas
        this.graphConfig = {
            width: 260,
            height: 80,
            maxPoints: 50,
            lineWidth: 2,
            greenColor: 0x48bb78,
            redColor: 0xf56565,
            gridColor: 0x2d3748
        };
        
        // Inicializar historial de precios
        this.bitcoinPriceHistory = [this.bitcoinPrice];
        this.ethereumPriceHistory = [this.ethereumPrice];
        
        // Crear títulos de las gráficas
        this.bitcoinTitleText = this.add.text(150, 200, '₿ BITCOIN', {
            fontSize: '14px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        this.ethereumTitleText = this.add.text(150, 320, 'Ξ ETHEREUM', {
            fontSize: '14px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Dibujar gráficas iniciales (empezar con tendencia positiva)
        this.drawPriceGraph(this.bitcoinGraph, this.bitcoinPriceHistory, true);
        this.drawPriceGraph(this.ethereumGraph, this.ethereumPriceHistory, true);
        
        console.log('📊 Sistema de gráficas en tiempo real creado');
    }
    
    drawPriceGraph(graphics, priceHistory, trendDirection) {
        // Limpiar la gráfica anterior
        graphics.clear();
        
        // Si no hay suficientes datos, no dibujar línea
        if (priceHistory.length < 2) return;
        
        // Determinar color basado en la tendencia REAL (comparar último precio con anterior)
        const currentPrice = priceHistory[priceHistory.length - 1];
        const previousPrice = priceHistory[priceHistory.length - 2];
        const isRising = currentPrice >= previousPrice;
        
        // Configurar colores según la tendencia real
        const lineColor = isRising ? this.graphConfig.greenColor : this.graphConfig.redColor;
        const fillColor = isRising ? 0x48bb78 : 0xf56565;
        
        // Definir márgenes para mantener la gráfica dentro del panel
        const margin = 10;
        const graphWidth = this.graphConfig.width - (margin * 2);
        const graphHeight = this.graphConfig.height - (margin * 2);
        // Centrar la gráfica dentro del contenedor
        const offsetX = -(graphWidth / 2);
        const offsetY = -(graphHeight / 2);
        
        // Dibujar rejilla de fondo sutil
        graphics.lineStyle(1, this.graphConfig.gridColor, 0.2);
        for (let i = 0; i <= 4; i++) {
            const y = offsetY + (graphHeight / 4) * i;
            graphics.moveTo(offsetX, y);
            graphics.lineTo(offsetX + graphWidth, y);
        }
        
        // Calcular valores mínimos y máximos para normalizar
        const minPrice = Math.min(...priceHistory);
        const maxPrice = Math.max(...priceHistory);
        const priceRange = maxPrice - minPrice || 1; // Evitar división por cero
        
        // Calcular puntos de la gráfica
        const points = [];
        const maxPointsToShow = Math.min(priceHistory.length, this.graphConfig.maxPoints);
        const stepX = graphWidth / (maxPointsToShow - 1);
        
        // Tomar los últimos N puntos del historial
        const startIndex = Math.max(0, priceHistory.length - maxPointsToShow);
        
        for (let i = 0; i < maxPointsToShow; i++) {
            const priceIndex = startIndex + i;
            const x = offsetX + (i * stepX);
            const normalizedPrice = (priceHistory[priceIndex] - minPrice) / priceRange;
            const y = offsetY + graphHeight - (normalizedPrice * graphHeight);
            points.push({ x, y });
        }
        
        // Dibujar área de relleno con gradiente
        if (points.length > 1) {
            graphics.fillStyle(fillColor, 0.15);
            graphics.beginPath();
            graphics.moveTo(points[0].x, offsetY + graphHeight);
            points.forEach(point => graphics.lineTo(point.x, point.y));
            graphics.lineTo(points[points.length - 1].x, offsetY + graphHeight);
            graphics.closePath();
            graphics.fillPath();
        }
        
        // Dibujar línea principal
        graphics.lineStyle(this.graphConfig.lineWidth, lineColor, 1);
        graphics.beginPath();
        if (points.length > 0) {
            graphics.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                graphics.lineTo(points[i].x, points[i].y);
            }
        }
        graphics.strokePath();
        
        // Dibujar punto actual (último punto) más visible
        if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            // Círculo de fondo blanco
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(lastPoint.x, lastPoint.y, 4);
            // Círculo de color principal
            graphics.fillStyle(lineColor, 1);
            graphics.fillCircle(lastPoint.x, lastPoint.y, 3);
        }
    }

    createUI() {
        // Panel superior izquierdo - Balance encima de las gráficas
        const balancePanel = this.add.rectangle(150, 100, 280, 110, 0x2d3748, 0.9);
        balancePanel.setStrokeStyle(2, 0x4a5568);
        balancePanel.setDepth(85); // Por encima del fondo
        
        this.balanceText = this.add.text(150, 65, 'Balance: $0.00', {
            fontSize: '22px',
            fill: '#48bb78',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.balanceText.setDepth(90); // Por encima del panel
        
        this.currentGainText = this.add.text(150, 90, 'Ganancia Actual: $0.00', {
            fontSize: '16px',
            fill: '#a0aec0'
        }).setOrigin(0.5);
        this.currentGainText.setDepth(90); // Por encima del panel
        
        // Inventario con imágenes de monedas (centrado y ordenado)
        this.bitcoinIcon = this.add.image(110, 130, 'coin1');
        this.bitcoinIcon.setScale(0.2);
        this.bitcoinIcon.setDepth(90);
        
        this.bitcoinCountText = this.add.text(125, 130, '0', {
            fontSize: '14px',
            fill: '#f7931a',
            fontWeight: 'bold'
        }).setOrigin(0, 0.5);
        this.bitcoinCountText.setDepth(90);
        
        this.ethereumIcon = this.add.image(160, 130, 'coin2');
        this.ethereumIcon.setScale(0.2);
        this.ethereumIcon.setDepth(90);
        
        this.ethereumCountText = this.add.text(175, 130, '0', {
            fontSize: '14px',
            fill: '#627eea',
            fontWeight: 'bold'
        }).setOrigin(0, 0.5);
        this.ethereumCountText.setDepth(90);
        
        // Timer del juego con mejor estilo
        const timerBg = this.add.rectangle(512, 50, 200, 50, 0x2d3748, 0.8);
        timerBg.setStrokeStyle(2, 0x4a5568);
        timerBg.setDepth(85); // Por encima del fondo
        
        this.timerText = this.add.text(512, 50, 'Tiempo: 2:00', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.timerText.setDepth(90); // Por encima del panel
        
        // Precios de criptomonedas debajo de las gráficas
        this.bitcoinPriceText = this.add.text(150, 280, '$50,000', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.bitcoinPriceText.setDepth(90); // Por encima de las gráficas
        
        this.ethereumPriceText = this.add.text(150, 400, '$3,000', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.ethereumPriceText.setDepth(90); // Por encima de las gráficas
        
        // Indicadores de tendencia junto a los precios
        this.bitcoinTrendText = this.add.text(230, 280, '↗️', {
            fontSize: '16px',
            fill: '#48bb78',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.bitcoinTrendText.setDepth(90); // Por encima de las gráficas
        
        this.ethereumTrendText = this.add.text(230, 400, '↘️', {
            fontSize: '16px',
            fill: '#f56565',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.ethereumTrendText.setDepth(90); // Por encima de las gráficas
        
        // Indicador de controles dinámico
        this.controlsHintText = this.add.text(512, 720, 'Usa ← → o A D para moverte', {
            fontSize: '14px',
            fill: '#4a5568',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.controlsHintText.setDepth(90); // Por encima del fondo
        

        
        console.log('🖥️ Interfaz de usuario creada');
    }

    createParticleEffects() {
        // Partículas para recolección de Bitcoin
        this.bitcoinCollectParticles = this.add.particles(0, 0, 'coin1', {
            scale: { start: 0.4, end: 0 },
            speed: { min: 60, max: 150 },
            lifespan: 600,
            quantity: 8,
            emitting: false,
            tint: 0xf7931a, // Color Bitcoin
            alpha: { start: 1, end: 0 }
        });
        this.bitcoinCollectParticles.setDepth(105); // Por encima del jugador
        
        // Partículas para recolección de Ethereum
        this.ethereumCollectParticles = this.add.particles(0, 0, 'coin2', {
            scale: { start: 0.4, end: 0 },
            speed: { min: 60, max: 150 },
            lifespan: 600,
            quantity: 8,
            emitting: false,
            tint: 0x627eea, // Color Ethereum
            alpha: { start: 1, end: 0 }
        });
        this.ethereumCollectParticles.setDepth(105); // Por encima del jugador
        
        // Partículas para venta (mantener compatibilidad)
        this.sellParticles = this.add.particles(0, 0, 'coin1', {
            scale: { start: 0.5, end: 0 },
            speed: { min: 100, max: 200 },
            lifespan: 800,
            quantity: 12,
            emitting: false,
            tint: 0xffd700, // Dorado para éxito
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 }
        });
        this.sellParticles.setDepth(105); // Por encima del jugador
        
        // Partículas ambientales sutiles (lluvia de monedas de fondo)
        this.ambientParticles = this.add.particles(0, 0, 'coin1', {
            x: { min: 0, max: 1024 },
            y: -50,
            scale: { start: 0.08, end: 0.02 },
            speedY: { min: 15, max: 40 },
            lifespan: 12000,
            quantity: 1,
            frequency: 4000,
            emitting: true,
            tint: [0xffd700, 0xffff00, 0xffa500],
            alpha: { start: 0.2, end: 0 }
        });
        this.ambientParticles.setDepth(5); // Por detrás de todo (efecto ambiental)
        
        // Partículas para efectos especiales (lluvia de monedas)
        this.rainParticles = this.add.particles(0, 0, 'coin2', {
            x: { min: 0, max: 1024 },
            y: -30,
            scale: { start: 0.3, end: 0.1 },
            speedY: { min: 80, max: 150 },
            lifespan: 4000,
            quantity: 3,
            frequency: 200,
            emitting: false,
            tint: [0x627eea, 0x4169e1, 0x6495ed],
            alpha: { start: 0.8, end: 0 }
        });
        this.rainParticles.setDepth(105); // Por encima del jugador durante eventos especiales
        
        console.log('✨ Efectos de partículas mejorados creados');
    }

    initializeTimers() {
        // Timer para actualización de precios
        this.priceUpdateEvent = this.time.addEvent({
            delay: GAME_SETTINGS.PRICE_UPDATE_INTERVAL,
            callback: this.updateCryptoPrices,
            callbackScope: this,
            loop: true
        });
        
        console.log('⏰ Timers inicializados');
    }

    // ===== FUNCIONES DE ACTUALIZACIÓN MEJORADAS =====

    updatePlayer(delta) {
        // Determinar dirección de movimiento
        this.isMoving = false;
        
        if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
            // Movimiento DIRECTO a la izquierda
            this.player.setVelocityX(-GAME_SETTINGS.PLAYER_SPEED);
            this.playerDirection = -1;
            this.lastDirection = -1;
            this.isMoving = true;
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            // Movimiento DIRECTO a la derecha
            this.player.setVelocityX(GAME_SETTINGS.PLAYER_SPEED);
            this.playerDirection = 1;
            this.lastDirection = 1;
            this.isMoving = true;
        } else {
            // PARADA INMEDIATA cuando no se presiona nada
            this.player.setVelocityX(0);
            this.playerDirection = 0;
        }
        
        // Actualizar dirección del jugador (volteo horizontal)
        if (this.playerDirection !== 0) {
            this.player.setFlipX(this.playerDirection < 0);
        }
        
        // Actualizar posición de la sombra
        this.playerShadow.x = this.player.x;
        this.playerShadow.y = this.player.y + 30;
        
        // Efecto de movimiento en la sombra
        const shadowScale = this.isMoving ? 0.8 : 1.0;
        this.playerShadow.setScale(shadowScale, 0.3);
    }

    updateCoins() {
        // Actualizar posición de monedas y eliminar las que salen de pantalla
        this.coins.children.entries.forEach(coin => {
            // Eliminar monedas que tocan el suelo
            if (coin.y > 750) {
                // Efecto visual al tocar el suelo
                this.createCoinDisappearEffect(coin.x, coin.y);
                coin.destroy();
                return;
            }
            
            // Los colores son fijos, no necesitan actualización
            
            // Efecto de atracción sutil hacia el jugador si está cerca
            this.updateCoinMagnetism(coin);
        });
    }
    

    
    updateCoinMagnetism(coin) {
        // Efecto de atracción sutil cuando el jugador está muy cerca
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            coin.x, coin.y
        );
        
        // Si el jugador está muy cerca, solo atraer horizontalmente (mantener caída vertical)
        if (distance < GAME_SETTINGS.COIN_MAGNETISM_DISTANCE && distance > 20) {
            const angle = Phaser.Math.Angle.Between(
                coin.x, coin.y,
                this.player.x, this.player.y
            );
            
            // Aplicar fuerza de atracción SOLO horizontal (mantener velocidad Y)
            const attractionForce = 20;
            const currentVelocityY = coin.body.velocity.y; // Preservar velocidad vertical
            coin.body.setVelocityX(Math.cos(angle) * attractionForce);
            coin.body.setVelocityY(currentVelocityY); // Restaurar velocidad vertical
        } else {
            // Si no hay atracción, mantener solo movimiento vertical
            coin.body.setVelocityX(0);
        }
    }
    
    createCoinDisappearEffect(x, y) {
        // Crear efecto visual cuando una moneda toca el suelo
        const disappearEffect = this.add.circle(x, y, 20, 0xffffff, 0.5);
        disappearEffect.setDepth(108); // Por encima de las monedas
        
        // Animación de desvanecimiento
        this.tweens.add({
            targets: disappearEffect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => disappearEffect.destroy()
        });
        
        // Crear partículas de polvo
        const dustParticles = this.add.particles(x, y, 'coin1', {
            scale: { start: 0.1, end: 0 },
            speed: { min: 20, max: 50 },
            lifespan: 300,
            quantity: 3,
            tint: 0xd2b48c
        });
        
        dustParticles.explode();
        
        // Limpiar partículas después de un momento
        this.time.delayedCall(500, () => {
            dustParticles.destroy();
        });
    }

    updatePrices(delta) {
        this.priceUpdateTimer += delta;
    }

    updateSellSystem(delta) {
        // Verificar si el jugador está en la zona de venta
        const playerInSellZone = this.player.x > 810 && (this.cursors.right.isDown || this.wasdKeys.D.isDown);
        
        // Mostrar cantidad de monedas recolectadas
        this.updateInventoryDisplay();
        
        if (playerInSellZone && this.collectedCoins.length > 0) {
            if (!this.isSelling) {
                this.isSelling = true;
                this.sellTimer = 0;
                this.sellProgressBg.setVisible(true);
                this.sellProgressBar.setVisible(true);
                this.sellProgressText.setVisible(true);
                this.controlsHintText.setText('Mantén → presionado para vender...');
                
                // Efecto visual en la zona de venta
                this.sellZoneArea.setAlpha(0.3);
                this.tweens.add({
                    targets: this.sellZoneArea,
                    alpha: 0.15,
                    duration: 200
                });
            }
            
            this.sellTimer += delta;
            
            // Actualizar barra de progreso
            const progress = Math.min(this.sellTimer / GAME_SETTINGS.SELL_TIME, 1);
            this.sellProgressBar.setSize(140 * progress, 12);
            
            // Cambiar color de la barra según progreso
            if (progress < 0.3) {
                this.sellProgressBar.setFillStyle(0xffd700); // Amarillo
                this.sellProgressText.setText('VENDIENDO...');
            } else if (progress < 0.7) {
                this.sellProgressBar.setFillStyle(0xff8c00); // Naranja
                this.sellProgressText.setText('PROCESANDO...');
            } else {
                this.sellProgressBar.setFillStyle(0x48bb78); // Verde
                this.sellProgressText.setText('¡CASI LISTO!');
            }
            
            // Efecto de pulsación en el texto SELL durante la venta
            if (this.sellText) {
                this.sellText.setTint(0xffffff);
            }
            
            // Vender después del tiempo requerido
            if (this.sellTimer >= GAME_SETTINGS.SELL_TIME) {
                this.sellAllCoins();
                this.completeSale();
            }
        } else {
            if (this.isSelling) {
                this.cancelSale();
            }
        }
    }
    
    updateInventoryDisplay() {
        if (this.collectedCoins.length === 0) {
            this.potentialGainText.setText('');
            return;
        }
        
        // Calcular ganancia/pérdida potencial
        let potentialProfit = 0;
        this.collectedCoins.forEach(coin => {
            const currentPrice = coin.type === 'coin1' ? this.bitcoinPrice : this.ethereumPrice;
            potentialProfit += (currentPrice - coin.purchasePrice);
        });
        
        this.potentialGainText.setText(`Ganancia: ${potentialProfit >= 0 ? '+' : ''}$${potentialProfit.toFixed(2)}`);
        this.potentialGainText.setColor(potentialProfit >= 0 ? '#48bb78' : '#f56565'); // Verde para ganancia, rojo para pérdida
    }
    
    completeSale() {
        // Completar venta exitosamente
        this.isSelling = false;
        this.sellTimer = 0;
        this.hideSellProgress();
        
        // Efecto de éxito
        this.sellText.clearTint();
        this.tweens.add({
            targets: this.sellText,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
        });
        
        this.controlsHintText.setText('¡Venta completada! Sigue recogiendo monedas');
        
        // Limpiar indicador de valor
        this.potentialGainText.setText('');
    }
    
    cancelSale() {
        // Cancelar venta en progreso
        this.isSelling = false;
        this.sellTimer = 0;
        this.hideSellProgress();
        this.sellText.clearTint();
        this.controlsHintText.setText('Usa ← → o A D para moverte');
    }
    
    hideSellProgress() {
        // Ocultar elementos de progreso de venta
        this.sellProgressBg.setVisible(false);
        this.sellProgressBar.setVisible(false);
        this.sellProgressText.setVisible(false);
        this.sellZoneArea.setAlpha(0.15);
    }

    updateGameTimer(delta) {
        this.gameTimer -= delta / 1000;
        
        // Cambiar color del timer cuando queda poco tiempo
        if (this.gameTimer <= 30) {
            this.timerText.setColor('#ff6b6b');
            
            // Efecto de parpadeo en los últimos 10 segundos
            if (this.gameTimer <= 10) {
                this.timerText.setAlpha(Math.sin(this.time.now * 0.01) * 0.5 + 0.5);
            }
        }
        
        if (this.gameTimer <= 0) {
            this.endGame();
        }
    }

    updateUI() {
        // Actualizar textos de la interfaz mostrando claramente que son dólares
        this.balanceText.setText(`Balance: $${Math.round(this.currentBalance)}`);
        
        // Cambiar color del balance según si es positivo o negativo
        if (this.currentBalance >= 0) {
            this.balanceText.setColor('#48bb78'); // Verde para positivo
        } else {
            this.balanceText.setColor('#f56565'); // Rojo para negativo
        }
        
        // Calcular ganancia actual (valor potencial del inventario)
        let currentGain = 0;
        this.collectedCoins.forEach(coin => {
            const currentPrice = coin.type === 'coin1' ? this.bitcoinPrice : this.ethereumPrice;
            currentGain += (currentPrice - coin.purchasePrice);
        });
        
        // Mostrar ganancia actual con color
        this.currentGainText.setText(`Ganancia Actual: ${currentGain >= 0 ? '+' : ''}$${currentGain.toFixed(2)}`);
        if (currentGain >= 0) {
            this.currentGainText.setColor('#48bb78'); // Verde para ganancia
        } else {
            this.currentGainText.setColor('#f56565'); // Rojo para pérdida
        }
        
        // Actualizar contadores de inventario
        const bitcoinInInventory = this.collectedCoins.filter(coin => coin.type === 'coin1').length;
        const ethereumInInventory = this.collectedCoins.filter(coin => coin.type === 'coin2').length;
        
        this.bitcoinCountText.setText(bitcoinInInventory.toString());
        this.ethereumCountText.setText(ethereumInInventory.toString());
        
        const minutes = Math.floor(this.gameTimer / 60);
        const seconds = Math.floor(this.gameTimer % 60);
        this.timerText.setText(`Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        this.bitcoinPriceText.setText(`$${this.bitcoinPrice.toLocaleString()}`);
        this.ethereumPriceText.setText(`$${this.ethereumPrice.toLocaleString()}`);
        
        // Determinar tendencias basadas en el cambio real de precios
        const bitcoinIsRising = this.bitcoinPriceHistory.length >= 2 ? 
            this.bitcoinPriceHistory[this.bitcoinPriceHistory.length - 1] >= this.bitcoinPriceHistory[this.bitcoinPriceHistory.length - 2] : true;
        const ethereumIsRising = this.ethereumPriceHistory.length >= 2 ? 
            this.ethereumPriceHistory[this.ethereumPriceHistory.length - 1] >= this.ethereumPriceHistory[this.ethereumPriceHistory.length - 2] : true;
        
        // Actualizar indicadores de tendencia basados en la realidad
        if (this.bitcoinTrendText) {
            const btcText = bitcoinIsRising ? '↗️' : '↘️';
            const btcColor = bitcoinIsRising ? '#48bb78' : '#f56565';
            this.bitcoinTrendText.setText(btcText);
            this.bitcoinTrendText.setColor(btcColor);
        }
        
        if (this.ethereumTrendText) {
            const ethText = ethereumIsRising ? '↗️' : '↘️';
            const ethColor = ethereumIsRising ? '#48bb78' : '#f56565';
            this.ethereumTrendText.setText(ethText);
            this.ethereumTrendText.setColor(ethColor);
        }
        
        // Actualizar las gráficas en tiempo real
        this.drawPriceGraph(this.bitcoinGraph, this.bitcoinPriceHistory, bitcoinIsRising);
        this.drawPriceGraph(this.ethereumGraph, this.ethereumPriceHistory, ethereumIsRising);
        

    }

    updateVisualEffects() {
        // Actualizar efectos visuales dinámicos
        
        // Efecto de respiración en el jugador cuando está quieto
        if (!this.isMoving && this.player) {
            const breathingScale = 0.9 + Math.sin(this.time.now * 0.003) * 0.025;
            this.player.setScale(breathingScale);
        } else if (this.isMoving && this.player) {
            // Cuando se mueve, mantener el scale base sin deformación
            this.player.setScale(0.9);
        }
        
        // Efecto de pulsación en los paneles de gráficas según tendencia
        if (this.bitcoinGraphPanel) {
            const bitcoinPulse = this.bitcoinTrend.direction > 0 ? 
                1 + Math.sin(this.time.now * 0.005) * 0.02 : 
                1 - Math.sin(this.time.now * 0.005) * 0.01;
            this.bitcoinGraphPanel.setScale(bitcoinPulse);
        }
        
        if (this.ethereumGraphPanel) {
            const ethereumPulse = this.ethereumTrend.direction > 0 ? 
                1 + Math.sin(this.time.now * 0.004) * 0.02 : 
                1 - Math.sin(this.time.now * 0.004) * 0.01;
            this.ethereumGraphPanel.setScale(ethereumPulse);
        }
        
        // Efecto de brillo en la zona de venta cuando hay monedas
        if (this.sellZoneArea && this.collectedCoins.length > 0) {
            const glowIntensity = 0.15 + Math.sin(this.time.now * 0.006) * 0.05;
            this.sellZoneArea.setAlpha(glowIntensity);
        }
        
        // Efecto de partículas ambientales más intenso cuando hay muchas monedas
        if (this.ambientParticles && this.coins.children.entries.length > 8) {
            this.ambientParticles.setFrequency(2000); // Más frecuente
        } else if (this.ambientParticles) {
            this.ambientParticles.setFrequency(4000); // Normal
        }
    }

    // ===== FUNCIONES DE CONTROL DE EVENTOS =====

    handleKeyDown(event) {
        // Manejar eventos especiales de teclado
        switch (event.code) {
            case 'Space':
                // Función especial con espacio (por ejemplo, mostrar ayuda)
                this.showQuickHelp();
                break;
        }
    }

    handleKeyUp(event) {
        // Manejar liberación de teclas si es necesario
    }

    showQuickHelp() {
        // Mostrar ayuda rápida temporal
        const helpText = this.add.text(512, 400, 
            'AYUDA RÁPIDA:\n' +
            '• Recoge monedas cuando los precios estén bajos\n' +
            '• Vende cuando los precios suban (cajas verdes)\n' +
            '• El beneficio = precio de venta - precio de compra', {
            fontSize: '16px',
            fill: '#2d3748',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 15 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Desvanecer después de 3 segundos
        this.tweens.add({
            targets: helpText,
            alpha: 0,
            duration: 3000,
            delay: 2000,
            onComplete: () => helpText.destroy()
        });
    }

    // ===== FUNCIONES DE LÓGICA DEL JUEGO =====

    spawnCoin() {
        if (!this.gameStarted) return;
        
        // Verificar si hay espacio para más monedas
        if (this.coins.children.entries.length >= GAME_SETTINGS.MAX_COINS_ON_SCREEN) {
            console.log('⚠️ Máximo de monedas alcanzado, esperando...');
            return;
        }
        
        // Elegir tipo de moneda aleatoriamente (50/50)
        const coinType = Math.random() < 0.5 ? 'coin1' : 'coin2';
        
        // Posición X aleatoria, evitando los extremos
        const x = Phaser.Math.Between(80, 944);
        
        // Crear moneda con física usando las imágenes PNG originales
        const coin = this.coins.create(x, -50, coinType);
        
        // Verificar que la moneda se creó correctamente
        if (!coin) {
            console.log('❌ Error: No se pudo crear la moneda');
            return;
        }
        
        // Configurar propiedades de la moneda
        coin.coinType = coinType;
        coin.setScale(0.5); // Tamaño más visible
        coin.setDepth(110); // Máxima prioridad visual - por encima de todo
        
        // Configurar física de la moneda
        coin.body.setCircle(25); // Hitbox circular más precisa
        coin.body.setCollideWorldBounds(false); // No rebotar en los bordes
        coin.body.setBounce(0); // Sin rebote
        
        // Configurar velocidad de caída SOLO vertical
        const fallSpeed = GAME_SETTINGS.COIN_FALL_SPEED + 
            Phaser.Math.Between(-GAME_SETTINGS.COIN_FALL_SPEED_VARIATION, GAME_SETTINGS.COIN_FALL_SPEED_VARIATION);
        coin.body.setVelocityY(fallSpeed);
        
        // NO movimiento horizontal - solo caída vertical
        coin.body.setVelocityX(0);
        
        // Las monedas mantienen sus colores originales de las imágenes PNG
        // coin1.png debería ser dorada (Bitcoin)
        // coin2.png debería ser azul (Ethereum)
        
        // Cada moneda vale 1, sin precio variable
        coin.value = 1;
        
        // Añadir rotación suave y constante
        coin.body.setAngularVelocity(Phaser.Math.Between(50, 150));
        
        // Efecto de aparición suave
        coin.setAlpha(0);
        this.tweens.add({
            targets: coin,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Añadir efecto de brillo pulsante
        this.tweens.add({
            targets: coin,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Programar próximo spawn con variación
        this.coinSpawnTimer.delay = Phaser.Math.Between(
            GAME_SETTINGS.COIN_SPAWN_MIN, 
            GAME_SETTINGS.COIN_SPAWN_MAX
        );
        
        console.log(`🪙 Nueva moneda spawneada: ${coinType} (Valor: ${coin.value})`);
    }

    collectCoin(player, coin) {
        // Evitar procesar la misma moneda múltiples veces
        if (coin.collected) {
            return; // Ya fue recogida, ignorar
        }
        
        // Marcar moneda como recogida inmediatamente
        coin.collected = true;
        
        // Obtener precio actual según el tipo de moneda
        const purchasePrice = coin.coinType === 'coin1' ? this.bitcoinPrice : this.ethereumPrice;
        
        // Añadir moneda al inventario con precio de compra
        this.collectedCoins.push({
            type: coin.coinType,
            purchasePrice: purchasePrice,
            collectionTime: this.time.now
        });
        
        // Log para verificar el precio de compra
        console.log(`🪙 Moneda recogida: ${coin.coinType} - Precio de compra: $${purchasePrice.toFixed(2)} - Total en inventario: ${this.collectedCoins.length}`);
        
        // Efecto de partículas diferenciado por tipo de moneda
        if (coin.coinType === 'coin1') {
            // Partículas de Bitcoin
            this.bitcoinCollectParticles.setPosition(coin.x, coin.y);
            this.bitcoinCollectParticles.start();
            this.time.delayedCall(400, () => {
                this.bitcoinCollectParticles.stop();
            });
        } else {
            // Partículas de Ethereum
            this.ethereumCollectParticles.setPosition(coin.x, coin.y);
            this.ethereumCollectParticles.start();
            this.time.delayedCall(400, () => {
                this.ethereumCollectParticles.stop();
            });
        }
        
        // Mostrar texto flotante con el precio de compra
        this.showCoinValueText(coin.x, coin.y, coin.coinType, purchasePrice);
        
        // Reproducir sonido de recolección (diferente según el tipo)
        this.playCollectSound(coin.coinType);
        
        // Efecto visual en el jugador más pronunciado
        this.tweens.add({
            targets: this.player,
            scaleX: 0.75,
            scaleY: 0.75,
            duration: 120,
            yoyo: true,
            ease: 'Back.easeOut'
        });
        
        // Efecto de brillo en el jugador
        this.player.setTint(0xffffff);
        this.time.delayedCall(200, () => {
            this.player.clearTint();
        });
        
        // Crear onda expansiva visual
        this.createCollectionWave(coin.x, coin.y);
        
        // Destruir moneda inmediatamente para evitar múltiples detecciones
        coin.destroy();
        
        // Actualizar estadísticas
        this.updateCollectionStats(coin.coinType, purchasePrice);
        
        console.log(`🪙 Moneda recogida: ${coin.coinType} (Precio: $${purchasePrice.toFixed(2)})`);
    }
    

    
    showCoinValueText(x, y, coinType, purchasePrice) {
        // Mostrar texto flotante con el precio de compra
        const symbol = coinType === 'coin1' ? '₿' : 'Ξ';
        const color = '#48bb78'; // Verde para compra
        const text = `${symbol} $${purchasePrice.toFixed(0)}`;
        
        const valueText = this.add.text(x, y, text, {
            fontSize: '16px',
            fill: color,
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        valueText.setDepth(115); // Por encima de las monedas
        
        // Animación del texto flotante
        this.tweens.add({
            targets: valueText,
            y: y - 50,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => valueText.destroy()
        });
    }
    
    createCollectionWave(x, y) {
        // Crear onda expansiva visual
        const wave = this.add.circle(x, y, 5, 0xffffff, 0.6);
        wave.setDepth(108); // Por encima de las monedas pero por debajo del texto
        
        this.tweens.add({
            targets: wave,
            scaleX: 4,
            scaleY: 4,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => wave.destroy()
        });
    }
    
    updateCollectionStats(coinType, value) {
        // Actualizar estadísticas de recolección
        if (!this.collectionStats) {
            this.collectionStats = {
                bitcoin: { count: 0, totalValue: 0 },
                ethereum: { count: 0, totalValue: 0 }
            };
        }
        
        // Actualizar contadores globales
        this.totalCoinsCollected = (this.totalCoinsCollected || 0) + 1;
        
        if (coinType === 'coin1') {
            this.collectionStats.bitcoin.count++;
            this.collectionStats.bitcoin.totalValue += value;
            this.bitcoinCollected = (this.bitcoinCollected || 0) + 1;
        } else {
            this.collectionStats.ethereum.count++;
            this.collectionStats.ethereum.totalValue += value;
            this.ethereumCollected = (this.ethereumCollected || 0) + 1;
        }
        
        // Inicializar estadísticas de venta si no existen
        this.totalSales = this.totalSales || 0;
        this.profitableSales = this.profitableSales || 0;
        
        // Log estadísticas cada 15 monedas
        if (this.totalCoinsCollected % 15 === 0) {
            console.log(`📊 Estadísticas: ${this.bitcoinCollected || 0}₿ + ${this.ethereumCollected || 0}Ξ = ${this.totalCoinsCollected} monedas | Ventas: ${this.totalSales}`);
        }
    }

    sellAllCoins() {
        if (this.collectedCoins.length === 0) return;
        
        let totalProfit = 0;
        let bitcoinCount = 0;
        let ethereumCount = 0;
        const coinsCount = this.collectedCoins.length;
        
        console.log(`💰 Iniciando venta de ${coinsCount} monedas:`);
        
        // Calcular ganancia/pérdida total
        this.collectedCoins.forEach((coin, index) => {
            // Obtener precio actual de venta
            const sellPrice = coin.type === 'coin1' ? this.bitcoinPrice : this.ethereumPrice;
            const profit = sellPrice - coin.purchasePrice;
            totalProfit += profit;
            
            if (coin.type === 'coin1') {
                bitcoinCount++;
            } else {
                ethereumCount++;
            }
            
            console.log(`  ${index + 1}. ${coin.type}: Compra $${coin.purchasePrice.toFixed(2)} → Venta $${sellPrice.toFixed(2)} = ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`);
        });
        
        console.log(`💰 RESUMEN VENTA: ${bitcoinCount}₿ + ${ethereumCount}Ξ = ${coinsCount} monedas | Ganancia total: ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`);
        
        // Actualizar balance
        const balanceAnterior = this.currentBalance;
        this.currentBalance += totalProfit;
        this.totalSold += totalProfit;
        
        console.log(`💰 Balance: $${balanceAnterior.toFixed(2)} + $${totalProfit.toFixed(2)} = $${this.currentBalance.toFixed(2)}`);
        
        // Efecto de partículas en el stand de venta
        this.sellParticles.setPosition(900, 400);
        this.sellParticles.start();
        
        this.time.delayedCall(300, () => {
            this.sellParticles.stop();
        });
        
        // Mostrar popup de venta mejorado
        this.showEnhancedSellPopup(totalProfit, bitcoinCount, ethereumCount);
        
        // Reproducir sonido de venta según ganancia/pérdida
        this.playSellSound(totalProfit >= 0);
        
        // Efecto visual en el stand
        this.tweens.add({
            targets: this.sellZone,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
        });
        
        // Efecto de éxito solo si hay ganancia
        if (totalProfit > 0) {
            this.createSuccessParticles();
        }
        
        // Limpiar inventario
        this.collectedCoins = [];
        
        // Actualizar estadísticas
        this.totalSales = (this.totalSales || 0) + 1;
        if (totalProfit > 0) {
            this.profitableSales = (this.profitableSales || 0) + 1;
        }
        
        console.log(`💰 Vendidas ${coinsCount} monedas (${bitcoinCount}₿ + ${ethereumCount}Ξ) por ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`);
    }

    updateCryptoPrices() {
        // Actualizar tendencias de Bitcoin (será la tendencia principal)
        this.updatePriceTrend(this.bitcoinTrend);
        
        // Ethereum tendrá la tendencia opuesta a Bitcoin (con una pequeña probabilidad de seguir la misma)
        // 85% de las veces será opuesta, 15% seguirá la misma tendencia para crear variabilidad
        const oppositeChance = 0.85;
        if (Math.random() < oppositeChance) {
            // Ethereum tiene tendencia opuesta a Bitcoin
            this.ethereumTrend.direction = -this.bitcoinTrend.direction;
            this.ethereumTrend.duration = this.bitcoinTrend.duration;
            this.ethereumTrend.maxDuration = this.bitcoinTrend.maxDuration;
        } else {
            // Ocasionalmente, actualizar Ethereum independientemente
            this.updatePriceTrend(this.ethereumTrend);
        }
        
        // Actualizar precio de Bitcoin siguiendo su tendencia
        const bitcoinChange = this.calculatePriceChange(this.bitcoinPrice, this.bitcoinTrend.direction);
        this.bitcoinPrice = Math.max(1000, this.bitcoinPrice + bitcoinChange);
        this.bitcoinPriceHistory.push(this.bitcoinPrice);
        
        // Actualizar precio de Ethereum siguiendo su tendencia (ahora mayormente opuesta)
        const ethereumChange = this.calculatePriceChange(this.ethereumPrice, this.ethereumTrend.direction);
        this.ethereumPrice = Math.max(100, this.ethereumPrice + ethereumChange);
        this.ethereumPriceHistory.push(this.ethereumPrice);
        
        // Mantener solo los últimos 60 precios (1 minuto de historial)
        if (this.bitcoinPriceHistory.length > 60) this.bitcoinPriceHistory.shift();
        if (this.ethereumPriceHistory.length > 60) this.ethereumPriceHistory.shift();
        
        // Log de tendencias para debug - mostrar que son opuestas
        if (Math.random() < 0.1) { // Solo 10% de las veces para no saturar
            console.log(`📈 Bitcoin: ${this.bitcoinTrend.direction > 0 ? '↗️' : '↘️'} $${this.bitcoinPrice.toFixed(0)} | Ethereum: ${this.ethereumTrend.direction > 0 ? '↗️' : '↘️'} $${this.ethereumPrice.toFixed(0)} ${this.bitcoinTrend.direction !== this.ethereumTrend.direction ? '(Opuestas)' : '(Iguales)'}`);
        }
    }
    
    updatePriceTrend(trend) {
        // Incrementar duración de la tendencia actual
        trend.duration += GAME_SETTINGS.PRICE_UPDATE_INTERVAL;
        
        // Si la tendencia ha durado lo suficiente, cambiar dirección
        if (trend.duration >= trend.maxDuration) {
            trend.direction *= -1; // Cambiar dirección (subir <-> bajar)
            trend.duration = 0;
            trend.maxDuration = Phaser.Math.Between(
                GAME_SETTINGS.PRICE_TREND_MIN_DURATION, 
                GAME_SETTINGS.PRICE_TREND_MAX_DURATION
            );
            
            const trendName = trend === this.bitcoinTrend ? 'Bitcoin' : 'Ethereum';
            const direction = trend.direction > 0 ? 'SUBIENDO' : 'BAJANDO';
            console.log(`🔄 ${trendName} cambió tendencia: ${direction} por ${(trend.maxDuration/1000).toFixed(1)}s`);
        }
    }
    
    calculatePriceChange(currentPrice, direction) {
        // Calcular cambio de precio basado en la tendencia
        const baseChange = Math.random() * GAME_SETTINGS.PRICE_VOLATILITY * currentPrice;
        
        // Aplicar dirección de la tendencia con algo de ruido
        const trendStrength = 0.7; // 70% sigue la tendencia, 30% es ruido
        const noise = (Math.random() - 0.5) * 2 * (1 - trendStrength);
        const trendComponent = direction * trendStrength;
        
        return baseChange * (trendComponent + noise);
    }

    endGame() {
        this.gameStarted = false;
        
        // Limpiar timers para evitar que sigan ejecutándose
        if (this.coinSpawnTimer) {
            this.coinSpawnTimer.destroy();
        }
        if (this.coinRainTimer) {
            this.coinRainTimer.destroy();
        }
        if (this.priceUpdateEvent) {
            this.priceUpdateEvent.destroy();
        }
        
        // Calcular estadísticas finales
        const gameStats = {
            finalBalance: this.currentBalance,
            totalSold: this.totalSold,
            coinsCollected: this.totalCoinsCollected || 0,
            bitcoinCollected: this.bitcoinCollected || 0,
            ethereumCollected: this.ethereumCollected || 0,
            totalSales: this.totalSales || 0,
            profitableSales: this.profitableSales || 0,
            gameTime: GAME_SETTINGS.GAME_DURATION / 1000, // en segundos
            averageProfit: this.totalSales > 0 ? (this.totalSold / this.totalSales) : 0,
            successRate: this.totalSales > 0 ? ((this.profitableSales / this.totalSales) * 100) : 0,
            coinsRemaining: this.collectedCoins ? this.collectedCoins.length : 0 // Monedas pendientes de vender
        };
        
        console.log('📊 Estadísticas finales:', gameStats);
        
        // Pasar datos a la escena de game over
        this.scene.start('GameOverScene', gameStats);
    }

    showSellPopup(profit) {
        // Crear texto temporal que se desvanece con mejor estilo
        const popupText = this.add.text(900, 300, `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`, {
            fontSize: '28px',
            fill: profit >= 0 ? '#48bb78' : '#f56565',
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animación de desvanecimiento mejorada
        this.tweens.add({
            targets: popupText,
            y: 250,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => popupText.destroy()
        });
    }
    
    showEnhancedSellPopup(totalProfit, bitcoinCount, ethereumCount) {
        // Texto principal de ganancia/pérdida
        const valueText = `${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`;
        const valueColor = totalProfit >= 0 ? '#48bb78' : '#f56565'; // Verde para ganancia, rojo para pérdida
        
        // Crear texto flotante principal
        const mainPopupText = this.add.text(900, 280, valueText, {
            fontSize: '36px',
            fill: valueColor,
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Crear texto de detalle
        const detailText = `${bitcoinCount}₿ + ${ethereumCount}Ξ`;
        const detailPopupText = this.add.text(900, 320, detailText, {
            fontSize: '18px',
            fill: '#4a5568',
            fontWeight: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animación del texto principal
        this.tweens.add({
            targets: mainPopupText,
            y: 220,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 2500,
            ease: 'Power2',
            onComplete: () => mainPopupText.destroy()
        });
        
        // Animación del texto de detalle
        this.tweens.add({
            targets: detailPopupText,
            y: 260,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            delay: 300,
            onComplete: () => detailPopupText.destroy()
        });
        
        // Efecto en el balance
        this.tweens.add({
            targets: this.balanceText,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 400,
            yoyo: true,
            ease: 'Back.easeOut'
        });
    }
    
    createSuccessParticles() {
        // Crear partículas de éxito (monedas doradas) alrededor del stand de venta
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const startX = 900 + Math.cos(angle) * distance;
            const startY = 400 + Math.sin(angle) * distance;
            
            const particle = this.add.circle(startX, startY, 4, 0xffd700);
            particle.setStrokeStyle(1, 0xffff00);
            
            this.tweens.add({
                targets: particle,
                x: startX + Math.cos(angle) * 80,
                y: startY + Math.sin(angle) * 80 - Math.random() * 40,
                alpha: 0,
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 1200 + Math.random() * 600,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    // ===== FUNCIONES DE SONIDO =====

    playCollectSound(coinType = 'coin1') {
        // Sonido diferente según el tipo de moneda
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Verificar si el contexto de audio está suspendido
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Frecuencias diferentes para cada tipo de moneda
            if (coinType === 'coin1') {
                // Bitcoin - Sonido más grave y rico
                oscillator.frequency.value = 880; // La4
            } else {
                // Ethereum - Sonido más agudo y cristalino
                oscillator.frequency.value = 1108; // Do#5
            }
            
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            // Silenciar errores de audio para no interrumpir el juego
            console.log('🔇 Audio no disponible:', error.message);
        }
    }
    
    playCoinCollisionSound() {
        // Sonido sutil cuando las monedas chocan
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('🔇 Audio no disponible:', error.message);
        }
    }

    playSellSound(isProfit = true) {
        // Sonido de venta diferenciado según ganancia/pérdida
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Verificar si el contexto de audio está suspendido
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            if (isProfit) {
                // Sonido de éxito - secuencia ascendente
                this.playSuccessSellSound(audioContext);
            } else {
                // Sonido de pérdida - secuencia descendente
                this.playLossSellSound(audioContext);
            }
        } catch (error) {
            console.log('🔇 Audio no disponible:', error.message);
        }
    }
    
    playSuccessSellSound(audioContext) {
        // Secuencia de éxito: notas ascendentes como caja registradora exitosa
        const notes = [800, 1000, 1200, 1400];
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.25);
            }, index * 80);
        });
    }
    
    playLossSellSound(audioContext) {
        // Secuencia de pérdida: notas descendentes
        const notes = [1000, 800, 600, 400];
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 120);
        });
    }
}

// ===== ESCENA DE GAME OVER =====
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // Recibir todas las estadísticas del juego
        this.finalBalance = data.finalBalance || 0;
        this.totalSold = data.totalSold || 0;
        this.coinsCollected = data.coinsCollected || 0;
        this.bitcoinCollected = data.bitcoinCollected || 0;
        this.ethereumCollected = data.ethereumCollected || 0;
        this.totalSales = data.totalSales || 0;
        this.profitableSales = data.profitableSales || 0;
        this.gameTime = data.gameTime || 120;
        this.averageProfit = data.averageProfit || 0;
        this.successRate = data.successRate || 0;
        this.coinsRemaining = data.coinsRemaining || 0;
    }

    create() {
        console.log('🏁 Creando GameOverScene...');
        
        // Fondo con gradiente
        this.add.rectangle(512, 384, 1024, 768, 0x2d3748);
        
        // Verificar récord
        const previousRecord = parseFloat(localStorage.getItem('cryptoGameRecord') || 0);
        const isNewRecord = this.finalBalance > previousRecord;
        
        if (isNewRecord) {
            localStorage.setItem('cryptoGameRecord', this.finalBalance.toString());
            this.playRecordSound();
        }
        
        // Título
        this.add.text(512, 80, isNewRecord ? '🏆 ¡NUEVO RÉCORD!' : '🎮 Juego Terminado', {
            fontSize: '42px',
            fill: isNewRecord ? '#ffd700' : '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Balance principal
        this.add.text(512, 140, `Balance Final: $${this.finalBalance.toFixed(0)}`, {
            fontSize: '36px',
            fill: '#48bb78',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Panel de estadísticas detalladas
        this.createStatsPanel();
        
        if (isNewRecord) {
            this.add.text(512, 200, '¡Felicidades por batir el récord!', {
                fontSize: '18px',
                fill: '#ffd700',
                fontStyle: 'italic'
            }).setOrigin(0.5);
        }
        
        // Botones
        const playAgainButton = this.add.rectangle(412, 650, 180, 50, 0x48bb78)
            .setInteractive()
            .on('pointerdown', () => {
                console.log('🔄 Reiniciando juego...');
                this.scene.start('MenuScene');
            })
            .on('pointerover', () => playAgainButton.setFillStyle(0x38a169))
            .on('pointerout', () => playAgainButton.setFillStyle(0x48bb78));
        
        this.add.text(412, 650, 'JUGAR DE NUEVO', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        const menuButton = this.add.rectangle(612, 650, 180, 50, 0x4299e1)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MenuScene'))
            .on('pointerover', () => menuButton.setFillStyle(0x3182ce))
            .on('pointerout', () => menuButton.setFillStyle(0x4299e1));
        
        this.add.text(612, 650, 'MENÚ PRINCIPAL', {
            fontSize: '16px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        console.log('✅ GameOverScene creado');
    }
    
    createStatsPanel() {
        // Panel de fondo para estadísticas
        const panelBg = this.add.rectangle(512, 420, 800, 320, 0x4a5568, 0.8);
        panelBg.setStrokeStyle(2, 0x718096);
        
        // Título del panel
        this.add.text(512, 280, '📊 ESTADÍSTICAS DETALLADAS', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Columna izquierda - Recolección
        const leftX = 350;
        let leftY = 320;
        
        this.add.text(leftX, leftY, '🪙 RECOLECCIÓN', {
            fontSize: '18px',
            fill: '#ffd700',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        leftY += 30;
        this.add.text(leftX, leftY, `Total: ${this.coinsCollected} monedas`, {
            fontSize: '16px',
            fill: '#e2e8f0'
        }).setOrigin(0.5);
        
        leftY += 25;
        this.add.text(leftX, leftY, `₿ Bitcoin: ${this.bitcoinCollected}`, {
            fontSize: '14px',
            fill: '#f7931a'
        }).setOrigin(0.5);
        
        leftY += 20;
        this.add.text(leftX, leftY, `Ξ Ethereum: ${this.ethereumCollected}`, {
            fontSize: '14px',
            fill: '#627eea'
        }).setOrigin(0.5);
        
        leftY += 30;
        const coinsPerMinute = this.gameTime > 0 ? ((this.coinsCollected / this.gameTime) * 60).toFixed(1) : 0;
        this.add.text(leftX, leftY, `Ritmo: ${coinsPerMinute}/min`, {
            fontSize: '14px',
            fill: '#a0aec0'
        }).setOrigin(0.5);
        
        // Columna derecha - Ventas
        const rightX = 674;
        let rightY = 320;
        
        this.add.text(rightX, rightY, '💰 VENTAS', {
            fontSize: '18px',
            fill: '#48bb78',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        rightY += 30;
        this.add.text(rightX, rightY, `Monedas pendientes: ${this.coinsRemaining}`, {
            fontSize: '16px',
            fill: '#e2e8f0'
        }).setOrigin(0.5);
        
        rightY += 25;
        this.add.text(rightX, rightY, `Operaciones: ${this.totalSales}`, {
            fontSize: '14px',
            fill: '#a0aec0'
        }).setOrigin(0.5);
        
        rightY += 20;
        const successColor = this.successRate >= 50 ? '#48bb78' : '#f56565';
        this.add.text(rightX, rightY, `Éxito: ${this.successRate.toFixed(1)}%`, {
            fontSize: '14px',
            fill: successColor
        }).setOrigin(0.5);
        
        rightY += 20;
        this.add.text(rightX, rightY, `Ganancia media: $${this.averageProfit.toFixed(0)}`, {
            fontSize: '14px',
            fill: '#a0aec0'
        }).setOrigin(0.5);
        
        // Evaluación del rendimiento
        rightY += 35;
        const performance = this.getPerformanceRating();
        this.add.text(rightX, rightY, performance.text, {
            fontSize: '14px',
            fill: performance.color,
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }
    
    getPerformanceRating() {
        if (this.finalBalance >= 500) {
            return { text: '🌟 ¡EXCELENTE!', color: '#ffd700' };
        } else if (this.finalBalance >= 200) {
            return { text: '👍 ¡MUY BIEN!', color: '#48bb78' };
        } else if (this.finalBalance >= 0) {
            return { text: '👌 BIEN', color: '#4299e1' };
        } else {
            return { text: '📈 SIGUE PRACTICANDO', color: '#f56565' };
        }
    }

    playRecordSound() {
        // Sonido especial para nuevo récord
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 200);
        });
    }
}

// ===== FUNCIONES DE CONTROL EXTERNO =====

function togglePause() {
    if (game && game.scene.isActive('GameScene')) {
        const gameScene = game.scene.getScene('GameScene');
        if (gameScene.scene.isPaused()) {
            gameScene.scene.resume();
            document.getElementById('pause-btn').textContent = '⏸️ Pausa';
        } else {
            gameScene.scene.pause();
            document.getElementById('pause-btn').textContent = '▶️ Reanudar';
        }
    }
}

function restartGame() {
    if (game) {
        game.scene.start('MenuScene');
        document.getElementById('pause-btn').textContent = '⏸️ Pausa';
    }
}

// ===== CONFIGURACIÓN DE PHASER (DESPUÉS DE LAS CLASES) =====
const GAME_CONFIG = {
    // Configuración de Phaser
    type: Phaser.AUTO,
    parent: 'phaser-game',
    backgroundColor: '#87CEEB', // Azul cielo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Sin gravedad global, la aplicaremos manualmente
            debug: false // Cambiar a true para ver hitboxes durante desarrollo
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1400,
            height: 1000
        }
    },
    scene: [MenuScene, GameScene, GameOverScene]
};

// ===== INICIALIZACIÓN =====

function initGame() {
    console.log('🎮 Inicializando CryptoGame...');
    
    // Crear instancia del juego
    game = new Phaser.Game(GAME_CONFIG);
    
    // Configurar controles externos
    setupExternalControls();
    
    console.log('✅ CryptoGame inicializado correctamente');
}

// ===== CONFIGURACIÓN DE CONTROLES EXTERNOS =====
function setupExternalControls() {
    // Botón de pausa
    pauseButton = document.getElementById('pause-btn');
    if (pauseButton) {
        pauseButton.addEventListener('click', togglePause);
    }
    
    // Botón de reinicio
    restartButton = document.getElementById('restart-btn');
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
}

// ===== INICIALIZACIÓN =====

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando CryptoGame...');
    initGame();
});

// Añadir estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        50% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .sell-popup {
        animation: fadeInOut 2s ease-in-out;
    }
`;
document.head.appendChild(style); 