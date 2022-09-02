import {
    Clock,
    OrthographicCamera,
    Scene,
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

    render = () => {
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }
}

export default CoreEngine