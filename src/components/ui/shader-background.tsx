"use client"

import React, { useEffect, useRef } from "react"

export function ShaderBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function syncSize() {
      if (!canvas) return
      const w = canvas.clientWidth || 1280
      const h = canvas.clientHeight || 720
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize)
      resizeObserver.observe(canvas)
    }
    syncSize()

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext)
    if (!gl) return

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = v_texCoord;
    
    // Create a deep navy background
    vec3 color = vec3(0.05, 0.08, 0.15); // Deep Navy #0F172A approx
    
    // Add subtle flowing trade route lines
    float line = sin(uv.x * 20.0 + u_time * 0.5) * 0.5 + 0.5;
    line *= cos(uv.y * 15.0 - u_time * 0.3) * 0.5 + 0.5;
    
    // Add glowing nodes/pulses
    vec3 glow = vec3(0.14, 0.38, 0.92); // Electric Blue #2563EB
    float strength = pow(line, 4.0) * 0.15;
    
    color += glow * strength;
    
    // Subtle gradient for depth
    color += vec3(0.02, 0.05, 0.1) * (1.0 - uv.y);
    
    gl_FragColor = vec4(color, 1.0);
}`

    function cs(type: number, src: string) {
      if (!gl) return null
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()
    if (!prog) return
    const vShader = cs(gl.VERTEX_SHADER, vs)
    const fShader = cs(gl.FRAGMENT_SHADER, fs)
    if (!vShader || !fShader) return

    gl.attachShader(prog, vShader)
    gl.attachShader(prog, fShader)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, "a_position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, "u_time")
    const uRes = gl.getUniformLocation(prog, "u_resolution")
    const uMouse = gl.getUniformLocation(prog, "u_mouse")

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 }
    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width
        const ny = 1.0 - (event.clientY - rect.top) / rect.height
        mouse.x = nx * canvas.width
        mouse.y = ny * canvas.height
      }
    }
    window.addEventListener("mousemove", onMouseMove)

    let animationFrameId: number
    function render(t: number) {
      if (!gl || !canvas) return
      if (typeof ResizeObserver === "undefined") syncSize()
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (uTime) gl.uniform1f(uTime, t * 0.001)
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height)
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animationFrameId = requestAnimationFrame(render)
    }
    render(0)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={`pointer-events-none opacity-40 mix-blend-screen ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
