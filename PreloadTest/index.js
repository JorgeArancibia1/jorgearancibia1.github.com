function loadImage() {
    var preload = new createjs.LoadQueue();
    preload.addEventListener("fileload", handleFileComplete);
    preload.loadFile("MongoDB.png");
  }

  function handleFileComplete(event) {
    document.body.appendChild(event.result);
  }