import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 80;
    let scrollAcceleration = 0;
    let opacityAnimTime = 0;
    let isOpacityAnimating = false;
    let isRotationAnimating = false;
    let rotationAnimTime = 0;

    const handleWheel = (e) => {
      scrollAcceleration = e.deltaY > 0 ? -3 : 3;
      setTimeout(() => scrollAcceleration = 0, 150);
    };
    
    window.addEventListener('wheel', handleWheel);

    class Particle {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 15 + 10) * 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.normalVx = (Math.random() - 0.5) * 4;
        this.normalVy = (Math.random() - 0.5) * 4;
        this.targetSpeed = Math.sqrt(this.normalVx * this.normalVx + this.normalVy * this.normalVy);
        this.radius = Math.random() * 20 + 10;
        this.shape = Math.floor(Math.random() * 4);
        this.gradientTime = Math.random() * Math.PI * 2;
        this.gradientSpeed = Math.random() * 0.03 + 0.02;
        this.scrollVy = 0;
        this.opacityMultiplier = 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.rotationVx = 0;
        this.rotationVy = 0;
      }

      update() {
        if (isOpacityAnimating) {
          this.opacityMultiplier = 0.3 + 0.7 * Math.abs(Math.sin(opacityAnimTime * 0.01 + this.gradientTime));
        } else {
          this.opacityMultiplier = 1;
        }
        
        if (!isRotationAnimating) {
          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (currentSpeed > this.targetSpeed) {
            const ratio = this.targetSpeed / currentSpeed;
            this.vx *= ratio;
            this.vy *= ratio;
          }
        }
        
        this.scrollVy += scrollAcceleration;
        this.scrollVy *= 0.98;
        
        if (isRotationAnimating) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const t = Math.min(rotationAnimTime / 3000, 1);
          
          if (t < 0.2) {
            // Move to center
            const moveT = t / 0.2;
            this.x = this.baseX + (centerX - this.baseX) * moveT;
            this.y = this.baseY + (centerY - this.baseY) * moveT;
          } else if (t < 0.4) {
            // Scatter from center
            if (this.rotationVx === 0 && this.rotationVy === 0) {
              const angle = Math.random() * Math.PI * 2;
              const speed = (Math.random() * 15 + 10) * 5;
              this.rotationVx = Math.cos(angle) * speed;
              this.rotationVy = Math.sin(angle) * speed;
              this.x = centerX;
              this.y = centerY;
            }
            this.x += this.rotationVx;
            this.y += this.rotationVy;
          } else {
            // Gradual speed reduction
            const slowT = (t - 0.4) / 0.6;
            this.rotationVx = this.rotationVx * (1 - slowT) + this.normalVx * slowT;
            this.rotationVy = this.rotationVy * (1 - slowT) + this.normalVy * slowT;
            this.x += this.rotationVx;
            this.y += this.rotationVy;
          }
          
          // Reflection with speed reduction
          if (this.x < 0 || this.x > canvas.width) {
            this.rotationVx *= -0.8;
            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width) this.x = canvas.width;
          }
          if (this.y < 0 || this.y > canvas.height) {
            this.rotationVy *= -0.8;
            if (this.y < 0) this.y = 0;
            if (this.y > canvas.height) this.y = canvas.height;
          }
        } else {
          this.baseX = this.x;
          this.baseY = this.y;
          this.rotationVx = 0;
          this.rotationVy = 0;
        }
        
        if (!isRotationAnimating) {
          this.x += this.vx;
          this.y += this.vy + this.scrollVy;
        }
        this.gradientTime += this.gradientSpeed;

        if (!isRotationAnimating) {
          if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -0.8;
            if (this.x < 0) this.x = 0;
            if (this.x > canvas.width) this.x = canvas.width;
          }
          if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -0.8;
            this.scrollVy = -this.scrollVy;
            if (this.y < 0) this.y = 0;
            if (this.y > canvas.height) this.y = canvas.height;
          }
        }
      }

      draw() {
        const baseOpacity = 0.7 * this.opacityMultiplier;
        const gradientFactor = 0.5 + Math.sin(this.gradientTime) * 0.5;
        ctx.lineWidth = this.radius * 0.4;
        
        if (this.shape === 0) {
          const r = Math.floor(255 * (0.3 + gradientFactor * 0.7));
          const g = Math.floor(20 * (0.3 + gradientFactor * 0.7));
          const b = Math.floor(147 * (0.3 + gradientFactor * 0.7));
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        } else if (this.shape === 1) {
          const g = Math.floor(100 * (0.3 + gradientFactor * 0.7));
          const b = Math.floor(255 * (0.3 + gradientFactor * 0.7));
          ctx.strokeStyle = `rgba(0, ${g}, ${b}, ${baseOpacity})`;
          ctx.strokeRect(this.x - this.radius * 0.7, this.y - this.radius * 0.7, this.radius * 1.4, this.radius * 1.4);
        } else if (this.shape === 2) {
          const g = Math.floor(255 * (0.3 + gradientFactor * 0.7));
          ctx.strokeStyle = `rgba(0, ${g}, 100, ${baseOpacity})`;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.radius * 0.8);
          ctx.lineTo(this.x + this.radius * 0.7, this.y + this.radius * 0.5);
          ctx.lineTo(this.x - this.radius * 0.7, this.y + this.radius * 0.5);
          ctx.closePath();
          ctx.stroke();
        } else {
          const r = Math.floor(255 * (0.3 + gradientFactor * 0.7));
          ctx.strokeStyle = `rgba(${r}, 50, 50, ${baseOpacity})`;
          ctx.beginPath();
          ctx.moveTo(this.x - this.radius * 0.6, this.y - this.radius * 0.6);
          ctx.lineTo(this.x + this.radius * 0.6, this.y + this.radius * 0.6);
          ctx.moveTo(this.x + this.radius * 0.6, this.y - this.radius * 0.6);
          ctx.lineTo(this.x - this.radius * 0.6, this.y + this.radius * 0.6);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    window.triggerParticleOpacityAnimation = () => {
      isOpacityAnimating = true;
      opacityAnimTime = 0;
      setTimeout(() => isOpacityAnimating = false, 2000);
    };
    
    window.triggerParticleRotationAnimation = () => {
      isRotationAnimating = true;
      rotationAnimTime = 0;
      setTimeout(() => isRotationAnimating = false, 3000);
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isOpacityAnimating) {
        opacityAnimTime += 16;
      }
      
      if (isRotationAnimating) {
        rotationAnimTime += 16;
      }
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('wheel', handleWheel);
      delete window.triggerParticleOpacityAnimation;
      delete window.triggerParticleRotationAnimation;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  );
};

export default ParticleBackground;