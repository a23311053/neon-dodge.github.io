# Neon Dodge

Juego web indie minimalista hecho con JavaScript puro y Canvas.
Esquiva los bloques que caen y sobrevive el mayor tiempo posible.

**Jugar en línea:** https://a23311053.github.io/neon-dodge.github.io/

**Autor:** Ramon Viera Salas · Grupo IDGS7-2 · Hermosillo, Sonora

---

## Propuesta

### Concepto
El jugador controla un cuadro en la parte inferior de la pantalla.
Desde arriba caen bloques cada vez más rápido. Si uno te toca, pierdes.
La puntuación aumenta por cada segundo sobrevivido.

### Mecánicas
- Movimiento lateral con las flechas ← → (o A / D)
- En celular: arrastrar el dedo sobre la pantalla
- Los bloques aumentan en cantidad y velocidad con el tiempo
- Puntaje máximo guardado con `localStorage`
- Inicio y reinicio con la tecla Espacio o tocando la pantalla

### Estilo
- Minimalista: fondo oscuro, figuras geométricas, colores neón
- Fuente monoespaciada, sin imágenes externas

### Audio
Generado con la **Web Audio API** (sin archivos de sonido):
- Efecto corto al iniciar y al sumar puntos
- Efecto grave al chocar (game over)

### Tecnologías
| Tecnología | Uso |
|---|---|
| HTML5 Canvas | Dibujo del juego |
| JavaScript (ES6) | Lógica, colisiones, game loop |
| Web Audio API | Efectos de sonido |
| localStorage | Récord del jugador |
| GitHub Pages | Publicación en línea |

### Estructura del proyecto
```
neon-dodge/
├── index.html
├── style.css
├── game.js
└── README.md
```

### Game loop (resumen del código)
1. `update()`: mueve jugador y bloques, detecta colisiones, sube dificultad
2. `draw()`: limpia el canvas y dibuja jugador, bloques y puntaje
3. `requestAnimationFrame(loop)`: repite el ciclo a ~60 FPS

### Cómo ejecutarlo localmente
```bash
git clone https://github.com/a23311053/neon-dodge.github.io.git
cd neon-dodge.github.io
# abrir index.html en el navegador
```

### Publicación en GitHub Pages
Settings → Pages → Branch: `main` → carpeta `/ (root)` → Save

### Video explicativo
Enlace: 

### Licencia
MIT: código libre para usar y modificar.
