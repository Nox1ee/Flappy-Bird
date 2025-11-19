import { loadImage } from './utils.js'
import Config from './config.js'

class Bird {
	static birdImg // для хранения изображения

	static async preloadImage() {
		Bird.birdImg = new Image() // новый экземпляр птички
		await loadImage(Bird.birdImg, './assets/sprites/sprite.png')
	}

	constructor(canvas) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.config = new Config()

		this.x = 140 // расположение птички по оси X
		this.y = 384 // расположение птички по оси Y
	}

	draw(index) {
		this.ctx.drawImage (
			Bird.birdImg,

			277,
			113 + Math.floor(((index / 2) % 9) / 3) * this.config.bird.height,
			this.config.bird.width,
			this.config.bird.height,

			this.x,
			this.y - this.config.bird.height,
			this.config.bird.width,
			this.config.bird.height,
		)
	}

	flap() {
		this.config.FLAP.play();
		this.config.FLAP.currentTime = 0;
		this.config.velocity = -this.config.flapPower
	}

	update(deltaFactor) {
        this.config.velocity += this.config.gravity * deltaFactor;
        this.y += this.config.velocity * deltaFactor;
    }
}

export default Bird;
