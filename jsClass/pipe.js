import { loadImage } from './utils.js'
import Config from './config.js'

class Pipe {
	static pipeImg
	
	static async preloadImage() {
		Pipe.pipeImg = new Image()
		await loadImage(Pipe.pipeImg, './assets/sprites/sprite.png')
	}

	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.config = new Config()

		// верхняя труба
		this.top = this.canvas.height / 10 + Math.round(Math.random() * (this.canvas.height / 2.5))

		// нижняя труба 
		this.bottom = this.top + this.config.pipe.spacing

		// X кооординаты трубы
		this.x = this.canvas.width
	}

	draw() {
		this.ctx.drawImage( // отрисовка верхней трубы
			Pipe.pipeImg,

			553,
			0,
			54,
			400,

			this.x,
			this.top - this.config.pipe.height,
			this.config.pipe.width,
			this.config.pipe.height
		)

		this.ctx.drawImage( // отрисовка нижней трубы
			Pipe.pipeImg,

			501,
			0,
			54,
			400,

			this.x,
			this.bottom,
			this.config.pipe.width,
			this.config.pipe.height
		)
	}

	// движение трубы
	update() {
		this.x -= this.config.SPEED
		this.draw()
	}

	isOffscreen() {
		return this.x < -this.config.pipe.width
	}
}

export default Pipe;