import {
    Clock,
    OrthographicCamera,
    Scene,
    Texture,
    TextureLoader,
    WebGLRenderer
} from "three"

class CoreEngine {
    private canvas: HTMLCanvasElement

    private renderer: WebGLRenderer
    private scene: Scene
    private camera: OrthographicCamera

    private texLoader: TextureLoader
    private clock: Clock

    private update: (deltaTime: number) => void
    private after_update: (deltaTime: number) => void

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }

    windowResize = () => {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.camera.left = -w / 2
        this.camera.right = w / 2
        this.camera.top = -h / 2
        this.camera.bottom = h / 2
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(w, h)
    }

    init() {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas })
        this.renderer.setSize(w, h)

        this.scene = new Scene()

        this.camera = new OrthographicCamera(-w / 2, w / 2, -h / 2, h / 2, 1, 110)
        this.camera.position.set(0, 0, 100)

        this.clock = new Clock()

        window.addEventListener('resize', this.windowResize)

        this.initTools()
    }
    
    initTools() {
        this.texLoader = new TextureLoader()
    }

    loadTexture(path: string = "", callback: (i: Texture) => void) {
        this.texLoader.load(path, (i: Texture) => { if(!!callback) callback(i) })
    }

    render = () => {
        requestAnimationFrame(this.render)
        if(!!this.update) this.update(this.clock.getDelta())
        this.renderer.render(this.scene, this.camera)
        if(!!this.after_update) this.after_update(this.clock.getDelta())
    }

    setUpdateFunction(updateFunction: (deltaTime: number) => void) { this.update = updateFunction }
    setAfterUpdateFunction(afterUpdateFunction: (deltaTime: number) => void) { this.after_update = afterUpdateFunction }

    getCanvas(): HTMLCanvasElement { return this.canvas }
    getScene(): Scene { return this.scene }
    getCamera(): OrthographicCamera { return this.camera }
    getDeltaTime(): number { return this.clock.getDelta() }
}

export default CoreEngine