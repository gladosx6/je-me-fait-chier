import { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

const MinecraftGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerVelRef = useRef<Position>({ x: 0, y: 0 });
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 150 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [hasWon, setHasWon] = useState(false);
  const [textY, setTextY] = useState(-100);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BLOCK_SIZE = 16;
  const PLAYER_SIZE = 32;
  const HOPPER_SIZE = 40;
  const GRAVITY = 0.6;
  const MOVE_SPEED = 4;
  const JUMP_POWER = -13;

  const hopperPos = { x: 380, y: 250 };

  const getTerrainY = (x: number): number => {
    const a = -0.001;
    const vertex = 400;
    const maxY = 260;
    return a * Math.pow(x - vertex, 2) + maxY;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        e.preventDefault();
        setKeys((prev) => {
          const newSet = new Set(prev);
          newSet.add(e.key);
          return newSet;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
        setKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(e.key);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawTerrain(ctx);
      drawHopper(ctx, hopperPos.x, hopperPos.y);

      if (!hasWon) {
        drawPlayer(ctx, playerPos.x, playerPos.y);
      }

      if (hasWon) {
        drawWinText(ctx);
      }
    };

    const drawTerrain = (ctx: CanvasRenderingContext2D) => {
      for (let x = 0; x <= CANVAS_WIDTH; x += BLOCK_SIZE) {
        const terrainY = getTerrainY(x);
        for (let y = Math.floor(terrainY); y < CANVAS_HEIGHT; y += BLOCK_SIZE) {
          drawGrassBlock(ctx, x, y);
        }
      }
    };

    const drawGrassBlock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = '#7CB342';
      ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeStyle = '#558B2F';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

      if (y === Math.floor(getTerrainY(x + BLOCK_SIZE / 2))) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE / 2);
      }
    };

    const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = '#F4A460';
      ctx.fillRect(x + BLOCK_SIZE / 4, y, BLOCK_SIZE / 2, BLOCK_SIZE / 2);

      ctx.fillStyle = '#7FB3D5';
      ctx.fillRect(x, y + BLOCK_SIZE / 2, BLOCK_SIZE / 4, BLOCK_SIZE / 2);
      ctx.fillRect(x + 3 * BLOCK_SIZE / 4, y + BLOCK_SIZE / 2, BLOCK_SIZE / 4, BLOCK_SIZE / 2);

      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(x, y + BLOCK_SIZE, BLOCK_SIZE / 4, BLOCK_SIZE / 2);
      ctx.fillRect(x + 3 * BLOCK_SIZE / 4, y + BLOCK_SIZE, BLOCK_SIZE / 4, BLOCK_SIZE / 2);

      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + 6, y + 6, 4, 4);
      ctx.fillRect(x + 14, y + 6, 4, 4);

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
    };

    const drawHopper = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + HOPPER_SIZE, y);
      ctx.lineTo(x + HOPPER_SIZE - 6, y + 24);
      ctx.lineTo(x + 6, y + 24);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.moveTo(x + 6, y + 24);
      ctx.lineTo(x + HOPPER_SIZE - 6, y + 24);
      ctx.lineTo(x + HOPPER_SIZE - 12, y + 40);
      ctx.lineTo(x + 12, y + 40);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + HOPPER_SIZE, y);
      ctx.lineTo(x + HOPPER_SIZE - 6, y + 24);
      ctx.lineTo(x + HOPPER_SIZE - 12, y + 40);
      ctx.lineTo(x + 12, y + 40);
      ctx.lineTo(x + 6, y + 24);
      ctx.closePath();
      ctx.stroke();
    };

    const drawWinText = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.font = 'bold 56px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 10;

      const text = 'je me fais chier';
      ctx.strokeText(text, CANVAS_WIDTH / 2, textY);
      ctx.fillText(text, CANVAS_WIDTH / 2, textY);
      ctx.restore();
    };

    gameLoop();
  }, [playerPos, hasWon, textY]);

  useEffect(() => {
    if (hasWon && textY < CANVAS_HEIGHT / 2 + 100) {
      const timer = setTimeout(() => {
        setTextY((prev) => prev + 5);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [hasWon, textY]);

  useEffect(() => {
    const updateGame = () => {
      if (hasWon) return;

      setPlayerPos((prevPos) => {
        let newVelX = 0;
        let newVelY = playerVelRef.current.y;

        if (keys.has('ArrowLeft')) {
          newVelX = -MOVE_SPEED;
        } else if (keys.has('ArrowRight')) {
          newVelX = MOVE_SPEED;
        }

        newVelY += GRAVITY;

        let newX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, prevPos.x + newVelX));
        let newY = prevPos.y + newVelY;

        const terrainY = getTerrainY(newX + PLAYER_SIZE / 2);
        const playerBottom = newY + PLAYER_SIZE;

        let isOnGround = false;

        if (playerBottom >= terrainY) {
          newY = terrainY - PLAYER_SIZE;
          newVelY = 0;
          isOnGround = true;

          if (keys.has('ArrowUp') || keys.has('Space')) {
            newVelY = JUMP_POWER;
            isOnGround = false;
          }
        }

        playerVelRef.current = { x: newVelX, y: newVelY };

        const playerCenterX = newX + PLAYER_SIZE / 2;
        const playerCenterY = newY + PLAYER_SIZE / 2;
        const hopperCenterX = hopperPos.x + HOPPER_SIZE / 2;
        const hopperCenterY = hopperPos.y + 20;

        const distance = Math.sqrt(
          Math.pow(playerCenterX - hopperCenterX, 2) +
          Math.pow(playerCenterY - hopperCenterY, 2)
        );

        if (distance < 50) {
          setHasWon(true);
          setTextY(100);
        }

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(interval);
  }, [keys, hasWon]);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800" style={{ fontFamily: 'monospace' }}>
          Minecraft Mini-Game
        </h1>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-gray-800 rounded"
        />
        <div className="mt-4 text-center text-gray-700">
          <p className="font-mono text-lg">
            Utilise les flèches: <span className="font-bold">← → ↑</span>
          </p>
          <p className="font-mono">
            Objectif: Tombe dans le hopper!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinecraftGame;
