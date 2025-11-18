class Config {
    constructor() {
        this.FLAP = new Audio();
		this.FLAP.src = './audio/sfx_flap.wav'

        this.HIT = new Audio();
        this.HIT.src = "audio/sfx_hit.wav";

        this.SCORE_S = new Audio();
        this.SCORE_S.src = "audio/sfx_point.wav";

        this.DIE = new Audio();
        this.DIE.src = "audio/sfx_die.wav";

        this.SWOOSHING = new Audio();
        this.SWOOSHING.src = "audio/sfx_swooshing.wav";
    }

    pipe = {
        width: 66, // Ширина трубы
        height: 520, // Высота трубы
        spacing: 130, // расстояние между трубами по вертикали
    }

    bird = {
        width: 33, // ширина птички
        height: 26, // высота птички
    }

    ground = {
        height: 100, // Высота земли
        width: 2000, // Ширина земли
    }

    gravity = 0.03 // скорость падения
    flapPower = 1.8 // скорость взмахов крыльев
    velocity = 0 // Начальная скорость
    DISTANCE_BETWEEN_PIPES = 4 * this.pipe.width // Расстояние между трубами
    SPEED = 2.5// Скорость
    INDEX = 0 // Индекс
    frameCount = 0 // Количетсво кадров
}

export default Config;

