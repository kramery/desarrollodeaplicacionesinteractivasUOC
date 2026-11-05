
//  - izquierda: un anillo que se completa, un círculo que crece y un punto que da una vuelta por cada minuto
//  - derecha: 10 círculos que se van rellenando donde cada uno es un 10 %

function setup() {
  let lienzo = createCanvas(300, 150);
  lienzo.parent('lienzo');
  frameRate(30);

  cargarDatos();      // popup.js
  crearControles();   // popup.js
}

function draw() {
  comprobarFinal();       // popup.js
  actualizarPantalla();   // popup.js
  dibujarReloj();
}

// Color según el momento que puede ser verde azulado, naranja o gris
function colorActual() {
  if (estado === 'pausado') return color(150);
  if (tipo === 'descanso') return color(200, 120, 40);
  return color(47, 111, 115);
}

function dibujarReloj() {
  let p = progreso();
  let c = colorActual();
  let segundos = (minutosDelPeriodo() * 60000 - tiempoRestante()) / 1000;

  background(255);

  // Anillo gris de fondo
  noFill();
  strokeWeight(8);
  stroke(225);
  circle(75, 75, 110);

  // Parte del anillo ya recorrida
  if (p > 0) {
    stroke(c);
    arc(75, 75, 110, 110, -HALF_PI, -HALF_PI + p * TWO_PI);
  }

  // Círculo central que crece con el progreso
  noStroke();
  fill(c);
  circle(75, 75, 10 + p * 60);

  // Punto que gira siendo una vuelta por minuto
  let angulo = (segundos / 60) * TWO_PI - HALF_PI;
  circle(75 + cos(angulo) * 44, 75 + sin(angulo) * 44, 8);

  // 10 círculos a la derecha que se rellenan según el progreso
  for (let i = 0; i < 10; i++) {
    let x = 170 + (i % 5) * 25;
    let y = 55 + floor(i / 5) * 40;
    if (i < floor(p * 10)) {
      fill(c);
    } else {
      fill(225);
    }
    circle(x, y, 18);
  }
}
