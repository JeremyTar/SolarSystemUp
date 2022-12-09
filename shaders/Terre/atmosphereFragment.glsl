varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.65 - dot(vertexNormal, vec3(0, 0, 0.8)), 2.5);
    gl_FragColor = vec4(0.2, 0.6, 1.0, 0.8) * intensity;
}