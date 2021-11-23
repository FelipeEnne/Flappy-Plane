function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

function barrierCreate(reverse = false) {
  this.element = newElement("div", "barrier");

  const border = newElement("div", "border");
  const body = newElement("div", "body");

  this.element.appendChild(reverse ? body : border);
  this.element.appendChild(reverse ? border : body);

  this.setHeight = (h) => (body.style.height = `${h}px`);
}

function pairBarrier(height, opening, x) {
  this.element = newElement("div", "pair-of-barries");

  this.barrierTop = new barrierCreate(true);
  this.barrierBottom = new barrierCreate(false);

  this.element.appendChild(this.barrierTop.element);
  this.element.appendChild(this.barrierBottom.element);

  this.createOpening = () => {
    const heightTop = Math.random() * (height - opening);
    const heightBottom = height - opening - heightTop;
    this.barrierTop.setHeight(heightTop);
    this.barrierBottom.setHeight(heightBottom);
  };

  this.getX = () => parseInt(this.element.style.left.split("px")[0]);
  this.setX = (x) => (this.element.style.left = `${x}px`);
  this.getWidth = () => this.element.clientWidth;

  this.createOpening();
  this.setX(x);
}

function Barriers(height, width, opening, space, notifyPoint) {
  this.pairs = [
    new pairBarrier(height, opening, width),
    new pairBarrier(height, opening, width + space),
    new pairBarrier(height, opening, width + space * 2),
    new pairBarrier(height, opening, width + space * 3),
  ];

  const move = 3;
  this.animation = () => {
    this.pairs.forEach((pair) => {
      pair.setX(pair.getX() - move);

      if (pair.getX() < -pair.getWidth()) {
        pair.setX(pair.getX() + space * this.pairs.length);
        pair.createOpening();
      }

      const middle = width / 2;
      const getPoint = pair.getX() + move >= middle && pair.getX() < middle;
      getPoint && notifyPoint();
    });
  };
}

function Plane(gameHeight) {
  let flying = false;

  this.element = newElement("img", "plane");
  this.element.src = "/imgs/Airplane.png";

  this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
  this.setY = (y) => (this.element.style.bottom = `${y}px`);

  window.onkeydown = (e) => (flying = true);
  window.onkeyup = (e) => (flying = false);

  this.animation = () => {
    const newY = this.getY() + (flying ? 8 : -5);
    const maxHeight = gameHeight - this.element.clientHeight;

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= maxHeight) {
      this.setY(maxHeight);
    } else {
      this.setY(newY);
    }
  };

  this.setY(gameHeight / 2);
}

const barrie = new Barriers(700, 1200, 200, 400);
const plane = new Plane(700);
const gameArea = document.querySelector("[wm-flappy]");

gameArea.appendChild(plane.element);
barrie.pairs.forEach((p) => gameArea.appendChild(p.element));

setInterval(() => {
  barrie.animation();
  plane.animation();
}, 20);
