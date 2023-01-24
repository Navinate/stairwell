#version 300 es

precision lowp float;

uniform vec2[256] positions;
uniform vec3[256] colors;
uniform float radii[256];
uniform uint numParts;

in vec2 texCoord;

out vec4 fragColor;

void main(void) {
    //    float f = 0.0;
    //    uint iClosest = 0u;
    //    float fClosest = 999999.0;
    fragColor = vec4(0, 0, 0, 1);
    float powFalloff = 2.5;
    float powerSum = 0.0;
    for (uint i = 0u; i < numParts; i++)
    {
        vec2 p = positions[i];

        float rad = radii[i];

        float dx = texCoord.x - positions[i].x;
        float dy = texCoord.y - positions[i].y;

        float dist = sqrt(dx * dx + dy * dy);
        float power = pow(min(rad / dist, 1.0), powFalloff);
        powerSum += power;

        fragColor += vec4((colors[i].rgb * power), 1.0);
    }

    float m = max(max(fragColor.r, fragColor.g), fragColor.b);

    fragColor = vec4(fragColor.rgb / m * floor(min(powerSum, 1.0)), 1.0);

}