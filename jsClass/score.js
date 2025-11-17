import Config from './config.js'

class Score {
    constructor(canvas) {
        this.config = new Config();

        // принятый элемент
		this.canvas = canvas

		// контекст канваса
		this.ctx = this.canvas.getContext('2d')

        this.score = 0 // Количество очков
		this.localScore = localStorage.getItem('highScore') // Рекорд
    }

    update() {
        this.score++
        this.config.SPEED += 0.01
		this.config.SCORE_S.play();
		this.config.SCORE_S.currentTime = 0;
    }

    styleDisplay() {
		// стили для очков
		this.ctx.font = '30px Gorditas'
		this.ctx.fillStyle = 'white'
		this.ctx.textAlign = 'left'

		this.ctx.lineWidth = 8
		this.ctx.strokeStyle = '#533846'
		this.ctx.textBaseline = 'top'
	}

    displayScore() {
		// рисуем поле с количеством очков
		this.styleDisplay()
		this.ctx.strokeText('Score: ', 10, 10)
		this.ctx.fillText('Score: ', 10, 10)
		this.ctx.strokeText(this.score, 110, 10)
		this.ctx.fillText(this.score, 110, 10)
	}

    displayLocalScore() {
		// рисуем поле с количеством очков в истории
		this.styleDisplay()
		this.ctx.strokeText('Best: ', 10, 50)
		this.ctx.fillText('Best: ', 10, 50)
		this.ctx.strokeText(this.localScore, 90, 50)
		this.ctx.fillText(this.localScore, 90, 50)
	}
}

export default Score;