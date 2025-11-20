import Pipe from './pipe.js'
import loadImage from './utils.js'
import Ground from './ground.js'
import Bird from './bird.js'
import Score from './score.js'
import Config from './config.js'

class Game {
	constructor(canvas) {
		// принятый элемент
		this.canvas = canvas
		// контекст канваса
		this.ctx = this.canvas.getContext('2d')
		
		this.canvas.height = 768 // высота поля 
		this.canvas.width = 431 // ширина поля
		
		this.BG_IMG = new Image() // объект изображения
		this.BG_SRC = './img/bg.png'

		this.config = new Config() // экземпляр конфига
		this.pipes = [new Pipe(this.canvas)] // экземпляр труб
		this.ground = new Ground(this.canvas) // экземпляр земли
		this.bird = new Bird(this.canvas)  // экземпляр птички
		this.score = new Score(this.canvas) // экземпляр счета очков

		this.request = 0
		this.request1 = 0

		this.lastTime = 0;
        this.deltaTime = 0;
        this.accumulator = 0;
        this.fixedTimeStep = 1000 / 60; // 60 FPS
	}

	// Запуск игры по нажатию
	launch = () => {
		// this.config.SWOOSHING.play();
		window.cancelAnimationFrame(this.request)
		this.gameLoop()
		document.removeEventListener('mousedown', this.launch, true)
		document.removeEventListener('touchstart', this.launch, true)
		document.removeEventListener('keydown', this.launch, true)

	}

	start() {
		this.initializeControls() // управление птичкой

		// Отрисовываем птичку и другие элементы до начала игры
		const render = () => {
			this.config.INDEX += 0.3

			this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height) // Фон
			this.ground.draw() // Земля
			this.bird.draw(this.config.INDEX) // Птичка

			this.request = window.requestAnimationFrame(render)
		}
		this.request = window.requestAnimationFrame(render)


		document.addEventListener('mousedown', this.launch, true)
		document.addEventListener('touchstart', this.launch, true)
		document.addEventListener('keydown', this.launch, true)	
	}

	restart() {
		const restartBtn = document.getElementById('restartBtn'); // Находим кнопку

		restartBtn.style.display = 'block' // Задаем ей стиль 
		
		restartBtn.addEventListener('click', () => { // Перезагружаем страницу при нажатии
        	location.reload(); 
        });
	}

	gameLoop() {
		const game = (currentTime = 0) => {
			this.deltaTime = currentTime - this.lastTime;
			this.lastTime = currentTime;
			
			// Ограничиваем максимальный deltaTime для избежания "spiral of death"
			if (this.deltaTime > 100) this.deltaTime = 100;
			
			this.accumulator += this.deltaTime;
			
			while (this.accumulator >= this.fixedTimeStep) {
				this.update(this.fixedTimeStep);
				this.render(this.fixedTimeStep);
				this.accumulator -= this.fixedTimeStep;
			}
			
			let requestId = window.requestAnimationFrame((time) => game(time));

			// Проверка коллизии
			if (this.checkCollisions()) {
				// this.config.HIT.play();
				// this.config.DIE.play();
				window.cancelAnimationFrame(requestId);
				this.restart();
        	}
		}
        
        window.requestAnimationFrame(game);
    }

	update(deltaTime) {
        const deltaFactor = deltaTime / (1000 / 60); // Нормализуем к 60 FPS
		
		// Обновляем землю
		this.ground.update(deltaFactor)
        
        // Обновляем физику с учетом deltaTime
		this.bird.update(deltaFactor)
     
        // Обновляем трубы
        for (let pipe of this.pipes) {
            pipe.update(deltaFactor);
        }

		// Добавляем новые трубы
		if (this.config.frameCount > this.config.DISTANCE_BETWEEN_PIPES) {
            this.pipes.push(new Pipe(this.canvas));
            this.config.frameCount = 0;
        }
		this.config.frameCount++;

		// Удаляем трубы за пределами поля
		for (let i = 0; i < this.pipes.length; i++) {
			if(this.pipes[i].isOffscreen()) {
				this.pipes.shift()
				i--
			}
		}
    
		// Проверяем пролетела ли птичка трубу и увелчиваем счет
		for (let pipe of this.pipes) {
			if ((pipe.x < this.bird.x) && (!pipe.scored)) {
				this.score.increase();
				pipe.scored = true;
			}
		}

		this.score.checkHighScore(); // Проверяем был ли побит рекорд
    }

	render(deltaTime) {
		const deltaFactor = deltaTime / (1000 / 60); // Нормализуем к 60 FPS
		
		this.config.INDEX += 0.3 * deltaFactor;

        // Отрисовка фона
        this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка труб
        for (let pipe of this.pipes) {
            pipe.draw();
        }
	
        this.ground.draw(); // Отрисовка земли
        this.bird.draw(this.config.INDEX); // Отрисовка птички
        this.score.draw(); // Отрисовка счета
    }

	checkCollisions() {
        // Столкновение с землей
        if (this.bird.y > this.ground.y) {
            return true;
        }
        
        // Столкновение с трубами
        return this.checkPipeCollision(this.bird, this.pipes);
    }

	checkPipeCollision(bird, pipes) {
		return pipes.some(
			pipe =>
				this.checkTopPipeCollision(bird, pipe) || this.checkBottomPipeCollision(bird, pipe)
		)
	}

	checkTopPipeCollision(bird, pipe) {
		return (
			bird.y - this.config.bird.height < pipe.top &&
			bird.x < pipe.x + this.config.pipe.width &&
			bird.x + this.config.bird.width > pipe.x
		)
	}

	checkBottomPipeCollision(bird, pipe) {
		return (
			bird.y > pipe.bottom &&
			bird.x < pipe.x + this.config.pipe.width &&
			bird.x + this.config.bird.width > pipe.x
		)
	}

	// для полёта птички
	initializeControls() {
		if ('ontouchstart' in window) {
			document.addEventListener('touchstart', this.handleFlap)
		} else {
			document.addEventListener('mousedown', this.handleFlap)
		}
		document.addEventListener('keydown', this.handleFlap)
	}

	handleFlap = event => {
		if (event.type === 'keydown' && event.code !== 'Space') return
		this.bird.flap()
	}

	async loadAssets() {
		await Promise.all([
			loadImage(this.BG_IMG, this.BG_SRC), // грузим фоновое изображение
			Pipe.preloadImage(), // грузим трубы
			Ground.preloadImage(), // грузим землю
			Bird.preloadImage(), // грузим птичку
		])
	}

	loadImage(img, src) {
		return new Promise((resolve, reject) => {
			img.onload = resolve
			img.onerror = reject
			img.src = src
		})
	}
}
export default Game;
