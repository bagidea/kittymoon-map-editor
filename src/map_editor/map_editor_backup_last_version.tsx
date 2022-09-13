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
    Shader,
    Texture,
    Vector2,
    Vector3
} from "three"

import {
    CSS2DRenderer,
    CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer"

import CoreEngine from "../core3d/core_engine"

interface MapTilesetData {
    index: number,
    position: Vector3,
    is_walk: boolean,
    layer: number
}

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

    private resources_count: number
    private resources_max: number
    private is_start: boolean

    private floorBlocks: InstancedMesh
    private mapTilesets: Map<string, MapTilesetData>

    private t_x: Int8Array
    private t_y: Int8Array
    private b_x: Float32Array
    private b_y: Float32Array
    private f_layer: Int8Array

    constructor(canvas: HTMLCanvasElement, frame: HTMLDivElement) {
        super(canvas)

        this.frame = frame

        this.c_x = 0
        this.c_y = 0
        this.key_g_down = false
        this.mapActionState = ""

        this.resources_count = 0
        this.resources_max = 3
        this.is_start = false

        this.keyPress = new Map<string, boolean>()
        this.texs = new Map<string, Texture>()
        this.mapTilesets = new Map<string, MapTilesetData>()
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
                if(this.mapActionState == "add") {
                    this.mapActionState = ""
                    //this.laterUpdate()
                }
                break
            case 3:
                if(this.mapActionState == "remove") {
                    this.mapActionState = ""
                    //this.laterUpdate()
                }
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
        this.loadTexture("/tilesets/water frames/Water_1.png", (i: Texture) => {
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
        })
    }

    subCheckFloor(c: number, r: number, status: boolean = true) {
        const block: MapTilesetData = this.mapTilesets.get("block_"+c+"_"+r)

        const b_u: boolean = r > 0 ? this.mapTilesets.get("block_"+c+"_"+(r - 1)).is_walk : false
        const b_d: boolean = r < 99 ? this.mapTilesets.get("block_"+c+"_"+(r + 1)).is_walk : false
        const b_l: boolean = c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+r).is_walk : false
        const b_r: boolean = c < 99 ?this.mapTilesets.get("block_"+(c + 1)+"_"+r).is_walk : false
        const b_u_l: boolean = r > 0 && c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+(r - 1)).is_walk : false
        const b_u_r: boolean = r > 0 && c < 99 ? this.mapTilesets.get("block_"+(c + 1)+"_"+(r - 1)).is_walk : false
        const b_d_l: boolean = r < 99 && c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+(r + 1)).is_walk : false
        const b_d_r: boolean = r < 99 && c < 99 ? this.mapTilesets.get("block_"+(c + 1)+"_"+(r + 1)).is_walk : false

        if(!b_u && !b_d && !b_l && !b_r) {
            this.t_x[block.index] = 0
            this.t_y[block.index] = 3
        }
        else if(b_u && !b_d && !b_l && !b_r) {
            if(b_u_l && b_u_r /*&& !b_d_l && !b_d_r*/) {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 5
            } else {
                this.t_x[block.index] = 0
                this.t_y[block.index] = 2
            }
        }
        else if(!b_u && b_d && !b_l && !b_r) {
            if(/*!b_u_l && !b_u_r &&*/ b_d_l && b_d_r) {
                this.t_x[block.index] = 0
                this.t_y[block.index] = 4
            } else {
                this.t_x[block.index] = 0
                this.t_y[block.index] = 0
            }
        }
        else if(!b_u && !b_d && b_l && !b_r) {
            if(/*!b_u_l && !b_u_r &&*/ b_d_l /*&& !b_d_r*/) {
                this.t_x[block.index] = 3
                this.t_y[block.index] = 4
            } else {
                this.t_x[block.index] = 3
                this.t_y[block.index] = 3
            }
        }
        else if(!b_u && !b_d && !b_l && b_r) {
            if(/*!b_u_l && !b_u_r && !b_d_l &&*/ b_d_r) {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 5
            } else {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 3
            }
        }
        else if(b_u && !b_d && b_l && !b_r) {
            this.t_x[block.index] = 3
            this.t_y[block.index] = 2
        }
        else if(b_u && !b_d && !b_l && b_r) {
            this.t_x[block.index] = 1
            this.t_y[block.index] = 2
        }
        else if(b_u && !b_d && b_l && b_r) {
            this.t_x[block.index] = 2
            this.t_y[block.index] = 2
        }
        else if(!b_u && b_d && b_l && !b_r) {
            this.t_x[block.index] = 3
            this.t_y[block.index] = 0
        }
        else if(!b_u && b_d && !b_l && b_r) {
            this.t_x[block.index] = 1
            this.t_y[block.index] = 0
        }
        else if(!b_u && b_d && b_l && b_r) {
            if(/*b_u_l && b_u_r &&*/ !b_d_l && !b_d_r) {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 4
            } else {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 0
            }
        }
        else if(b_u && b_d && !b_l && !b_r) {
            this.t_x[block.index] = 0
            this.t_y[block.index] = 1
        }
        else if(b_u && b_d && b_l && !b_r) {
            if(!b_u_l /*&& b_u_r*/ && !b_d_l /*&& !b_d_r*/) {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 4
            } else {
                this.t_x[block.index] = 3
                this.t_y[block.index] = 1
            }
        }
        else if(b_u && b_d && !b_l && b_r) {
            if(/*b_u_l &&*/ !b_u_r /*&& b_d_l*/ && !b_d_r) {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 4
            } else {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 1
            }
        }
        else if(!b_u && !b_d && b_l && b_r) {
            this.t_x[block.index] = 2
            this.t_y[block.index] = 3
        }
        else if(b_u && b_d && b_l && b_r) {
            if(b_u_l && b_u_r && b_d_l && b_d_r) {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 1
            }
            else if(!b_u_l && b_u_r && b_d_l && b_d_r) {
                this.t_x[block.index] = 4
                this.t_y[block.index] = 0
            }
            else if(b_u_l && !b_u_r && b_d_l && b_d_r) {
                this.t_x[block.index] = 5
                this.t_y[block.index] = 0
            }
            else if(b_u_l && b_u_r && !b_d_l && b_d_r) {
                this.t_x[block.index] = 4
                this.t_y[block.index] = 2
            }
            else if(b_u_l && b_u_r && b_d_l && !b_d_r) {
                this.t_x[block.index] = 5
                this.t_y[block.index] = 2
            }
            else if(!b_u_l && !b_u_r && b_d_l && b_d_r) {
                this.t_x[block.index] = 0
                this.t_y[block.index] = 5
            }
            else if(b_u_l && b_u_r && !b_d_l && !b_d_r) {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 4
            }
            else if(!b_u_l && b_u_r && !b_d_l && b_d_r) {
                this.t_x[block.index] = 3
                this.t_y[block.index] = 5
            }
            else if(b_u_l && !b_u_r && b_d_l && !b_d_r) {
                this.t_x[block.index] = 2
                this.t_y[block.index] = 4
            }
            else if(!b_u_l && !b_u_r && !b_d_l && b_d_r) {
                this.t_x[block.index] = 4
                this.t_y[block.index] = 0
            }
            else if(!b_u_l && !b_u_r && b_d_l && !b_d_r) {
                this.t_x[block.index] = 5
                this.t_y[block.index] = 0
            }
            else if(!b_u_l && b_u_r && !b_d_l && !b_d_r) {
                this.t_x[block.index] = 4
                this.t_y[block.index] = 2
            }
            else if(b_u_l && !b_u_r && !b_d_l && !b_d_r) {
                this.t_x[block.index] = 5
                this.t_y[block.index] = 2
            }
            else if(!b_u_l && b_u_r && b_d_l && !b_d_r) {
                this.t_x[block.index] = 5
                this.t_y[block.index] = 2
            }
            else if(b_u_l && !b_u_r && !b_d_l && b_d_r) {
                this.t_x[block.index] = 4
                this.t_y[block.index] = 2
            } else {
                this.t_x[block.index] = 1
                this.t_y[block.index] = 4
            }
        }
        
        block.is_walk = status
        this.mapTilesets.set("block_"+c+"_"+r, block)

        this.f_layer[block.index] = this.keyPress.get("Control") ? 1 : 0

        this.floorBlocks.geometry.setAttribute("t_x", new InstancedBufferAttribute(this.t_x, 1))
        this.floorBlocks.geometry.setAttribute("t_y", new InstancedBufferAttribute(this.t_y, 1))
        this.floorBlocks.geometry.setAttribute("f_layer", new InstancedBufferAttribute(this.f_layer, 1))

        //this.f_layer[block.index] = 1
        //this.floorBlocks.geometry.setAttribute("f_layer", new InstancedBufferAttribute(this.f_layer, 1))
    }

    updateSubFloor(c: number, r: number) {
        const b_u: boolean = r > 0 ? this.mapTilesets.get("block_"+c+"_"+(r - 1)).is_walk : false
        const b_d: boolean = r < 99 ? this.mapTilesets.get("block_"+c+"_"+(r + 1)).is_walk : false
        const b_l: boolean = c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+r).is_walk : false
        const b_r: boolean = c < 99 ?this.mapTilesets.get("block_"+(c + 1)+"_"+r).is_walk : false
        const b_u_l: boolean = r > 0 && c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+(r - 1)).is_walk : false
        const b_u_r: boolean = r > 0 && c < 99 ? this.mapTilesets.get("block_"+(c + 1)+"_"+(r - 1)).is_walk : false
        const b_d_l: boolean = r < 99 && c > 0 ? this.mapTilesets.get("block_"+(c - 1)+"_"+(r + 1)).is_walk : false
        const b_d_r: boolean = r < 99 && c < 99 ? this.mapTilesets.get("block_"+(c + 1)+"_"+(r + 1)).is_walk : false

        if(b_u) this.subCheckFloor(c, r - 1)
        if(b_d) this.subCheckFloor(c, r + 1)
        if(b_l) this.subCheckFloor(c - 1, r)
        if(b_r) this.subCheckFloor(c + 1, r)
        if(b_u_l) this.subCheckFloor(c - 1, r - 1)
        if(b_u_r) this.subCheckFloor(c + 1, r - 1)
        if(b_d_l) this.subCheckFloor(c - 1, r + 1)
        if(b_d_r) this.subCheckFloor(c + 1, r + 1)
    }

    addFloor(c: number, r: number) {
        const rotation: Euler = new Euler()
        const quaternion: Quaternion = new Quaternion()

        rotation.y = rotation.z = MathUtils.degToRad(180)
        quaternion.setFromEuler(rotation)

        const block: MapTilesetData = this.mapTilesets.get("block_"+c+"_"+r)

        this.matrix.compose(block.position, quaternion, new Vector3(1, 1, 1))
        this.floorBlocks.setMatrixAt(block.index, this.matrix)
        this.floorBlocks.instanceMatrix.needsUpdate = true

        this.subCheckFloor(c, r)
        this.updateSubFloor(c, r)
    }

    removeFloor(c: number, r: number) {
        const block: MapTilesetData = this.mapTilesets.get("block_"+c+"_"+r)

        this.floorBlocks.setMatrixAt(block.index, new Matrix4())
        this.floorBlocks.instanceMatrix.needsUpdate = true

        this.subCheckFloor(c, r, false)
        this.updateSubFloor(c, r)
    }

    laterUpdate() {
        for(let r: number = 0; r < 100; r++) {
            for(let c: number = 0; c < 100; c++) {
                const block: MapTilesetData = this.mapTilesets.get("block_"+c+"_"+r)
                if(block.is_walk) this.subCheckFloor(c, r)
                else this.subCheckFloor(c, r, false)
            }
        }
    }

    loadedResource() {
        const b: number = 1 / 6

        const floorGeometry: PlaneGeometry = new PlaneGeometry(50, 50, 1, 1)

        const floorMaterial: MeshBasicMaterial = new MeshBasicMaterial({
            color: 0xffffff,
            transparent: true
        })

        floorMaterial.onBeforeCompile = (shader: Shader) => {
            shader.uniforms.texGrass = { value: this.texs.get("Grass") }
            shader.uniforms.texHills = { value: this.texs.get("Hills") }
            //shader.uniforms.texTilledDirt = { value: this.texs.get("TilledDirt") }

            shader.vertexShader = `
                attribute float t_x;
                attribute float t_y;
                attribute float b_x;
                attribute float b_y;
                attribute float f_layer;

                varying float vT_x;
                varying float vT_y;
                varying float vB_x;
                varying float vB_y;
                varying float vF_layer;

                ${shader.vertexShader}
            `.replace(
                `void main() {`,
                `void main() {
                    vT_x = t_x;
                    vT_y = t_y;
                    vB_x = b_x;
                    vB_y = b_y;
                    vF_layer = f_layer;
                `
            ),

            shader.fragmentShader = `
                uniform sampler2D texGrass;
                uniform sampler2D texHills;
                //uniform sampler2D texTilledDirt;

                varying float vT_x;
                varying float vT_y;
                varying float vB_x;
                varying float vB_y;
                varying float vF_layer;

                ${shader.fragmentShader}
            `.replaceAll(
                `#include <map_fragment>`,
                `#include <map_fragment>

                    vec2 blockUv = vec2(
                        vB_x * (vUv.x + vT_x),
                        vB_y * (vUv.y + (5.0f - vT_y))
                    ); 

                    if(vF_layer == 0.0f) {
                        vec4 blockColor = texture(texGrass, blockUv);
                        diffuseColor *= blockColor;
                    }
                    else {
                    //else if(vF_layer == 1.0f) {
                        vec4 blockColor = texture(texHills, blockUv);
                        diffuseColor *= blockColor;
                    } /*else {
                        vec4 blockColor = texture(texTilledDirt, blockUv);
                        diffuseColor *= blockColor;
                    }*/
                `
            )
        }
        
        floorMaterial.defines = { "USE_UV": "" }

        this.floorBlocks = new InstancedMesh(floorGeometry, floorMaterial, 10000)

        this.getScene().add(this.floorBlocks)

        this.t_x = new Int8Array(10000).fill(0)
        this.t_y = new Int8Array(10000).fill(0)
        this.b_x = new Float32Array(10000).fill(1 / 6)
        this.b_y = new Float32Array(10000).fill(1 / 6)
        this.f_layer = new Int8Array(10000).fill(0)

        let inx: number = 0

        for(let r: number = 0; r < 100; r++) {
            for(let c: number = 0; c < 100; c++) {
                this.mapTilesets.set(
                    "block_"+c+"_"+r,
                    {
                        index: inx++,
                        position: new Vector3(c * 50 + 25, r * 50 + 25, 0),
                        is_walk: false,
                        layer: 0
                    }
                )
            }
        }

        this.floorBlocks.geometry.setAttribute("t_x", new InstancedBufferAttribute(this.t_x, 1))
        this.floorBlocks.geometry.setAttribute("t_y", new InstancedBufferAttribute(this.t_y, 1))
        this.floorBlocks.geometry.setAttribute("b_x", new InstancedBufferAttribute(this.b_x, 1))
        this.floorBlocks.geometry.setAttribute("b_y", new InstancedBufferAttribute(this.b_y, 1))
        this.floorBlocks.geometry.setAttribute("f_layer", new InstancedBufferAttribute(this.f_layer, 1))

        this.is_start = true
    }

    createFloor() {
        this.loadTexture("/tilesets/Grass.png", (i: Texture) => {
            const b: number = 1 / 6

            const tex: Texture = i
            tex.magFilter = NearestFilter
            tex.repeat.x = tex.repeat.y = b
            tex.offset.set(b * 0, (1 - b) - b * 0)

            this.texs.set("Grass", tex)
            this.resources_count++

            if(this.resources_count >= this.resources_max) this.loadedResource()
        })

        this.loadTexture("/tilesets/Hills.png", (i: Texture) => {
            const b: number = 1 / 6

            const tex: Texture = i
            tex.magFilter = NearestFilter
            tex.repeat.x = tex.repeat.y = b
            tex.offset.set(b * 0, (1 - b) - b * 0)

            this.texs.set("Hills", tex)
            this.resources_count++

            if(this.resources_count >= this.resources_max) this.loadedResource()
        })

        this.loadTexture("/tilesets/TilledDirt.png", (i: Texture) => {
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

        switch(this.mapActionState) {
            case "add":
                this.addFloor(this.pointer.x, this.pointer.y)
                break
            case "remove":
                this.removeFloor(this.pointer.x, this.pointer.y)
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