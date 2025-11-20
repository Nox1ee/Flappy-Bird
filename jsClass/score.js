import Config from './config.js'

class Score {
    constructor(canvas) {
        this.config = new Config();

        // принятый элемент
		this.canvas = canvas

		// контекст канваса
		this.ctx = this.canvas.getContext('2d')

        this.score = 0 // Количество очков
		this.highScore = localStorage.getItem('highScore') || 0 // Рекорд
    }

	// Увеличение очков
	increase() {
		this.score++;
		this.config.SPEED += 0.01
	}

	// Проверка рекорда
    checkHighScore() { 
		if (this.score > this.highScore) {
			localStorage.setItem('highScore', this.score)
		}
    }

	// Отображение полей с очками
	draw() { 
		this.displayScore();
		this.displayLocalScore();
	}

	// Стили для очков
    styleDisplay() {
		this.ctx.font = '30px Teko'
		this.ctx.fillStyle = 'white'
		this.ctx.textAlign = 'left'

		this.ctx.lineWidth = 6
		this.ctx.strokeStyle = '#533846'
		this.ctx.textBaseline = 'top'
	}

	// Поле с количеством очков
    displayScore() {
		this.styleDisplay()
		this.ctx.strokeText('Score: ', 10, 10)
		this.ctx.fillText('Score: ', 10, 10)
		this.ctx.strokeText(this.score, 75, 10)
		this.ctx.fillText(this.score, 75, 10)
	}

	// Поле с рекордом
    displayLocalScore() {
		this.styleDisplay()
		this.ctx.strokeText('Best: ', 10, 50)
		this.ctx.fillText('Best: ', 10, 50)
		this.ctx.strokeText(this.highScore, 65, 50)
		this.ctx.fillText(this.highScore, 65, 50)
	}
}

export default Score;

