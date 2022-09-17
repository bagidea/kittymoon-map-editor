import { Vector3 } from "three"

export interface MapTilesetData {
    index: number,
    position: Vector3,
    is_walk: boolean
}

export interface TilesetXY {
    x: Int8Array,
    y: Int8Array
}

export interface BlockXY {
    x: Float32Array,
    y: Float32Array
}
