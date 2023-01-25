function randCol() {
  return (Math.random());
}

for (let i = 0; i < 5; i++) {
  new Particle(randCol(),
    randCol(),
    randCol(),
    50 + Math.random() * 50,
    Math.random() * 1);
}