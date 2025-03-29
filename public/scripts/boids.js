import init, { Controller } from "/boids-wasm/wasm_boids.js";

init().then((wasm) => {

    
const controller = Controller.new();
const num_boids = controller.num_boids();
const width = controller.width();
const height = controller.height();

const canvas = document.getElementById("boids-canvas");
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
    controller.tick(window.mousePosition.x, window.mousePosition.y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoids();
    drawMouseIndicator();

    requestAnimationFrame(renderLoop);
}

const drawMouseIndicator = () => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
        window.mousePosition.x, 
        window.mousePosition.y, 
        10, 0, Math.PI * 2
    );
    ctx.fill();
}

const drawBoids = () => {
    ctx.fillStyle = "white";

    let boidsPtr = controller.boids();
    const boids = new Float32Array(wasm.memory.buffer, boidsPtr, num_boids * 4);
    for (let i = 0; i < num_boids; i++) {
        const x =  boids[i*4 + 0];
        const y =  boids[i*4 + 1];
        const vx = boids[i*4 + 2];
        const vy = boids[i*4 + 3];
        
        // We add PI/2 to make it compatible with our triangle drawing function
        const angle = Math.atan2(vy, vx) + Math.PI / 2;
        
        drawEquilateralTriangle(x, y, 10, angle);
    }
}

const drawEquilateralTriangle = (cx, cy, sideLength, angle) => {
    const height = Math.sqrt(3) / 2 * sideLength;
    const vertices = [
        { x: cx, y: cy - height / 2 }, 
        { x: cx - sideLength / 2, y: cy + height / 2 }, 
        { x: cx + sideLength / 2, y: cy + height / 2 }  
    ];

    const rotatedVertices = vertices.map(vertex => {
        const xOffset = vertex.x - cx;
        const yOffset = vertex.y - cy;

        const xRotated = cx + xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
        const yRotated = cy + xOffset * Math.sin(angle) + yOffset * Math.cos(angle);

        return { x: xRotated, y: yRotated };
    });

    ctx.beginPath();
    ctx.moveTo(rotatedVertices[0].x, rotatedVertices[0].y);  
    for (let i = 1; i < rotatedVertices.length; i++) {
        ctx.lineTo(rotatedVertices[i].x, rotatedVertices[i].y); 
    }
    ctx.closePath(); 
    ctx.stroke();  
    ctx.fill();   
}

drawBoids();
requestAnimationFrame(renderLoop);

}).catch(
    e => console.error("Error loading initialising wasm_game_of_life:", e)
);