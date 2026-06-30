"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Truck, Bot } from "lucide-react"

function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function syncSize() {
      const w = canvas?.clientWidth || 1280
      const h = canvas?.clientHeight || 720
      if (canvas && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
      }
    }

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize)
      resizeObserver.observe(canvas)
    }
    syncSize()

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
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
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_resolution')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 }
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width
        const ny = 1.0 - (event.clientY - rect.top) / rect.height
        mouse.x = nx * canvas.width
        mouse.y = ny * canvas.height
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    let animationFrameId: number

    function render(t: number) {
      if (typeof ResizeObserver === 'undefined') syncSize()
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
      if (uTime) gl!.uniform1f(uTime, t * 0.001)
      if (uRes) gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      if (uMouse) gl!.uniform2f(uMouse, mouse.x, mouse.y)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      animationFrameId = requestAnimationFrame(render)
    }
    render(0)

    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" style={{ display: 'block' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
    </div>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container dark">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
            background: rgba(17, 24, 39, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(30, 41, 59, 0.8);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-nav {
            background: rgba(5, 20, 36, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(67, 70, 85, 0.3);
        }

        /* Subtle Animations */
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
            animation: float 7s ease-in-out 2s infinite;
        }

        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(76, 215, 246, 0.2); }
            50% { box-shadow: 0 0 40px rgba(76, 215, 246, 0.4); }
        }
        .animate-glow {
            animation: pulse-glow 3s infinite;
        }

        /* Hide scrollbar for clean aesthetic */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #051424; 
        }
        ::-webkit-scrollbar-thumb {
            background: #1c2b3c; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #273647; 
        }
      `}} />

      <nav 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(1, 15, 31, 0.95)' : 'rgba(5, 20, 36, 0.8)',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(67, 70, 85, 0.3)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img 
              alt="DN Smart Trade Logo" 
              className="h-8 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8uKOFox7HpUXrMG2vYneSNhN0r3IGoIszvxzfyQNJG9BLM5nfY29EGjHTGQb_AU5x_plw7nZvUGFGYYqtViTZFGVJyd_YULctRfeqx11zRHA5FGUE8aGqW2chBcXz3ak75sqtvAwqzDwYTn9sPMWi4x963X1Q3Mwma3RemaXWyBw0deCZ32zbOwy9sXu99yt7s4RXFpXMcK_OLTjwsnZht3-e0ecTiFwRVEO1vBsDbMhjVs5zg7XPf-2tIBDpBdYe5_sK59seq8I"
            />
            <span className="font-headline-md text-[24px] font-bold tracking-tighter text-primary">DN Smart Trade</span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-[14px] px-4 py-2">
              Login
            </Link>
            <Link href="/dashboard" className="bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all duration-200 font-label-md text-[14px] px-6 py-2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow relative flex items-center justify-center pt-24 pb-16 min-h-screen">
        {/* Shader Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <HeroShader />
          {/* Gradient Overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          
          {/* Hero Typography */}
          <div className="lg:col-span-6 flex flex-col gap-6 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel w-fit border-tertiary/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-label-md text-[14px] text-tertiary tracking-wider uppercase text-xs">Platform Live</span>
            </div>
            
            <h1 className="font-display-lg text-[48px] md:text-[64px] md:leading-[1.1] text-on-surface font-bold">
              DN Smart Trade <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">ERP &amp; AI Platform</span>
            </h1>
            
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-xl">
              AI-Powered Import, Export and Customs Management Platform. Automate compliance, optimize routing, and execute trades with unprecedented precision.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/dashboard" className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all duration-300 font-label-md text-[14px] px-8 py-3 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="glass-panel text-on-surface hover:bg-surface-variant/50 transition-colors duration-300 font-label-md text-[14px] px-8 py-3 rounded-lg flex items-center gap-2">
                Login
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t border-outline-variant/30 flex items-center gap-8 text-on-surface-variant">
              <div>
                <p className="font-headline-md text-[24px] font-semibold text-on-surface">99.9%</p>
                <p className="font-label-md text-[14px] text-xs uppercase tracking-wider">Uptime</p>
              </div>
              <div>
                <p className="font-headline-md text-[24px] font-semibold text-on-surface">10M+</p>
                <p className="font-label-md text-[14px] text-xs uppercase tracking-wider">Shipments</p>
              </div>
              <div>
                <p className="font-headline-md text-[24px] font-semibold text-on-surface">&lt;2s</p>
                <p className="font-label-md text-[14px] text-xs uppercase tracking-wider">Clearance AI</p>
              </div>
            </div>
          </div>

          {/* Floating Visuals Assembly */}
          <div className="lg:col-span-6 relative h-[500px] md:h-[600px] w-full hidden md:block perspective-1000">
            {/* Main Dashboard Preview */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[110%] glass-panel rounded-xl shadow-2xl p-2 animate-float" style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}>
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-2 px-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                </div>
                <div className="font-code text-xs text-on-surface-variant">dn-erp-core-v2.1</div>
              </div>
              
              {/* Mock Content area showing code/data */}
              <div className="p-2 bg-surface-container-lowest/50 rounded border border-outline-variant/20 font-code text-xs text-secondary/80 h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest pointer-events-none z-10"></div>
                <div className="opacity-70 space-y-1">
                  <p>&gt; init shipment_protocol --auto</p>
                  <p>&gt; connecting to HS database...</p>
                  <p className="text-tertiary">&gt; [SUCCESS] connected.</p>
                  <p>&gt; running customs check on container MRKU-9823</p>
                  <p>&gt; analyzing commercial invoice...</p>
                  <p className="text-tertiary">&gt; [AI VERIFIED] HS Codes match declaration.</p>
                  <p>&gt; calculating duties and taxes...</p>
                  <p>&gt; generating BOE...</p>
                  <p className="text-secondary">&gt; READY FOR SUBMISSION</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>
            </div>

            {/* Floating Card 1: Shipment */}
            <div className="absolute top-[10%] -left-[10%] w-64 glass-panel rounded-lg p-4 animate-float-delayed z-20 border-l-4 border-l-secondary shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-[20px] h-[20px] text-secondary" />
                  <span className="font-label-md text-[14px] text-on-surface">BOE #9823</span>
                </div>
                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full font-code">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Origin</span>
                  <span className="text-on-surface font-code">SHA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Destination</span>
                  <span className="text-on-surface font-code">LAX</span>
                </div>
                <div className="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">Status</span>
                  <span className="text-xs text-tertiary font-medium">Customs Clearing</span>
                </div>
              </div>
            </div>

            {/* Floating Card 2: AI Assistant */}
            <div className="absolute bottom-[15%] right-[5%] w-72 glass-panel rounded-xl p-4 animate-float z-30 animate-glow shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 mb-3 border-b border-outline-variant/30 pb-2">
                <div className="bg-gradient-to-br from-primary to-tertiary p-1.5 rounded-full">
                  <Bot className="w-[16px] h-[16px] text-surface-container-lowest" />
                </div>
                <span className="font-label-md text-[14px] text-on-surface">DN Trade AI</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                I've analyzed the latest tariff updates. Route modification suggested for Shipment #9823 to save <span className="text-secondary font-code">$1,240</span> in duties.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-surface-variant hover:bg-surface-bright transition-colors rounded py-1 text-xs font-medium text-on-surface">Review</button>
                <button className="flex-1 bg-tertiary/20 text-tertiary hover:bg-tertiary/30 transition-colors rounded py-1 text-xs font-medium border border-tertiary/30">Apply</button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
