import {
    Clock,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    OrthographicCamera,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    Texture,
    TextureLoader,
    WebGLRenderer,
    GridHelper,
    InstancedMesh,
    Vector3,
    Euler
} from "three"

interface MapTilesetData {
    index: number,
    position: Vector3,
    rotation: Euler,
    scale: Vector3,
    tile_index: number,
    is_walk: boolean
}

class CoreEngine {
    private canvas: HTMLCanvasElement
    private frame: HTMLDivElement

    private renderer: WebGLRenderer
    private scene: Scene
    private camera: OrthographicCamera

    private texLoader: TextureLoader
    private clock: Clock

    //private waters: Texture[] = []
    //private water_frames: number = 0
    //private water_tmr: number = 0

    private water: Texture

    //private tilesets: MeshBasicMaterial[] = []

    private tilesets: Map<string, InstancedMesh> = new Map<string, InstancedMesh>()
    private mapTilesets: Map<string, MapTilesetData> = new Map<string, MapTilesetData>()

    private keyPress: Map<string, boolean> = new Map<string, boolean>()

    constructor(canvas: HTMLCanvasElement, frame: HTMLDivElement) {
        this.canvas = canvas
        this.frame = frame
    }

    windowResize = () => {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.frame.style.width = (w / 5000 * 200)+"px";
        this.frame.style.height = (h / 5000 * 200)+"px";

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

        this.frame.style.width = (w / 5000 * 200)+"px";
        this.frame.style.height = (h / 5000 * 200)+"px";

        this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas })
        this.renderer.setSize(w, h)

        this.scene = new Scene()

        this.camera = new OrthographicCamera(-w / 2, w / 2, -h / 2, h / 2, 1, 110)
        //this.camera.position.set(0, 0, 5)
        //this.camera.position.set(w / 2, h / 2, 5)
        this.camera.position.set(2500, 2500, 100)

        window.addEventListener('resize', this.windowResize)

        this.clock = new Clock()

        this.initTools()
    }
    
    initTools() {
        this.texLoader = new TextureLoader()
    }

    create() {
        const w: number = window.innerWidth
        const h: number = window.innerHeight
        const d180: number = MathUtils.degToRad(180)
        const b: number = 1 / 6

        this.water = this.texLoader.load("/tilesets/water frames/Water_1.png")
        this.water.magFilter = NearestFilter
        this.water.wrapS = this.water.wrapT = RepeatWrapping
        //this.water.repeat.x = 5000 / 50 / 100 * (w / 16)
        //this.water.repeat.y = 5000 / 50 / 100 * (h / 16)
        this.water.repeat.x = 5000 / 50
        this.water.repeat.y = 5000 / 50

        const waterGeometry: PlaneGeometry = new PlaneGeometry(5000, 5000, 1, 1)
        const waterMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffffff, map: this.water })

        const waterMesh: Mesh = new Mesh(waterGeometry, waterMaterial)
        waterMesh.position.x = waterMesh.position.y = 2500
        waterMesh.position.z = -2
        waterMesh.rotation.y = MathUtils.degToRad(180)
        this.scene.add(waterMesh)

        const grid: GridHelper = new GridHelper(5000, 100, 0xffffff, 0xffffff)
        grid.position.x = grid.position.y = 2500
        //grid.rotation.y = MathUtils.degToRad(180)
        grid.rotation.x = MathUtils.degToRad(90)
        this.scene.add(grid)

        const hillTex: Texture = this.texLoader.load("/tilesets/Hills.png")
        const hillGeo: PlaneGeometry = new PlaneGeometry(50, 50, 1, 1)
        const hillMat: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffffff, map: hillTex })
        const hillMesh: InstancedMesh = new InstancedMesh(hillGeo, hillMat, 10000)
        this.tilesets.set("hill", hillMesh)

        let inx: number = 0

        for(let r: number = 0; r < 100; r++) {
            for(let c: number = 0; c < 100; c++) {
                this.mapTilesets.set(
                    "block_"+c+"_"+r,
                    {
                        index: inx,
                        position: new Vector3(),
                        rotation: new Euler(),
                        scale: new Vector3(),
                        tile_index: -1,
                        is_walk: false
                    }
                )

                inx++
            }
        }

        /*const gridGeometry: PlaneGeometry = new PlaneGeometry(5000, 5000, 100, 100)
        const gridMaterial: MeshStandardMaterial = new MeshStandardMaterial({ wireframe: true, opacity: 0.1, transparent: true })
        const grid: Mesh = new Mesh(gridGeometry, gridMaterial)
        grid.position.x = grid.position.y = 2500
        grid.position.z = -2
        grid.rotation.y = MathUtils.degToRad(180)
        this.scene.add(grid)*/

        /*const tex: Texture = this.texLoader.load("/tilesets/Hills.png")
        tex.magFilter = NearestFilter
        tex.repeat.x = tex.repeat.y = b*/

        /*for(let i = 1; i <= 4; i++) {
            const texWater: Texture = this.texLoader.load("/tilesets/water frames/Water_"+i+".png")
            texWater.magFilter = NearestFilter
            texWater.wrapS = texWater.wrapT = RepeatWrapping
            texWater.repeat.x = w / 50 / 100 * (w / 16)
            texWater.repeat.y = h / 50 / 100 * (h / 16)

            this.waters.push(texWater)
        }

        this.scene.background = this.waters[this.water_frames]
        this.water_tmr = Date.now()*/

        /*this.water = this.texLoader.load("/tilesets/water frames/Water_1.png")
        this.water.magFilter = NearestFilter
        this.water.wrapS = this.water.wrapT = RepeatWrapping
        this.water.repeat.x = w / 50 / 100 * (w / 16)
        this.water.repeat.y = h / 50 / 100 * (h / 16)
        this.scene.background = this.water

        const boxGeometry: PlaneGeometry = new PlaneGeometry(50, 50)
        const boxMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: "0xffffff", transparent: true })

        for(let y: number = 0; y < 6; y++) {
            for(let x: number = 0; x < 6; x++) {
                const new_tex: Texture = tex.clone()

                new_tex.offset.set(
                    b * x,
                    (1 - b) - b * y
                )

                const new_material: MeshBasicMaterial = boxMaterial.clone()
                new_material.map = new_tex

                this.tilesets.push(new_material)
            }
        }

        const game_map: Array<number[]> = new Array<number[]>(
            [ 1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  3],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [ 7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9],
            [13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15]
        )

        for(let y = 0; y < game_map.length; y++) {
            for(let x = 0; x < game_map[y].length; x++) {
                const box: Mesh = new Mesh(boxGeometry, this.tilesets[game_map[y][x]])
                box.rotation.y = box.rotation.z = d180

                box.position.set(x * 50, y * 50, 0)

                this.scene.add(box)
            }
        }*/
    }

    keydown = (e: KeyboardEvent) => {
        switch(e.key) {
            case "ArrowUp":
                this.keyPress.set("ArrowUp", true)
                break
            case "ArrowDown":
                this.keyPress.set("ArrowDown", true)
                break
            case "ArrowLeft":
                this.keyPress.set("ArrowLeft", true)
                break
            case "ArrowRight":
                this.keyPress.set("ArrowRight", true)
                break
            case "Shift":
                this.keyPress.set("Shift", true)
                break
        }
    }

    keyup = (e: KeyboardEvent) => {
        switch(e.key) {
            case "ArrowUp":
                this.keyPress.set("ArrowUp", false)
                break
            case "ArrowDown":
                this.keyPress.set("ArrowDown", false)
                break
            case "ArrowLeft":
                this.keyPress.set("ArrowLeft", false)
                break
            case "ArrowRight":
                this.keyPress.set("ArrowRight", false)
                break
            case "Shift":
                this.keyPress.set("Shift", false)
                break
        }
    }

    input() {
        this.keyPress.set("ArrowUp", false)
        this.keyPress.set("ArrowDown", false)
        this.keyPress.set("ArrowLeft", false)
        this.keyPress.set("ArrowRight", false)

        window.addEventListener('keydown', this.keydown)
        window.addEventListener('keyup', this.keyup)
    }

    controls(tmr: number) {
        const moveSpd: number = (this.keyPress.get("Shift") ? 1000 : 400)

        if(this.keyPress.get("ArrowUp")) this.camera.position.y -= tmr * moveSpd
        if(this.keyPress.get("ArrowDown")) this.camera.position.y += tmr * moveSpd
        if(this.keyPress.get("ArrowLeft")) this.camera.position.x -= tmr * moveSpd
        if(this.keyPress.get("ArrowRight")) this.camera.position.x += tmr * moveSpd
    }

    cameraAndFrameUpdate(w: number, h: number) {
        this.camera.position.x = this.camera.position.x < w / 2 ?
                                    w / 2 :
                                    this.camera.position.x > 5000 - (w / 2) ?
                                        5000 - (w / 2) :
                                        this.camera.position.x

        this.camera.position.y = this.camera.position.y < h / 2 ?
                                    h / 2 :
                                    this.camera.position.y > 5000 - (h / 2) ?
                                        5000 - (h / 2) :
                                        this.camera.position.y
        //console.log(this.camera.position.x+" : "+(-w / 2))

        this.frame.style.left = ((this.camera.position.x - w / 2) / 5000 * 189)+"px" // sub border 10px + 1px
        this.frame.style.top = ((this.camera.position.y - h / 2) / 5000 * 189)+"px" // sub border 10px + 1px
    }

    render = () => {
        requestAnimationFrame(this.render)

        const w: number = window.innerWidth
        const h: number = window.innerHeight
        const tmr: number = this.clock.getDelta()

        /*if(Date.now() - this.water_tmr >= 100) {
            this.water_frames = ++this.water_frames % 4
            this.scene.background = this.waters[this.water_frames]
            this.water_tmr = Date.now()
        }*/

        this.water.offset.x = (this.water.offset.x + tmr * 0.5) % 1
        //this.camera.position.y += tmr * 50

        this.controls(tmr)
        this.cameraAndFrameUpdate(w, h)

        this.renderer.render(this.scene, this.camera)
    }
}

export default CoreEngine