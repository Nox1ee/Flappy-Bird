class Config {
    constructor() {
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

    gravity = 0.4 // скорость падения
    flapPower = 6 // скорость взмахов крыльев
    velocity = 0 // Начальная скорость
    DISTANCE_BETWEEN_PIPES = 1 * this.pipe.width // Расстояние между трубами
    SPEED = 4 // Скорость
    INDEX = 0 // Индекс
    frameCount = 0 // Количетсво кадров
}
export default Config;


