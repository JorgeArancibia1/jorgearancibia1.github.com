var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//Definir variables para las imagenes
var fondo, imgNave, imgEnemigo, imgDisparo, imgDisparoEnemigo;
var imagenes = ['monster.png','mono.png','enemyLaser.png','laser.png','space.jpg']; // Se declara un arreglo de imagenes.
var soundShoot,soundInvaderShoot,soundDeadSpace,soundDeadInvader,soundEndGame; // Se declaran variables para alojar los sonidos.
var preloader;

//CREAMOS OBJETO TECLADO VACÍO.
var teclado = {};
//ARRAY PARA LOS DISPAROS.
var disparos = [];
var disparosEnemigos = [];
//ARREGLO PARA ENEMIGOS.
var enemigos = [];


// CREAR EL OBJETO DE LA NAVE
var nave = {
  x: 100,
  y: canvas.height - 100,//El alto del canvas - 100px
  width: 50,
  height: 50,
  contador: 0
}

var juego = {
  estado: 'iniciando'
}

var textoRespuesta = {
  contador: -1,
  titulo: '',
  subtitulo: ''
}

// Trae la imagen y llama al frameloop que a su vez llama la función para dibujar el fondo.
function loadMedia() {
  preloader = new PreloadJS();
  preloader.onProgress = progresoCarga;
  cargar();
}

function cargar(){
  while(imagenes.length > 0){
     var imagen = imagenes.shift();
     preloader.loadFile(imagen);
  }
}

function progresoCarga(){
  if(preloader.progress == 1){
    var interval = window.setInterval(frameLoop,1000/50);

    //IMAGENES
    fondo = new Image();
    fondo.src = 'space.jpg';

    imgNave = new Image();
    imgNave.src = 'mono.png';

    imgEnemigo = new Image();
    imgEnemigo.src = 'monster.png';

    imgDisparo = new Image();
    imgDisparo.src = 'laser.png';

    imgDisparoEnemigo = new Image();
    imgDisparoEnemigo.src = 'enemyLaser.png';

    //AUDIOS
    soundShoot = document.createElement('audio'); // Se crea la etiqueta.
    document.body.appendChild(soundShoot); // Coloca el sonido como hijo del body.
    soundShoot.setAttribute('src','laserSpace.mp3'); // Le coloca un atributo y su valor a la etiqueta creada audio.
    
    soundInvaderShoot = document.createElement('audio');
    document.body.appendChild(soundInvaderShoot);
    soundInvaderShoot.setAttribute('src','laserAlien.mp3');

    soundDeadSpace = document.createElement('audio');
    document.body.appendChild(soundDeadSpace);
    soundDeadSpace.setAttribute('src','deadspaceShip.mp3');

    soundDeadInvader = document.createElement('audio');
    document.body.appendChild(soundDeadInvader);
    soundDeadInvader.setAttribute('src','deadInvader.mp3');

    soundEndGame = document.createElement('audio');
    document.body.appendChild(soundEndGame);
    soundEndGame.setAttribute('src','endGame.mp3');
  }
}

