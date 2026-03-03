class Hand {
    constructor(length, width, color, tail = 20) {
        this.length = length;
        this.width = width;
        this.color = color;
        this.tail = tail;
    }

    draw(ctx) {
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(0, this.tail);
        ctx.lineTo(0, -this.length);
        ctx.stroke();
    }
}

class Clock {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.radius = this.canvas.width / 2;
        this.isPaused = false;

        this.hands = {
            hour: new Hand(this.radius * 0.5, 8, '#2c3e50'),
            minute: new Hand(this.radius * 0.75, 5, '#34495e'),
            second: new Hand(this.radius * 0.85, 2, '#e74c3c', 30)
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.isPaused = !this.isPaused;
        });
        this.loop();
    }

    drawFace() {
        const { ctx, radius } = this;
        
        ctx.strokeStyle = '#333';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${radius * 0.1}px Arial`;

        for (let i = 0; i < 60; i++) {
            const angle = (i * Math.PI) / 30;
            ctx.save();
            ctx.rotate(angle);
            
            if (i % 5 === 0) {
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, -radius + 10);
                ctx.lineTo(0, -radius + 30);
                ctx.stroke();
                
                ctx.save();
                ctx.translate(0, -radius + 45);
                ctx.rotate(-angle);
                const hour = i === 0 ? 12 : i / 5;
                ctx.fillText(hour.toString(), 0, 0);
                ctx.restore();
            } else {
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -radius + 10);
                ctx.lineTo(0, -radius + 20);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    render() {
        const { ctx, canvas, radius } = this;
        const now = new Date();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(radius, radius);

        this.drawFace();

        const ms = now.getMilliseconds();
        const s = now.getSeconds() + ms / 1000;
        const m = now.getMinutes() + s / 60;
        const h = (now.getHours() % 12) + m / 60;

        this.drawHand(this.hands.hour, (h * Math.PI) / 6);
        this.drawHand(this.hands.minute, (m * Math.PI) / 30);
        this.drawHand(this.hands.second, (s * Math.PI) / 30);

        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.restore();
    }

    drawHand(hand, angle) {
        this.ctx.save();
        this.ctx.rotate(angle);
        hand.draw(this.ctx);
        this.ctx.restore();
    }

    loop() {
        if (!this.isPaused) this.render();
        requestAnimationFrame(() => this.loop());
    }
}

new Clock('clock');