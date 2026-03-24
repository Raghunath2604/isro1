import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Globe2 } from 'lucide-react'

export default function Visualization3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const orbitRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0a0e27)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    )
    camera.position.z = 15000
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Earth
    const earthGeometry = new THREE.SphereGeometry(6371, 64, 64)
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e90ff,
      emissive: 0x001f5c,
      shininess: 5,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.rotation.z = 0.3
    scene.add(earth)

    // Orbit Path
    const orbitGeometry = new THREE.BufferGeometry()
    const orbitPoints = []
    const altitude = 408
    const earthRadius = 6371
    const orbitRadius = earthRadius + altitude

    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      orbitPoints.push(
        orbitRadius * Math.cos(angle),
        orbitRadius * Math.sin(angle) * 0.3,
        orbitRadius * Math.sin(angle)
      )
    }

    orbitGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(orbitPoints), 3))
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      linewidth: 2,
      transparent: true,
      opacity: 0.5,
    })
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial)
    scene.add(orbitLine)
    orbitRef.current = orbitLine

    // Satellite (ISS)
    const satelliteGeometry = new THREE.BoxGeometry(300, 150, 150)
    const satelliteMaterial = new THREE.MeshPhongMaterial({
      color: 0xffc107,
      emissive: 0xff8c00,
    })
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
    satellite.position.x = orbitRadius
    scene.add(satellite)

    // Lights
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
    sunLight.position.set(5000, 3000, 4000)
    scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
    scene.add(ambientLight)

    // Stars background
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(300 * 3)
    for (let i = 0; i < 300 * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40000
      starPositions[i + 1] = (Math.random() - 0.5) * 40000
      starPositions[i + 2] = (Math.random() - 0.5) * 40000
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 100,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate Earth
      earth.rotation.y += 0.0001

      // Animate satellite in orbit
      const time = Date.now() * 0.0001
      const angle = time % (Math.PI * 2)

      satellite.position.x = orbitRadius * Math.cos(angle)
      satellite.position.z = orbitRadius * Math.sin(angle)
      satellite.position.y = orbitRadius * Math.sin(angle) * 0.3 * Math.cos(angle * 0.5)
      satellite.rotation.z += 0.02

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener('resize', handleResize)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y

        earth.rotation.y += deltaX * 0.01
        earth.rotation.x += deltaY * 0.01

        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    })

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false
    })

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 5
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', null)
      renderer.domElement.removeEventListener('mousemove', null)
      renderer.domElement.removeEventListener('mouseup', null)
      renderer.domElement.removeEventListener('wheel', null)
      cancelAnimationFrame(animationId)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="grid-panel h-full flex flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Globe2 className="w-6 h-6 text-space-cyan" />
        <div>
          <h2 className="text-2xl font-bold text-white">3D Visualization</h2>
          <p className="text-sm text-gray-400">Interactive orbital view (drag to rotate, scroll to zoom)</p>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 rounded-lg border border-space-cyan/20 overflow-hidden" />

      <div className="mt-4 p-3 bg-space-blue/10 rounded-lg border border-space-cyan/10 text-xs text-gray-400">
        <p>🌍 Earth (blue) | 🛰️ ISS Satellite (yellow) | 🔵 Orbit Path (cyan)</p>
        <p className="mt-1">Use mouse to rotate, scroll wheel to zoom in/out</p>
      </div>
    </div>
  )
}
