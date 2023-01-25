function randCol() {
  return (Math.random());
}

maxParticles = 5;

for (let i = 0; i < 50; i++) {
  new Particle(randCol(),
    randCol(),
    randCol(),
    35 + Math.random() * 50,
    Math.random() * 10);
}