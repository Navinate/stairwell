function randCol() {
  return (Math.random());
}

for (let i = 0; i < 5; i++) {
  new Particle(randCol(),
    randCol(),
    randCol(),
    Math.random() * 50 + 50,
    Math.random() * 2,
    Math.random() * - 0.5);
}