function dibujarEnemigos() {
  for (var i in enemigos) {
    var enemigo = enemigos[i];
    ctx.save();
    if (enemigo.estado == 'vivo') ctx.fillStyle = 'red'; //
    if (enemigo.estado == 'muerto') ctx.fillStyle = 'transparent'; //
    ctx.drawImage(imgEnemigo, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
  }
}

//DIBUJA EL FONDO
function dibujarFondo() {
  ctx.drawImage(fondo, 0, 0);
}

function dibujarNave() {
  //Guarda un punto en la pila del contexto(checkpoint, guarda la información actual que posee).
  ctx.save();
  ctx.drawImage(imgNave,nave.x,nave.y,nave.width,nave.height);
  ctx.restore();
}

function agregarEventosTeclado() {
  //Ejecutamos la función agregarEventos
  //Lo que hace esta en particular es agregar el numero de codigo de tecla al objeto "teclado" y lo va a colocar en "true" (teclado[32] = true;)
  agregarEvento(document, "keydown", function (e) { //Agregamos al documento el evento keydown, que cuando se presione una tecla se ejecuta la función.
    teclado[e.keyCode] = true; //Va a tomar el objeto del teclado y va a agregar como clave del evento el keyCode("Codigo que identifica la tecla presionada").
  });//Es como representar "teclado.n = true"(tecla n° x encendida)

  //PARA DEJAR EN FALSO LA TECLA QUE DEJÓ DE SER PRESIONADA.
  agregarEvento(document, "keyup", function (e) {
    teclado[e.keyCode] = false;
  });

  //Programamos la función agregarEventos
  function agregarEvento(elemento, nombreEvento, funcion) {
    if (elemento.addEventListener) { //Si existe addEventListener utilizalo.
      elemento.addEventListener(nombreEvento, funcion, false); //Aquí se asigna el elemento al cual se va a escuchar, que evento se ejecutara, que es lo que hará cuando se accione el evento y que inicie el escucha en falso.
    } else if (elemento.attachEvent) { //Para que funcione en internet explorer.
      elemento.attachEvent(nombreEvento, funcion);
    }
  }
}

function moverNave() {
  //MOVIMIENTO A LA IZQUIERDA
  if (teclado[37]) { //Si la tecla con keyCode 37 "flecha a la izquierda" es actualizada, se actualiza la posición de la nave.
    nave.x -= 6; // A la posición que tenga le vamos a quitar 10.
    if (nave.x < 0) nave.x = 0; // Para que no se salga del rango.
  }
  //MOVIMIENTO A LA DERECHA
  if (teclado[39]) { //Si la tecla con keyCode 37 "flecha a la derecha" es actualizada, se actualiza la posición de la nave.
    var limite = canvas.width - nave.width;
    nave.x += 6; // A la posición que tenga le vamos a quitar 10.
    if (nave.x > limite) nave.x = limite; // Para que no se salga del rango.
  }
  //DISPAROS
  if (teclado[32]) {
    //
    if (!teclado.fire) {
      fire();
      teclado.fire = true;
    }
  } else teclado.fire = false; // Si no esta precionada la tecla, que cancele la acción.

  if (nave.estado == 'hit') {
    nave.contador++;
    if (nave.contador >= 20) {
      nave.contador = 0;
      nave.estado = 'muerto';
      juego.estado = 'perdido';
      textoRespuesta.titulo = 'Game Over';
      textoRespuesta.subtitulo = 'Presiona la tecla R para jugar denuevo.'
      textoRespuesta.contador = 0;
    }
  }
}

function dibujarDisparosEnemigos() {
  for (var i in disparosEnemigos) {
    var disparo = disparosEnemigos[i];
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.drawImage(imgDisparoEnemigo,disparo.x, disparo.y,disparo.width,disparo.height);
    ctx.restore();
  }
}

function moverDisparosEnemigos() {
  for (var i in disparosEnemigos) {
    var disparo = disparosEnemigos[i];
    disparo.y += 6;
  }
  disparosEnemigos = disparosEnemigos.filter(function(disparo){
    return disparo.y < canvas.height
  })
}

function actualizaEnemigos() {
  function agregarDisparosEnemigos(enemigo){
    return {
      x: enemigo.x,
      y: enemigo.y + 35,
      width: 10,
      height: 33,
      contador: 0
    }
  }

  if (juego.estado == 'iniciando') {
    // ESTO DEFINE CUANTAS NAVES HABRÁ
    for (var i = 0; i < 10 ; i++) {
      enemigos.push({
        x: 10 + (i*50),// Esto ve la separación de naves enemigas.
        y: 10,
        height: 40,
        width: 40,
        estado: 'vivo',
        contador: 0
      });
    }
    juego.estado = 'jugando';
  }

  for (var i in enemigos) {
    var enemigo = enemigos[i];
    if (!enemigo) continue; // Si no esta el enemigo, se va a saltar al siguiente paso del ciclo.
    if (enemigo && enemigo.estado == 'vivo') { // Si el enemigo está vivo se va a mover.
      enemigo.contador++;
      
      //Formula de seno para que al aumentar el contador sea positivo y luego negativo.
      enemigo.x += Math.sin(enemigo.contador * Math.PI /90)*5;


      // PARA DISPARAR ALEATORIAMENTE
      if (aleatorio(0,enemigos.length * 20) == 4) {
        soundInvaderShoot.pause();
        soundInvaderShoot.currentTime = 0;
        soundInvaderShoot.play();
        disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
      }
    }

    if (enemigo && enemigo.estado == 'hit') {
      enemigo.contador++;
      if (enemigo.contador >= 20) {
        enemigo.estado = 'muerto';
        enemigo.contador = 0;
      }
    }
  }
  enemigos = enemigos.filter(function(enemigo){
    if (enemigo && enemigo.estado != 'muerto') return true;
    return false;
  });
}

// 
function moverDisparos() {
  //Este for recorre el arreglo de disparos.
  for (var i in disparos) {
    var disparo = disparos[i];
    disparo.y -= 10;
  }
  // Este filtro se encarga de eliminar del arreglo los disparos cuya coordenada en y hayan superado el tope del canvas que está en la coordenada 0.
  // Si no se eliminan los disparos que se salen de la pantalla, se consume mucha memoria.
  disparos = disparos.filter(function (disparo) {
    return disparo.y > 0;
  });
}

//AGREGA UN OBJETO AL ARREGLO DE LOS DISPAROS
function fire() {
  soundShoot.pause();
  soundShoot.currentTime = 0;
  soundShoot.play();

  disparos.push({
    x: nave.x + 20,
    y: nave.y - 30,
    width: 10,
    height: 30
  });
}

// CON ESTO MOSTRAMOS VISUALMENTE LOS DISPAROS, LOS DIBUJAMOS EN EL CANVAS.
function dibujarDisparos() {
  ctx.save(); // Salvamos la info actual del canvas.
  //ctx.fillStyle = 'white';
  for (var i in disparos) {
    var disparo = disparos[i];
    ctx.drawImage(imgDisparo,disparo.x, disparo.y,disparo.width,disparo.height);
  }
  ctx.restore(); // Cuando terminemos la regresamos como la encontramos.
}

function dibujaTexto() {
  if(textoRespuesta.contador == -1) return;
  var alpha = textoRespuesta.contador;
  if (alpha > 1) {
    for(var i in enemigos) {
      delete enemigos[i];
    }
  }
  ctx.save();
  // Permite dar un efecto para que letras aparescan de a poco.
  ctx.globalAlpha = alpha;
  if (juego.estado == 'perdido') {
    ctx.fillStyle = 'white' ;
    ctx.font = 'Bold 40pt Arial';
    ctx.fillText(textoRespuesta.titulo, 160, 200);
    ctx.font = '14pt Arial';
    ctx.fillText(textoRespuesta.subtitulo, 170, 250);
  }
  if (juego.estado == 'victoria') {
    ctx.fillStyle = 'white' ;
    ctx.font = 'Bold 40pt Arial';
    ctx.fillText(textoRespuesta.titulo, 80, 200);
    ctx.font = '14pt Arial';
    ctx.fillText(textoRespuesta.subtitulo, 90, 250);
  }
}

function actualizarEstadoJuego() {
  if (juego.estado == 'jugando' && enemigos.length == 0) {
    juego.estado = 'victoria';
    textoRespuesta.titulo = 'Derrotaste a los enemigos';
    textoRespuesta.subtitulo = 'Presiona R para reiniciar';
    textoRespuesta.contador = 0;
  }
  if (textoRespuesta.contador >= 0) {
    textoRespuesta.contador++;
  }
  if ((juego.estado == 'perdido' || juego.estado == 'victoria') && teclado[82]) {
    juego.estado = 'iniciando';
    nave.estado = 'vivo';
     textoRespuesta.contador = -1;
  }
}

function hit(a,b) {
  var hit = false;
  // El principio de A ¿está antes que el final de B? // ¿El final de A es mayor al principio de B?
  if (b.x + b.width >= a.x && b.x < a.x + a.width) {
    if(b.y + b.height >= a.y && b.y < a.y + a.height) {
      hit = true;
    }
  }
  //PB <= PrincipioA && FB >= FinalA
  if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
    if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
      hit = true;
    }
  }
  // PA <= PB && FA >= FB
  if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
    if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
      hit = true;
    }
  }
  return hit;
}

