import {
    Euler,
    GridHelper,
    InstancedBufferAttribute,
    InstancedMesh,
    MathUtils,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    OrthographicCamera,
    PlaneGeometry,
    Quaternion,
    RepeatWrapping,
    Texture,
    Vector2,
    Vector3
} from "three"

import {
    CSS2DRenderer,
    CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer"

import {
    MapTilesetData,
    TilesetXY,
    BlockXY
} from "./map_interface"

import CoreEngine from "../core3d/core_engine"
import CreateInstancedMesh from "./map_instanced_mesh_custom"
import CheckPattern from "./map_check_pattern"

class MapEditor extends CoreEngine {
    private frame: HTMLDivElement
    private keyPress: Map<string, boolean>
    private pointer: Vector2
    private matrix: Matrix4

    private c_x: number
    private c_y: number
    private key_g_down: boolean
    private mapActionState: string

    private css2dRenderer: CSS2DRenderer
    private text_pos: HTMLDivElement
    private textPosition: CSS2DObject

    private grid: GridHelper
    private water: Texture
    private texs: Map<string, Texture>

    private resources: Array<string>
    private resources_count: number
    private resources_max: number

    private is_start: boolean

    private mapTilesets: Map<number, Map<string, MapTilesetData>>

    private floorBlocks: Map<number, InstancedMesh>
    private tilesetXYs: Map<number, TilesetXY>
    private blockXYs: Map<number, BlockXY>

    private view_mode: string
    private view_stetes: Map<string, HTMLElement>

    constructor(canvas: HTMLCanvasElement, frame: HTMLDivElement) {
        super(canvas)

        this.frame = frame

        this.c_x = 0
        this.c_y = 0
        this.key_g_down = false
        this.mapActionState = ""

        this.resources = new Array<string>(
            "/tilesets/water frames/Water_1.png",
            "/tilesets/Grass.png",
            "/tilesets/Hills.png",
            "/tilesets/TilledDirt.png"
        )

        this.resources_count = 0
        this.resources_max = this.resources.length

        this.is_start = false

        this.keyPress = new Map<string, boolean>()
        this.texs = new Map<string, Texture>()

        this.mapTilesets = new Map<number, Map<string, MapTilesetData>>()
        this.mapTilesets.set(0, new Map<string, MapTilesetData>())
        this.mapTilesets.set(1, new Map<string, MapTilesetData>())

        this.floorBlocks = new Map<number, InstancedMesh>()
        this.tilesetXYs = new Map<number, TilesetXY>()
        this.blockXYs = new Map<number, BlockXY>()

        this.view_mode = "all"

        this.view_stetes = new Map<string, HTMLElement>()
        this.view_stetes.set("v_1", document.getElementById("v_1"))
        this.view_stetes.set("v_2", document.getElementById("v_2"))
        this.view_stetes.set("v_3", document.getElementById("v_3"))

        this.setViewState("v_1", true)
    }

    onWindowResize = () => {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.frame.style.width = (w / 5000 * 200)+"px";
        this.frame.style.height = (h / 5000 * 200)+"px";

        this.css2dRenderer.setSize(w, h)
    }

    pointerUpdate() {
        const w: number = window.innerWidth
        const h: number = window.innerHeight
        const px: number = ((this.getCamera().position.x - w / 2) + this.c_x)
        const py: number = ((this.getCamera().position.y - h / 2) + this.c_y)

        this.pointer.x = Math.floor(px / 50)
        this.pointer.y = Math.floor(py / 50)

        this.text_pos.textContent = "X: "+this.pointer.x+", Y: "+this.pointer.y
        this.textPosition.position.set(px, py + 40, 0)
    }

    onPointerMove = (e: PointerEvent) => {
        this.c_x = e.clientX
        this.c_y = e.clientY

        this.textPosition.visible = true
        this.pointerUpdate()
    }

    onMouseDown = (e: MouseEvent) => {
        switch(e.which) {
            case 1:
                if(this.mapActionState == "") this.mapActionState = "add"
                break
            case 3:
                if(this.mapActionState == "") this.mapActionState = "remove"
                break
            default:
        }
    }

    onMouseUp = (e: MouseEvent) => {
        switch(e.which) {
            case 1:
                if(this.mapActionState == "add") this.mapActionState = ""
                break
            case 3:
                if(this.mapActionState == "remove") this.mapActionState = ""
                break
            default:
        }
    }

    css2dSetup() {
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.text_pos = document.createElement('div')
        this.text_pos.style.fontSize = "14px"
        this.text_pos.style.fontWeight = "600"
        this.text_pos.textContent = "X: 0, Y: 0"

        this.textPosition = new CSS2DObject(this.text_pos)
        this.textPosition.visible = false

        this.getScene().add(this.textPosition)

        this.css2dRenderer = new CSS2DRenderer()
        this.css2dRenderer.setSize(w, h)
        this.css2dRenderer.domElement.style.position = "absolute"
        this.css2dRenderer.domElement.style.top = "0px"
        this.css2dRenderer.domElement.style.left = "0px"

        document.body.appendChild(this.css2dRenderer.domElement)
    }

    setup() {
        this.getCamera().position.set(2500, 2500, 100)

        const w: number = window.innerWidth
        const h: number = window.innerHeight

        this.frame.style.width = (w / 5000 * 200)+"px";
        this.frame.style.height = (h / 5000 * 200)+"px";

        this.pointer = new Vector2()

        this.grid = new GridHelper(5000, 100, 0xffffff, 0xffffff)
        this.grid.position.x = this.grid.position.y = 2500
        this.grid.position.z = 99
        this.grid.rotation.x = MathUtils.degToRad(90)

        this.getScene().add(this.grid)

        this.matrix = new Matrix4()

        window.addEventListener("resize", this.onWindowResize)
        window.addEventListener("pointermove", this.onPointerMove)
        document.addEventListener('mousedown', this.onMouseDown)
        document.addEventListener('mouseup', this.onMouseUp)

        this.css2dSetup()
        this.setUpdateFunction(this.loop)
        this.setAfterUpdateFunction(this.afterRender)
        this.cameraAndFrameUpdate(w, h)
    }

    createWater() {
        // Water
        this.loadTexture(this.resources[0], (i: Texture) => {
            this.water = i
            this.water.magFilter = NearestFilter
            this.water.wrapS = this.water.wrapT = RepeatWrapping
            this.water.repeat.x = 5000 / 50
            this.water.repeat.y = 5000 / 50

            const waterGeometry: PlaneGeometry = new PlaneGeometry(5000, 5000, 1, 1)
            const waterMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffffff, map: this.water })

            const waterMesh: Mesh = new Mesh(waterGeometry, waterMaterial)
            waterMesh.position.x = waterMesh.position.y = 2500
            waterMesh.position.z = -2
            waterMesh.rotation.y = MathUtils.degToRad(180)

            this.getScene().add(waterMesh)

            this.resources_count++
            if(this.resources_count >= this.resources_max) this.loadedResource()
        })
    }

    getIsWalk = (c: number, r: number, layer: number): Array<boolean> => {
        const b_u: boolean = r > 0 ? this.mapTilesets.get(layer).get("block_"+c+"_"+(r - 1)).is_walk : false
        const b_d: boolean = r < 99 ? this.mapTilesets.get(layer).get("block_"+c+"_"+(r + 1)).is_walk : false
        const b_l: boolean = c > 0 ? this.mapTilesets.get(layer).get("block_"+(c - 1)+"_"+r).is_walk : false
        const b_r: boolean = c < 99 ?this.mapTilesets.get(layer).get("block_"+(c + 1)+"_"+r).is_walk : false
        const b_u_l: boolean = r > 0 && c > 0 ? this.mapTilesets.get(layer).get("block_"+(c - 1)+"_"+(r - 1)).is_walk : false
        const b_u_r: boolean = r > 0 && c < 99 ? this.mapTilesets.get(layer).get("block_"+(c + 1)+"_"+(r - 1)).is_walk : false
        const b_d_l: boolean = r < 99 && c > 0 ? this.mapTilesets.get(layer).get("block_"+(c - 1)+"_"+(r + 1)).is_walk : false
        const b_d_r: boolean = r < 99 && c < 99 ? this.mapTilesets.get(layer).get("block_"+(c + 1)+"_"+(r + 1)).is_walk : false

        return new Array<boolean>(b_u, b_d, b_l, b_r, b_u_l, b_u_r, b_d_l, b_d_r)
    }

    subCheckFloor(c: number, r: number, status: boolean = true, layer: number = 0) {
        const block: MapTilesetData = this.mapTilesets.get(layer).get("block_"+c+"_"+r)
        const [b_u, b_d, b_l, b_r, b_u_l, b_u_r, b_d_l, b_d_r] = this.getIsWalk(c, r, layer)

        CheckPattern(this.tilesetXYs.get(layer), block, b_u, b_d, b_l, b_r, b_u_l, b_u_r, b_d_l, b_d_r, layer)
        
        block.is_walk = status
        this.mapTilesets.get(layer).set("block_"+c+"_"+r, block)

        this.floorBlocks.get(layer).geometry.setAttribute("t_x", new InstancedBufferAttribute(this.tilesetXYs.get(layer).x, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("t_y", new InstancedBufferAttribute(this.tilesetXYs.get(layer).y, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("b_x", new InstancedBufferAttribute(this.blockXYs.get(layer).x, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("b_y", new InstancedBufferAttribute(this.blockXYs.get(layer).y, 1))
    }

    updateSubFloor(c: number, r: number, layer: number = 0) {
        const [b_u, b_d, b_l, b_r, b_u_l, b_u_r, b_d_l, b_d_r] = this.getIsWalk(c, r, layer)

        if(b_u) this.subCheckFloor(c, r - 1, true, layer)
        if(b_d) this.subCheckFloor(c, r + 1, true, layer)
        if(b_l) this.subCheckFloor(c - 1, r, true, layer)
        if(b_r) this.subCheckFloor(c + 1, r, true, layer)
        if(b_u_l) this.subCheckFloor(c - 1, r - 1, true, layer)
        if(b_u_r) this.subCheckFloor(c + 1, r - 1, true, layer)
        if(b_d_l) this.subCheckFloor(c - 1, r + 1, true, layer)
        if(b_d_r) this.subCheckFloor(c + 1, r + 1, true, layer)
    }

    addFloor(c: number, r: number, layer: number = 0) {
        const rotation: Euler = new Euler()
        const quaternion: Quaternion = new Quaternion()

        rotation.y = rotation.z = MathUtils.degToRad(180)
        quaternion.setFromEuler(rotation)

        const block: MapTilesetData = this.mapTilesets.get(layer).get("block_"+c+"_"+r)

        this.matrix.compose(block.position, quaternion, new Vector3(1, 1, 1))
        this.floorBlocks.get(layer).setMatrixAt(block.index, this.matrix)
        this.floorBlocks.get(layer).instanceMatrix.needsUpdate = true

        this.subCheckFloor(c, r, true, layer)
        this.updateSubFloor(c, r, layer)
    }

    removeFloor(c: number, r: number, layer: number = 0) {
        const block: MapTilesetData = this.mapTilesets.get(layer).get("block_"+c+"_"+r)

        this.floorBlocks.get(layer).setMatrixAt(block.index, new Matrix4())
        this.floorBlocks.get(layer).instanceMatrix.needsUpdate = true

        this.subCheckFloor(c, r, false, layer)
        this.updateSubFloor(c, r, layer)
    }

    initTilesetMap = (layer: number, tex: Texture, b_x: number = 1 / 6, b_y: number = 1 / 6, last_y: number = 5) => {
        this.floorBlocks.set(layer, CreateInstancedMesh(tex, last_y))

        this.getScene().add(this.floorBlocks.get(layer))

        const t_xy: TilesetXY = {
            x: new Int8Array(10000).fill(0),
            y: new Int8Array(10000).fill(0)
        }

        this.tilesetXYs.set(layer, t_xy)

        const b_xy: BlockXY = {
            x: new Float32Array(10000).fill(b_x),
            y: new Float32Array(10000).fill(b_y)
        }

        this.blockXYs.set(layer, b_xy)

        let inx: number = 0

        for(let r: number = 0; r < 100; r++) {
            for(let c: number = 0; c < 100; c++) {
                const b_name: string = "block_"+c+"_"+r

                this.mapTilesets.get(layer).set(
                    b_name,
                    {
                        index: inx++,
                        position: new Vector3(c * 50 + 25, r * 50 + 25, 0),
                        is_walk: false
                    }
                )
            }
        }

        this.floorBlocks.get(layer).geometry.setAttribute("t_x", new InstancedBufferAttribute(this.tilesetXYs.get(layer).x, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("t_y", new InstancedBufferAttribute(this.tilesetXYs.get(layer).y, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("b_x", new InstancedBufferAttribute(this.blockXYs.get(layer).x, 1))
        this.floorBlocks.get(layer).geometry.setAttribute("b_y", new InstancedBufferAttribute(this.blockXYs.get(layer).y, 1))

    }

    loadedResource() {
        this.initTilesetMap(0, this.texs.get("Grass"), 1 / 10, 1 / 8, 7)
        this.initTilesetMap(1, this.texs.get("Hills"))

        this.is_start = true
    }

    createFloor() {
        // Grass
        this.loadTexture(this.resources[1], (i: Texture) => {
            const b_x: number = 1 / 10
            const b_y: number = 1 / 8

            const tex: Texture = i
            tex.magFilter = NearestFilter
            tex.repeat.x = b_x
            tex.repeat.y = b_y
            tex.offset.set(b_x * 0, (1 - b_y) - b_y * 0)

            this.texs.set("Grass", tex)

            this.resources_count++
            if(this.resources_count >= this.resources_max) this.loadedResource()
        })

        // Hills
        this.loadTexture(this.resources[2], (i: Texture) => {
            const b: number = 1 / 6

            const tex: Texture = i
            tex.magFilter = NearestFilter
            tex.repeat.x = tex.repeat.y = b
            tex.offset.set(b * 0, (1 - b) - b * 0)

            this.texs.set("Hills", tex)

            this.resources_count++
            if(this.resources_count >= this.resources_max) this.loadedResource()
        })

        // TilledDirt
        this.loadTexture(this.resources[3], (i: Texture) => {
            const b: number = 1 / 6

            const tex: Texture = i
            tex.magFilter = NearestFilter
            tex.repeat.x = tex.repeat.y = b
            tex.offset.set(b * 0, (1 - b) - b * 0)

            this.texs.set("TilledDirt", tex)

            this.resources_count++
            if(this.resources_count >= this.resources_max) this.loadedResource()
        })
    }

    create() {
        this.createWater()
        this.createFloor()
    }

    setMaterialOpacity(layer: number, value: number) {
        (this.floorBlocks.get(layer).material as MeshBasicMaterial).opacity = value
    }

    setViewState(view: string, enabled: boolean) {
        this.view_stetes.get(view).style.backgroundColor = enabled ? "black" : "white"
        this.view_stetes.get(view).style.color = enabled ? "white" : "black"
    }

    keydown = (e: KeyboardEvent) => {
        switch(e.code) {
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
            case "ShiftLeft" || "ShiftRight":
                this.keyPress.set("Shift", true)
                break
            case "ControlLeft" || "ControlRight":
                this.keyPress.set("Control", true)
                break
            case "KeyG":
                this.keyPress.set("KeyG", true)
                break
            case "Digit1":
                this.view_mode = "all";
                this.setMaterialOpacity(0, 1.0)
                this.setMaterialOpacity(1, 1.0)
                this.setViewState("v_1", true)
                this.setViewState("v_2", false)
                this.setViewState("v_3", false)
                break
            case "Digit2":
                this.view_mode = "layer0";
                this.setMaterialOpacity(0, 1.0)
                this.setMaterialOpacity(1, 0.5)
                this.setViewState("v_1", false)
                this.setViewState("v_2", true)
                this.setViewState("v_3", false)
                break
            case "Digit3":
                this.view_mode = "layer1";
                this.setMaterialOpacity(0, 0.5)
                this.setMaterialOpacity(1, 1.0)
                this.setViewState("v_1", false)
                this.setViewState("v_2", false)
                this.setViewState("v_3", true)
                break
        }
    }

    keyup = (e: KeyboardEvent) => {
        switch(e.code) {
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
            case "ShiftLeft" || "ShiftRight":
                this.keyPress.set("Shift", false)
                break
            case "ControlLeft" || "ControlRight":
                this.keyPress.set("Control", false)
                break
            case "KeyG":
                this.keyPress.set("KeyG", false)
                this.key_g_down = false
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

    controls(tmr: number, w: number, h: number) {
        const moveSpd: number = (this.keyPress.get("Shift") ? 1000 : 400)
        const camera: OrthographicCamera = this.getCamera()

        const ku: boolean = this.keyPress.get("ArrowUp")
        const kd: boolean = this.keyPress.get("ArrowDown")
        const kl: boolean = this.keyPress.get("ArrowLeft")
        const kr: boolean = this.keyPress.get("ArrowRight")
        const k_g: boolean = this.keyPress.get("KeyG")

        if(ku) camera.position.y -= tmr * moveSpd
        if(kd) camera.position.y += tmr * moveSpd
        if(kl) camera.position.x -= tmr * moveSpd
        if(kr) camera.position.x += tmr * moveSpd

        if(ku || kd || kl || kr) this.cameraAndFrameUpdate(w, h)

        if(k_g && !this.key_g_down) {
            this.key_g_down = true
            this.grid.visible = !this.grid.visible
        }
    }

    cameraAndFrameUpdate(w: number, h: number) {
        const camera: OrthographicCamera = this.getCamera()

        camera.position.x = camera.position.x < w / 2 ?
                                    w / 2 :
                                    camera.position.x > 5000 - (w / 2) ?
                                        5000 - (w / 2) :
                                        camera.position.x

        camera.position.y = camera.position.y < h / 2 ?
                                    h / 2 :
                                    camera.position.y > 5000 - (h / 2) ?
                                        5000 - (h / 2) :
                                        camera.position.y

        this.frame.style.left = ((camera.position.x - w / 2) / 5000 * 189)+"px"
        this.frame.style.top = ((camera.position.y - h / 2) / 5000 * 189)+"px"

        this.pointerUpdate()
    }

    mapCreator() {
        if(!this.is_start) return

        const k_ctrl: boolean = this.keyPress.get("Control")

        switch(this.mapActionState) {
            case "add":
                this.addFloor(this.pointer.x, this.pointer.y, k_ctrl ? 1 : 0)
                break
            case "remove":
                this.removeFloor(this.pointer.x, this.pointer.y, k_ctrl ? 1 : 0)
                break
            default:
        }
    }

    loop(deltaTime: number) {
        const tmr: number = deltaTime
        const w: number = window.innerWidth
        const h: number = window.innerHeight

        if(!!this.water) this.water.offset.x = (this.water.offset.x + tmr * 0.5) % 1

        this.controls(tmr, w, h)
        this.mapCreator()
    }

    afterRender(deltaTime: number) {
        this.css2dRenderer.render(this.getScene(), this.getCamera())
    }
}

export default MapEditor