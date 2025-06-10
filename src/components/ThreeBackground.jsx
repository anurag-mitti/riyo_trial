import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    
    const geometry = new THREE.TorusGeometry(2, 0.3, 30, 100);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x6d28d9) }, // Purple
        color2: { value: new THREE.Color(0x3853f7) }  // Blue
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float t = sin(time * 0.5) * 0.5 + 0.5;
          vec3 color = mix(color1, color2, t + vUv.x);
          
          float intensity = 0.8 - distance(vUv, vec2(0.5));
          intensity = pow(intensity, 1.5);
          
          float pulse = sin(time * 2.0 + length(vPosition) * 2.0) * 0.1 + 0.9;
          
          gl_FragColor = vec4(color * pulse, intensity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    
    const animate = () => {
      const time = performance.now() * 0.001;
      
      if (material.uniforms) {
        material.uniforms.time.value = time;
      }
      
      circle.rotation.z = time * 0.2;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    gsap.to(circle.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full" />;
};

export default ThreeBackground;