function verificarContacto() {
  for (var i in disparos) {
    var disparo = disparos[i];
    for(var j in enemigos) {
      var enemigo = enemigos[j];
      if ( hit(disparo,enemigo)) {
        enemigo.estado = 'hit';
        enemigo.contador++;
      }
    } 
  }
  if (nave.estado == 'hit' || nave.estado == 'muerto') return ;
  for (var i in disparosEnemigos) {
    var disparoEnemigo = disparosEnemigos[i];
    if (hit(disparoEnemigo, nave)) {
      soundDeadInvader.pause();
      soundDeadInvader.currentTime = 0;
      soundDeadInvader.play();

      nave.estado = 'hit';
    }
  }
}

function aleatorio(inferior, superior) {
  var posibilidades = superior - inferior;
  var a = Math.random() * posibilidades;
  a = Math.floor(a);
  return parseInt(inferior) + a;
}

//Se encarga de actualizar todas las posiciones de los jugadores y va a redibujar cada
// uno de los elementos del juego para el movimiento, además de dibujar el background.
function frameLoop() {
  //Para actualizar la nave cada vez que se ejecuta un nuevo frame.
  actualizarEstadoJuego();
  moverNave();
  moverDisparos();
  moverDisparosEnemigos();
  dibujarFondo();
  verificarContacto();
  actualizaEnemigos();
  dibujarEnemigos();
  dibujarDisparosEnemigos();
  dibujarDisparos();
  dibujaTexto();
  dibujarNave();
} 


//EJECUCIÓN DE FUNCIONES
window.addEventListener('load',init);

function init(){
    agregarEventosTeclado();
    loadMedia();
}