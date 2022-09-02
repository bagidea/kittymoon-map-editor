import CoreEngine from "../core3d/core_engine";

class MapEditor extends CoreEngine {
    private frame: HTMLDivElement

    constructor(canvas: HTMLCanvasElement, frame: HTMLDivElement) {
        super(canvas)

        this.frame = frame
    }

    create() {
    }

    input() {
    }
}

export default MapEditor