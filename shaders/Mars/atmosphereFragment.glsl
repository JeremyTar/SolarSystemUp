varying vec3 vertexNormal;

void main() {
    float intensity = pow(0.67 - dot(vertexNormal, vec3(0, 0, 0.6)), 3.5);
    gl_FragColor = vec4(1.0, 0.3, 0.0, 0.6) * intensity;
}