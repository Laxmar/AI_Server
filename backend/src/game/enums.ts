
export const enum GameStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

export const enum MoveDirections {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    UP = "UP",
    DOWN = "DOWN",
    NO_MOVE = "NO_MOVE"
}

export const MoveDirectionsArray: MoveDirections[] = [MoveDirections.LEFT, MoveDirections.RIGHT, MoveDirections.UP, MoveDirections.DOWN, MoveDirections.NO_MOVE];

export const enum GameMode {
    AUTO = "AUTO",
    DELAY = "DELAY",
    MANUAL = "MANUAL"
}

export  enum GroundTypes {
    GRASS = 1,
    WATER = 2,
    SWAMP = 3,
}
