function randCol() {
    return (1 - Math.random() * 0.5);
}

maxParticles = 15;

for(let i = 0; i < 30; i++) {
    new Particle(randCol(), randCol(), randCol(), 25 + Math.random() * 50);
}