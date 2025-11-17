import { loadImage } from './utils.js'
import Config from './config.js'

class Ground {
	static groundImg

	static async preloadImage() {
		Ground.groundImg = new Image()
		await loadImage(Ground.groundImg, './assets/sprites/sprite.png')
	}

 
	constructor(canvas) {
		this.config = new Config();

		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.x = 0
		this.y = this.canvas.height - this.config.ground.height
	}

	draw(index) {

		this.backgroundX = -((index * this.config.SPEED) % this.canvas.width);

		this.ctx.drawImage(
			Ground.groundImg,

			276,
			0,
			225,
			this.config.ground.height,

			this.backgroundX + this.canvas.width,
			this.canvas.height - this.config.ground.height,
			this.canvas.width,
			this.config.ground.height
		);

		this.ctx.drawImage(
			Ground.groundImg,

			276,
			0,
			225,
			this.config.ground.height,

			this.backgroundX,
			this.canvas.height - this.config.ground.height,
			this.canvas.width + 5,
			this.config.ground.height
		);

	}

	update(index) {
		this.x -= this.config.SPEED
		this.draw(index)
	}
}

export default Ground
