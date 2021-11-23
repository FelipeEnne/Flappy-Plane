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
      console.log({ g: pair.getX(), w: -pair.getWidth() });
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

const b = new Barriers(700, 1200, 200, 400);
const area = document.querySelector("[wm-flappy]");
b.pairs.forEach((p) => area.appendChild(p.element));

setInterval(() => {
  b.animation();
}, 20);
