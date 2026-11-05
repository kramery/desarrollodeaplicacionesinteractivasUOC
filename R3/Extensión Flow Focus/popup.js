// Datos del temporizador 
let duracion = 25;            // minutos de concentración elegidos
let tipo = 'concentracion';   // concentracion o descanso
let estado = 'parado';        // parado, en marcha o pausado
let inicio = 0;               // momento en mls en que se pulsó Iniciar o Reanudar
let restante = 25 * 60000;    // ms que quedaban en ese momento
let sesiones = 0;             // sesiones de concentración completadas

const DESCANSO = 5;           // minutos de descanso

// Controles de la interfaz
let selectorDuracion;
let botonIniciar;
let botonReiniciar;


//Guardar y cargar

function guardarDatos() {
  storeItem('duracion', duracion);
  storeItem('tipo', tipo);
  storeItem('estado', estado);
  storeItem('inicio', inicio);
  storeItem('restante', restante);
  storeItem('sesiones', sesiones);
}

function cargarDatos() {
  duracion = leer('duracion', 25);
  tipo = leer('tipo', 'concentracion');
  estado = leer('estado', 'parado');
  inicio = leer('inicio', 0);
  restante = leer('restante', duracion * 60000);
  sesiones = leer('sesiones', 0);
}

// Lee un dato guardado y si no existe todavía, devuelve el valor por defecto
function leer(clave, valorPorDefecto) {
  let valor = getItem(clave);
  if (valor === null) {
    return valorPorDefecto;
  }
  return valor;
}


// calculos de tiempo

// Minutos que dura el periodo actual
function minutosDelPeriodo() {
  if (tipo === 'concentracion') {
    return duracion;
  }
  return DESCANSO;
}

// Tiempo que queda en mls quese calcula con la hora actual, no con un contador así es correcto aunque la ventana haya estado cerrada
function tiempoRestante() {
  if (estado === 'en marcha') {
    let transcurrido = Date.now() - inicio;
    return max(0, restante - transcurrido);
  }
  return restante; // parado o pausado: el tiempo no corre
}

// Progreso del periodo actual;0 al empezar, 1 al terminar
function progreso() {
  let total = minutosDelPeriodo() * 60000;
  return 1 - tiempoRestante() / total;
}

// Convierte milisegundos en texto "MM:SS"
function formatearTiempo(ms) {
  let segundos = ceil(ms / 1000);
  return nf(floor(segundos / 60), 2) + ':' + nf(segundos % 60, 2);
}


// Acciones de los botones

function iniciarOPausar() {
  if (estado === 'en marcha') {
    restante = tiempoRestante();   // guardo lo que queda
    estado = 'pausado';
  } else {
    inicio = Date.now();           // empiezo a contar desde ahora
    estado = 'en marcha';
  }
  guardarDatos();
}

function reiniciar() {
  tipo = 'concentracion';
  estado = 'parado';
  restante = duracion * 60000;
  guardarDatos();
}

function cambiarDuracion() {
  duracion = Number(selectorDuracion.value());
  restante = minutosDelPeriodo() * 60000;
  guardarDatos();
}

// Si el tiempo se ha acabado se pasa al periodo siguiente
function comprobarFinal() {
  if (estado === 'en marcha' && tiempoRestante() === 0) {
    if (tipo === 'concentracion') {
      sesiones = sesiones + 1;
      tipo = 'descanso';
    } else {
      tipo = 'concentracion';
    }
    estado = 'parado'; // el siguiente periodo espera a que pulse Iniciar
    restante = minutosDelPeriodo() * 60000;
    guardarDatos();
  }
}


// Interfaz

function crearControles() {
  selectorDuracion = createSelect();
  selectorDuracion.parent('fila-duracion');
  selectorDuracion.option('25 minutos', 25);
  selectorDuracion.option('45 minutos', 45);
  selectorDuracion.option('60 minutos', 60);
  selectorDuracion.selected(String(duracion));
  selectorDuracion.changed(cambiarDuracion);

  botonIniciar = createButton('Iniciar');
  botonIniciar.parent('botones');
  botonIniciar.mouseClicked(iniciarOPausar);

  botonReiniciar = createButton('Reiniciar');
  botonReiniciar.parent('botones');
  botonReiniciar.mouseClicked(reiniciar);
}

function actualizarPantalla() {
  let textoEstado;
  if (estado === 'pausado') {
    textoEstado = 'Pausado';
  } else if (tipo === 'concentracion') {
    textoEstado = 'Concentración';
  } else {
    textoEstado = 'Descanso';
  }
  if (estado === 'parado') {
    textoEstado = textoEstado + ' (pulsa Iniciar)';
  }

  let textoBoton = 'Iniciar';
  if (estado === 'en marcha') textoBoton = 'Pausar';
  if (estado === 'pausado') textoBoton = 'Reanudar';

  select('#estado').html(textoEstado);
  select('#tiempo').html(formatearTiempo(tiempoRestante()));
  select('#sesiones').html('Sesiones completadas: ' + sesiones);
  botonIniciar.html(textoBoton);

  // La duración solo se puede cambiar con el temporizador parado
  if (estado === 'parado') {
    selectorDuracion.removeAttribute('disabled');
  } else {
    selectorDuracion.attribute('disabled', '');
  }
}
