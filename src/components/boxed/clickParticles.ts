import type { CursorClickIntensity, CursorTrailType } from "./CursorLabProvider";

type ClickParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  spin: number;
  bornAt: number;
  lifetime: number;
  shape: CursorTrailType;
  color: string;
};

const PARTICLE_PRESETS: Record<CursorClickIntensity, { count: number; speed: number }> = {
  soft: { count: 9, speed: 2.8 },
  normal: { count: 14, speed: 4.1 },
  lively: { count: 19, speed: 5.5 },
};

const drawShape = (
  context: CanvasRenderingContext2D,
  particle: ClickParticle,
  age: number,
) => {
  const radius = particle.radius * (1 - age * 0.62);
  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation + age * particle.spin);
  context.globalAlpha = Math.pow(1 - age, 1.4);
  context.fillStyle = particle.color;
  context.strokeStyle = particle.color;
  context.shadowColor = particle.color;
  context.shadowBlur = 5;
  context.beginPath();

  if (particle.shape === "circle" || particle.shape === "dot") {
    context.arc(0, 0, radius, 0, Math.PI * 2);
  } else if (particle.shape === "square") {
    context.rect(-radius, -radius, radius * 2, radius * 2);
  } else if (particle.shape === "triangle") {
    for (let index = 0; index < 3; index += 1) {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
  } else {
    for (let index = 0; index < 10; index += 1) {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const length = index % 2 === 0 ? radius : radius * 0.44;
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
  }

  if (particle.shape === "circle" || particle.shape === "square") {
    context.lineWidth = 1.6;
    context.stroke();
  } else {
    context.fill();
  }
  context.restore();
};

export const createClickParticles = () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  canvas.className = "cursorlab-click-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  let particles: ClickParticle[] = [];
  let animationFrame = 0;
  let previousFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(window.innerWidth * ratio);
    canvas.height = Math.ceil(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const animate = (now: number) => {
    const frameScale = Math.min((now - previousFrame) / (1000 / 60), 2.5);
    previousFrame = now;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((particle) => now - particle.bornAt < particle.lifetime);

    for (const particle of particles) {
      if (now < particle.bornAt) continue;
      const age = Math.min(1, (now - particle.bornAt) / particle.lifetime);
      const damping = Math.pow(0.965, frameScale);
      particle.vx *= damping;
      particle.vy = particle.vy * damping + 0.055 * frameScale;
      particle.x += particle.vx * frameScale;
      particle.y += particle.vy * frameScale;

      context.save();
      context.globalAlpha = Math.pow(1 - age, 1.8) * 0.2;
      context.strokeStyle = particle.color;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(
        particle.x - particle.vx * frameScale * 2,
        particle.y - particle.vy * frameScale * 2,
      );
      context.lineTo(particle.x, particle.y);
      context.stroke();
      context.restore();

      drawShape(context, particle, age);
    }

    animationFrame = particles.length ? requestAnimationFrame(animate) : 0;
  };

  resize();
  window.addEventListener("resize", resize);

  return {
    burst: (
      x: number,
      y: number,
      shape: CursorTrailType,
      intensity: CursorClickIntensity,
      color: string,
    ) => {
      const { count, speed } = PARTICLE_PRESETS[intensity];
      const now = performance.now();
      for (let index = 0; index < count; index += 1) {
        const angle = index / count * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const velocity = speed * (0.3 + Math.random() * 1.1);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          radius: 2.6 + Math.random() * 4.2,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 2,
          bornAt: now + Math.random() * 55,
          lifetime: 540 + Math.random() * 240,
          shape,
          color,
        });
      }
      if (particles.length > 200) particles = particles.slice(-200);
      if (!animationFrame) {
        previousFrame = now;
        animationFrame = requestAnimationFrame(animate);
      }
    },
    destroy: () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.remove();
      particles = [];
    },
  };
};
