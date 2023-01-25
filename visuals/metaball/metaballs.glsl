#version 300 es

precision lowp float;

uniform vec2[256] positions;
uniform vec3[256] colors;
uniform vec4[256] traits;
uniform uint numParts;

in vec2 texCoord;

out vec4 frag;

void main(void) {
    float powFalloff = 2.5;
    float powerSum = 0.0;
    for (uint i = 0u; i < numParts; i++)
    {
        vec2 pos = positions[i];
        vec4 trait = traits[i];
        vec3 col = colors[i];

        float rad = trait.x;

        float dx = texCoord.x - pos.x;
        float dy = texCoord.y - pos.y;

        float dist = sqrt(dx * dx + dy * dy);

        float power = pow(min(rad / dist, 1.0), powFalloff);
        powerSum += power;

        frag += vec4((col.rgb * power), 1.0);
    }

    float m = max(max(frag.r, frag.g), frag.b);

    frag = vec4(frag.rgb / m * floor(min(powerSum, 1.0)), 1.0);

}