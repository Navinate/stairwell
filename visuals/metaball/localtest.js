function randCol() {
    return (1 - Math.random() * 0.5);
}

maxParticles = 10;

for(let i = 0; i < 15; i++) {
    new Particle(randCol(), randCol(), randCol(), 15 + Math.random() * 50, Math.random() * 10);
}