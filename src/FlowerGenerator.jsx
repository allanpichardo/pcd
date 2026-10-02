import { useEffect, useRef, useState } from 'react';
import shaderSource from './flowers/shader.glsl?raw';
import weights from './flowers/shader_weights.json';

const RESOLUTION = 512;
const TRANSITION_MS = 1500;
const FRAME_MS = 1000 / 30;

const vertexSource = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Adapt the exported GLSL syntax to WebGL2 without changing the network.
const fragmentSource = `#version 300 es\n${shaderSource
  .replace('varying vec2 vUv;', 'in vec2 vUv;\nout vec4 fragmentColor;')
  .replace(/\btexture2D\b/g, 'texture')
  .replace(/\bgl_FragColor\b/g, 'fragmentColor')}`;

function randomLatent() {
  return Float32Array.from({ length: 16 }, () => Math.random());
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function FlowerGenerator() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) {
      setError('Flower animation requires WebGL2.');
      return;
    }

    setError(null);
    let animationFrame;
    let program;
    let buffer;
    let vertexArray;
    let disposed = false;
    const shaders = [];
    const textures = [];

    function resize() {
      const size = Math.min(container.clientWidth, container.clientHeight);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    }

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    function dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      gl.useProgram(null);
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      textures.forEach((texture, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.deleteTexture(texture);
      });
      if (vertexArray) gl.deleteVertexArray(vertexArray);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    }

    function handleContextLost(event) {
      event.preventDefault();
      dispose();
      setError('Flower animation lost its graphics context. Reopen this slide.');
    }

    canvas.addEventListener('webglcontextlost', handleContextLost);

    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Could not create flower shader.');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    try {
      program = gl.createProgram();
      if (!program) throw new Error('Could not create flower program.');
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
      }
      gl.useProgram(program);

      vertexArray = gl.createVertexArray();
      buffer = gl.createBuffer();
      if (!vertexArray || !buffer) throw new Error('Could not create flower geometry.');
      gl.bindVertexArray(vertexArray);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, 1, 1,
      ]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const entries = Object.entries(weights.texture_info);
      if (entries.length > gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)) {
        throw new Error('Not enough texture units for flower weights.');
      }
      entries.forEach(([name, { width, height }], unit) => {
        const texture = gl.createTexture();
        if (!texture) throw new Error(`Could not create weight texture ${name}.`);
        textures.push(texture);
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT,
          new Float32Array(weights.texture_data[name].flat(2)),
        );
        gl.uniform1i(gl.getUniformLocation(program, name), unit);
      });

      gl.viewport(0, 0, RESOLUTION, RESOLUTION);
      gl.uniform1f(gl.getUniformLocation(program, 'p'), 5);
      const latentLocation = gl.getUniformLocation(program, 'z[0]');
      const latent = new Float32Array(16);
      let from = randomLatent();
      let target = randomLatent();
      let segmentStart = performance.now();
      let lastFrame = -Infinity;

      function animate(timestamp) {
        if (disposed) return;
        if (timestamp - lastFrame >= FRAME_MS) {
          if (timestamp - segmentStart >= TRANSITION_MS) {
            from = target;
            target = randomLatent();
            segmentStart = timestamp;
          }
          const t = easeInOutCubic(Math.max(0, (timestamp - segmentStart) / TRANSITION_MS));
          for (let i = 0; i < latent.length; i++) {
            latent[i] = from[i] + (target[i] - from[i]) * t;
          }
          gl.uniform1fv(latentLocation, latent);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          lastFrame = timestamp;
        }
        animationFrame = requestAnimationFrame(animate);
      }

      animate(segmentStart);
    } catch (cause) {
      console.error('Flower animation initialization failed:', cause);
      dispose();
      setError('Could not start the flower animation.');
    }

    return dispose;
  }, []);

  return (
    <div className="flower-generator" ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={RESOLUTION}
        height={RESOLUTION}
        role="img"
        aria-label="A flower generated by a trained CPPN, continuously morphing between random latents"
        hidden={Boolean(error)}
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
