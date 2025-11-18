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

	launch = () => {
		this.config.SWOOSHING.play();
		window.cancelAnimationFrame(this.request)
		this.gameLoop()
		document.removeEventListener('mousedown', this.launch, true)
		document.removeEventListener('touchstart', this.launch, true)
		document.removeEventListener('keydown', this.launch, true)

	}

	start() {
		this.initializeControls() // управление птичкой

		if ((this.score.localScore === null) || (this.score.localScore === undefined)) {
			this.score.localScore = 0;
		}

		const render = () => {
			this.config.INDEX += 1

			this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height)
			this.ground.update(this.config.INDEX)
			this.bird.draw(this.config.INDEX)

			this.request = window.requestAnimationFrame(render)
		}
		this.request = window.requestAnimationFrame(render)

		document.addEventListener('mousedown', this.launch, true)
		document.addEventListener('touchstart', this.launch, true)
		document.addEventListener('keydown', this.launch, true)	
	}

	restart() {
		const restartBtn = document.getElementById('restartBtn');

		restartBtn.style.display = 'block'
		
		restartBtn.addEventListener('click', () => {  
        	location.reload();
        });
	}

	gameLoop() {
		let render = () => {
			this.config.INDEX += 1

			this.ctx.drawImage(this.BG_IMG, 0, 0, this.canvas.width, this.canvas.height)

			this.updatePipes() // отрисовка труб
			this.ground.update(this.config.INDEX) // отрисовка земли
			this.bird.update(this.config.INDEX) // отрисовка птички
			this.score.displayScore() // отрисовка счетчика очков
			this.score.displayLocalScore() // отрисовка рекорда

			this.config.frameCount++

			if (this.config.frameCount > this.config.DISTANCE_BETWEEN_PIPES) {
				this.pipes.push(new Pipe(this.canvas))
				this.config.frameCount = 0
			}

			let requestId = window.requestAnimationFrame(render);

			// проверка на столкновение с землей 
			if (this.bird.y > this.ground.y) {
				this.config.HIT.play();
				this.config.DIE.play();
				window.cancelAnimationFrame(requestId)
				this.restart()
			}

			// проверка на столкновение с трубами
			if (this.checkPipeCollision(this.bird, this.pipes)) {
				this.config.HIT.play();
				this.config.DIE.play();
				window.cancelAnimationFrame(requestId)
				this.restart()
			}
		}
		window.requestAnimationFrame(render);
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

	updatePipes() {
		for (let i = 0; i < this.pipes.length; i++) {
			this.pipes[i].update()	
			if (Math.ceil(this.pipes[i].x) == this.bird.x) {
				this.score.update()
				if (this.score.score > this.score.localScore) {
					this.score.localScore = localStorage.setItem('highScore', this.score.score)
				}
				this.score.localScore = localStorage.getItem('highScore')
			}
			if (this.pipes[i].isOffscreen()) {
				this.pipes.shift()
				i--
			}
		}
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
}
export default Game;
