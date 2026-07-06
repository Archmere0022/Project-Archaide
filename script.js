const correctPassword = "liham"; // Change this to your desired password

const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", () => {
    if (passwordInput.value === correctPassword) {
        window.location.href = "homepage.html";
    } else {
        message.textContent = "Wrong Password";
        passwordInput.value = "";
        passwordInput.focus();
    }
});

// Allow pressing Enter to log in
passwordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        loginBtn.click();
    }
});

// Background Starfield Animation
        const canvas = document.getElementById('hero-canvas');
        const ctx = canvas.getContext('2d');

        let stars = [];
        const numStars = 65;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = -(Math.random() * 0.15 + 0.05);
                this.opacity = Math.random() * 0.6 + 0.2;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.y += this.speedY;
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }

                // Smooth Twinkle effect
                this.opacity += 0.005 * this.fadeDirection;
                if (this.opacity >= 0.8 || this.opacity <= 0.1) {
                    this.fadeDirection *= -1;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(192, 132, 252, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animateStars);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateStars();

        