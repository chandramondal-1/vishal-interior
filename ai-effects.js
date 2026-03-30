const canvas = document.getElementById("ai-effects-canvas");

if (canvas) {
  const saveData = navigator.connection ? navigator.connection.saveData === true : false;
  const deviceMemory = navigator.deviceMemory || 8;
  const hardwareThreads = navigator.hardwareConcurrency || 8;
  const compactViewport = window.matchMedia("(max-width: 820px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const ultraLiteMode =
    document.body.classList.contains("ultra-lite-mode") ||
    document.documentElement.classList.contains("ultra-lite-mode") ||
    saveData ||
    deviceMemory <= 1 ||
    hardwareThreads <= 2 ||
    (compactViewport && coarsePointer && deviceMemory <= 2);
  const ctx = ultraLiteMode
    ? null
    : canvas.getContext("2d", { alpha: true, desynchronized: true });

  if (ctx) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPerformanceMode =
      saveData || deviceMemory <= 4 || hardwareThreads <= 4 || compactViewport || coarsePointer;
    const particleCount = lowPerformanceMode ? 180 : 560;
    const prismCount = lowPerformanceMode ? 4 : 12;
    const ribbonCount = lowPerformanceMode ? 2 : 4;
    const glowCount = lowPerformanceMode ? 3 : 5;
    const minFrameDelay = lowPerformanceMode ? 1000 / 30 : 1000 / 48;
    const tau = Math.PI * 2;
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.34,
      active: false,
      smoothedX: 0,
      smoothedY: 0
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let pageVisible = true;
    let lastTime = 0;
    let lastPaintTime = 0;
    let particles = [];
    let prisms = [];
    let ribbons = [];
    let glows = [];

    const palette = ["201,169,110", "255,255,255", "166,130,71"];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const randomBetween = (min, max) => min + Math.random() * (max - min);

    const recycleParticle = (particle) => {
      particle.x = randomBetween(-width * 0.56, width * 0.56);
      particle.y = randomBetween(-height * 0.54, height * 0.54);
      particle.z = randomBetween(1.2, 2.9);
      particle.vx = randomBetween(-0.06, 0.06);
      particle.vy = randomBetween(-0.045, 0.045);
      particle.depthSpeed = randomBetween(0.0002, 0.00078);
      particle.size = Math.random() > 0.9 ? randomBetween(2.6, 4.9) : randomBetween(0.55, 2.3);
      particle.alpha = Math.random() > 0.9 ? randomBetween(0.16, 0.32) : randomBetween(0.05, 0.16);
      particle.phase = randomBetween(0, tau);
      particle.phaseSpeed = randomBetween(0.00055, 0.0022);
      particle.wobble = randomBetween(0.15, 0.7);
      particle.parallax = randomBetween(0.35, 0.9);
      particle.trail = !lowPerformanceMode && Math.random() > 0.88;
      particle.color = palette[Math.floor(Math.random() * palette.length)];
      particle.prevX = null;
      particle.prevY = null;
      return particle;
    };

    const createParticle = () => recycleParticle({});

    const createPrism = () => ({
      x: randomBetween(-width * 0.34, width * 0.34),
      y: randomBetween(-height * 0.26, height * 0.26),
      z: randomBetween(0.9, 2),
      radius: randomBetween(18, 40),
      sides: Math.random() > 0.55 ? 4 : 6,
      phase: randomBetween(0, tau),
      spinSpeed: randomBetween(0.00004, 0.00014),
      wobble: randomBetween(0.2, 0.8),
      lift: randomBetween(0.22, 0.46),
      alpha: randomBetween(0.03, 0.08),
      color: Math.random() > 0.38 ? "201,169,110" : "255,255,255"
    });

    const createRibbon = (index) => ({
      baseY: height * (0.18 + index * 0.12),
      amplitude: randomBetween(10 + index * 3, 20 + index * 5),
      frequency: randomBetween(0.003, 0.0048),
      speed: randomBetween(0.00007, 0.00016),
      phase: randomBetween(0, tau),
      width: randomBetween(1, 1.9),
      alpha: index % 2 === 0 ? 0.06 : 0.035,
      color: index % 2 === 0 ? "201,169,110" : "255,255,255",
      depth: 0.55 + index * 0.16
    });

    const createGlow = (index) => ({
      angle: randomBetween(0, tau),
      radius: 120 + index * 80,
      size: 180 + index * 42,
      speed: 0.00004 + index * 0.000015,
      alpha: index % 2 === 0 ? 0.08 : 0.04,
      color: index % 2 === 0 ? "201,169,110" : "255,255,255"
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, lowPerformanceMode ? 1 : 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: particleCount }, createParticle);
      prisms = Array.from({ length: prismCount }, createPrism);
      ribbons = Array.from({ length: ribbonCount }, (_, index) => createRibbon(index));
      glows = Array.from({ length: glowCount }, (_, index) => createGlow(index));
    };

    const projectPoint = (x, y, z, cameraX, cameraY, scrollOffset) => {
      const scale = 1 / z;
      return {
        x: width * 0.5 + (x + cameraX * (0.24 + z * 0.05)) * scale,
        y: height * 0.34 + (y + cameraY * (0.18 + z * 0.04) + scrollOffset * (0.05 + z * 0.02)) * scale,
        scale
      };
    };

    const drawGlow = (x, y, radius, color, alpha) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, tau);
      ctx.fill();
    };

    const drawRibbon = (ribbon, time, scrollOffset, cameraX, cameraY) => {
      const baseY =
        ribbon.baseY +
        Math.sin(time * ribbon.speed + ribbon.phase) * 12 +
        scrollOffset * ribbon.depth * -0.32 +
        cameraY * ribbon.depth * 0.24;
      const gradient = ctx.createLinearGradient(0, baseY, width, baseY + 80);
      gradient.addColorStop(0, `rgba(${ribbon.color}, 0)`);
      gradient.addColorStop(0.2, `rgba(${ribbon.color}, ${ribbon.alpha * 0.6})`);
      gradient.addColorStop(0.5, `rgba(${ribbon.color}, ${ribbon.alpha})`);
      gradient.addColorStop(0.8, `rgba(${ribbon.color}, ${ribbon.alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${ribbon.color}, 0)`);

      ctx.beginPath();

      for (let x = -40; x <= width + 40; x += 24) {
        const y =
          baseY +
          Math.sin(x * ribbon.frequency + time * ribbon.speed + ribbon.phase) * ribbon.amplitude +
          Math.cos(x * ribbon.frequency * 0.52 - time * ribbon.speed * 1.4 + ribbon.phase) *
            ribbon.amplitude *
            0.42 +
          cameraX * ribbon.depth * 0.1;

        if (x === -40) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = ribbon.width;
      ctx.strokeStyle = gradient;
      ctx.stroke();
    };

    const drawPrism = (prism, time, scrollOffset, cameraX, cameraY) => {
      const center = projectPoint(
        prism.x + Math.sin(time * 0.00012 + prism.phase) * 22 * prism.wobble,
        prism.y + Math.cos(time * 0.00014 + prism.phase) * 16 * prism.wobble,
        prism.z,
        cameraX,
        cameraY,
        scrollOffset
      );

      if (
        center.x < -120 ||
        center.x > width + 120 ||
        center.y < -120 ||
        center.y > height + 120
      ) {
        return;
      }

      const angle = time * prism.spinSpeed + prism.phase;
      const radius = prism.radius * center.scale;
      const lift = radius * prism.lift;
      const outer = [];
      const inner = [];

      for (let index = 0; index < prism.sides; index += 1) {
        const slice = angle + (index / prism.sides) * tau;
        const x = Math.cos(slice) * radius;
        const y = Math.sin(slice) * radius * 0.72;
        outer.push({ x: center.x + x, y: center.y + y });
        inner.push({ x: center.x + x * 0.72, y: center.y - lift + y * 0.72 });
      }

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(${prism.color}, ${prism.alpha})`;
      ctx.beginPath();
      outer.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = `rgba(${prism.color}, ${prism.alpha * 0.9})`;
      ctx.beginPath();
      inner.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = `rgba(${prism.color}, ${prism.alpha * 0.75})`;
      outer.forEach((point, index) => {
        const target = inner[index];
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });
    };

    const updateParticle = (particle, delta, time, scrollOffset, cameraX, cameraY) => {
      particle.z -= particle.depthSpeed * delta;
      particle.x +=
        particle.vx * delta * 0.015 +
        Math.sin(time * 0.00012 + particle.phase) * particle.wobble * 0.028;
      particle.y +=
        particle.vy * delta * 0.014 +
        Math.cos(time * 0.00015 + particle.phase) * particle.wobble * 0.024 +
        scrollOffset * particle.parallax * 0.0008;

      if (pointer.active && !prefersReducedMotion) {
        const worldPointerX = ((pointer.x / width) - 0.5) * width * 0.82;
        const worldPointerY = ((pointer.y / height) - 0.34) * height * 0.7;
        particle.x += (worldPointerX - particle.x) * 0.00007 * delta / particle.z;
        particle.y += (worldPointerY - particle.y) * 0.000055 * delta / particle.z;
      }

      if (particle.z < 0.64) {
        recycleParticle(particle);
      }

      const projection = projectPoint(
        particle.x,
        particle.y,
        particle.z,
        cameraX,
        cameraY,
        scrollOffset
      );

      if (
        projection.x < -80 ||
        projection.x > width + 80 ||
        projection.y < -80 ||
        projection.y > height + 80
      ) {
        recycleParticle(particle);
        return null;
      }

      const twinkle = Math.sin(time * particle.phaseSpeed + particle.phase);
      const size = particle.size * projection.scale * 1.06;
      const alpha = clamp(
        particle.alpha + twinkle * 0.04 + (1.15 - particle.z) * 0.035,
        0.03,
        0.42
      );

      if (particle.trail && particle.prevX !== null && particle.prevY !== null && size > 0.9) {
        const trailGradient = ctx.createLinearGradient(
          particle.prevX,
          particle.prevY,
          projection.x,
          projection.y
        );
        trailGradient.addColorStop(0, `rgba(${particle.color}, 0)`);
        trailGradient.addColorStop(1, `rgba(${particle.color}, ${alpha * 0.9})`);
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = clamp(size * 0.28, 0.35, 1.1);
        ctx.beginPath();
        ctx.moveTo(particle.prevX, particle.prevY);
        ctx.lineTo(projection.x, projection.y);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${particle.color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(projection.x, projection.y, size, 0, tau);
      ctx.fill();

      if (size > 2.5) {
        drawGlow(projection.x, projection.y, size * 5.2, particle.color, alpha * 0.05);
      }

      particle.prevX = projection.x;
      particle.prevY = projection.y;
      return projection;
    };

    const drawConnections = (projectedParticles) => {
      if (lowPerformanceMode) {
        return;
      }

      const stride = 26;
      ctx.lineWidth = 0.7;

      for (let index = 0; index < projectedParticles.length; index += stride) {
        const origin = projectedParticles[index];

        if (!origin || origin.scale < 0.6) {
          continue;
        }

        for (let compare = index + stride; compare < Math.min(index + stride * 4, projectedParticles.length); compare += stride) {
          const target = projectedParticles[compare];

          if (!target || target.scale < 0.6) {
            continue;
          }

          const dx = target.x - origin.x;
          const dy = target.y - origin.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 88) {
            continue;
          }

          const alpha = (1 - distance / 88) * 0.06;
          ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        for (let index = 0; index < projectedParticles.length; index += 28) {
          const target = projectedParticles[index];

          if (!target) {
            continue;
          }

          const distance = Math.hypot(pointer.x - target.x, pointer.y - target.y);

          if (distance > 130) {
            continue;
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 130) * 0.05})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }
    };

    const drawStaticScene = () => {
      ctx.clearRect(0, 0, width, height);

      glows.forEach((glow, index) => {
        drawGlow(width * (0.28 + index * 0.1), height * (0.22 + index * 0.04), glow.size, glow.color, glow.alpha);
      });

      ribbons.forEach((ribbon, index) => {
        drawRibbon(ribbon, index * 160, 0, 0, 0);
      });

      prisms.forEach((prism, index) => {
        drawPrism(prism, index * 240, 0, 0, 0);
      });

      particles.forEach((particle, index) => {
        if (index % 2 === 0) {
          const projection = projectPoint(particle.x, particle.y, particle.z, 0, 0, 0);
          const size = particle.size * projection.scale;
          ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
          ctx.beginPath();
          ctx.arc(projection.x, projection.y, size, 0, tau);
          ctx.fill();
        }
      });
    };

    const render = (time) => {
      animationFrame = window.requestAnimationFrame(render);

      if (!pageVisible) {
        lastTime = time;
        return;
      }

      if (time - lastPaintTime < minFrameDelay) {
        return;
      }

      lastPaintTime = time;

      const delta = clamp(time - lastTime || 16, 12, 40);
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      const scrollOffset = window.scrollY / Math.max(window.innerHeight, 1);
      const targetCameraX = pointer.active ? ((pointer.x / width) - 0.5) * 52 : 0;
      const targetCameraY = pointer.active ? ((pointer.y / height) - 0.34) * 38 : 0;

      pointer.smoothedX += (targetCameraX - pointer.smoothedX) * 0.03;
      pointer.smoothedY += (targetCameraY - pointer.smoothedY) * 0.03;

      glows.forEach((glow, index) => {
        const orbitX =
          width * 0.5 +
          Math.cos(time * glow.speed + glow.angle) * glow.radius +
          pointer.smoothedX * (0.42 + index * 0.04);
        const orbitY =
          height * 0.3 +
          Math.sin(time * glow.speed * 1.5 + glow.angle) * glow.radius * 0.42 +
          pointer.smoothedY * (0.3 + index * 0.03) -
          scrollOffset * glow.radius * 0.06;

        drawGlow(orbitX, orbitY, glow.size, glow.color, glow.alpha);
      });

      if (pointer.active) {
        drawGlow(pointer.x, pointer.y, 130, "201,169,110", 0.05);
      }

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      ribbons.forEach((ribbon) => {
        drawRibbon(ribbon, time, scrollOffset, pointer.smoothedX, pointer.smoothedY);
      });

      prisms.forEach((prism) => {
        drawPrism(prism, time, scrollOffset * 10, pointer.smoothedX, pointer.smoothedY);
      });

      const projectedParticles = [];
      particles.forEach((particle) => {
        const projection = updateParticle(
          particle,
          delta,
          time,
          scrollOffset * 10,
          pointer.smoothedX,
          pointer.smoothedY
        );
        if (projection) {
          projectedParticles.push(projection);
        }
      });

      drawConnections(projectedParticles);
      ctx.restore();
    };

    resize();

    if (prefersReducedMotion) {
      drawStaticScene();
    } else {
      render(0);
    }

    window.addEventListener("resize", () => {
      resize();

      if (prefersReducedMotion) {
        drawStaticScene();
      }
    });

    window.addEventListener("pointermove", (event) => {
      if (lowPerformanceMode) {
        return;
      }

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });

    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    document.addEventListener("visibilitychange", () => {
      pageVisible = document.visibilityState === "visible";
    });

    if (prefersReducedMotion) {
      window.cancelAnimationFrame(animationFrame);
    }
  } else if (ultraLiteMode) {
    canvas.style.display = "none";
  }
}
