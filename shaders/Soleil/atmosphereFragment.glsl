varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 0.8)), 2.5);
    gl_FragColor = vec4(1.0, 0.8, 0.0, 0.8) * intensity;
}