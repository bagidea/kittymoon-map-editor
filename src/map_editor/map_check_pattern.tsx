import {
    MapTilesetData,
    TilesetXY
} from "./map_interface"

const CheckPattern = (
        tilesetXY: TilesetXY,
        block: MapTilesetData,
        b_u: boolean,
        b_d: boolean,
        b_l: boolean,
        b_r: boolean,
        b_u_l: boolean,
        b_u_r: boolean,
        b_d_l: boolean,
        b_d_r: boolean,
        layer: number
    ) => {
    if(!b_u && !b_d && !b_l && !b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 3
            tilesetXY.y[block.index] = 2
        } else {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 3
        }
    }
    else if(b_u && !b_d && !b_l && !b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 5
        } else {
            if(b_u_l && b_u_r /*&& !b_d_l && !b_d_r*/) {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 5
            } else {
                tilesetXY.x[block.index] = 0
                tilesetXY.y[block.index] = 2
            }
        }
    }
    else if(!b_u && b_d && !b_l && !b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 2
        } else {
            if(/*!b_u_l && !b_u_r &&*/ b_d_l && b_d_r) {
                tilesetXY.x[block.index] = 0
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 0
                tilesetXY.y[block.index] = 0
            }
        }
    }
    else if(!b_u && !b_d && b_l && !b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 3
            tilesetXY.y[block.index] = 6
        } else {
            if(/*!b_u_l && !b_u_r &&*/ b_d_l /*&& !b_d_r*/) {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 3
            }
        }
    }
    else if(!b_u && !b_d && !b_l && b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 6
        } else {
            if(/*!b_u_l && !b_u_r && !b_d_l &&*/ b_d_r) {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 5
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 3
            }
        }
    }
    else if(b_u && !b_d && b_l && !b_r) {
        if(layer == 0) {
            if(!b_u_l /*&& !b_u_r && !b_d_l && !b_d_r*/) {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 5
            }
        } else {
            tilesetXY.x[block.index] = 3
            tilesetXY.y[block.index] = 2
        }
    }
    else if(b_u && !b_d && !b_l && b_r) {
        if(layer == 0) {
            if(/*!b_u_l &&*/ !b_u_r /*&& !b_d_l && !b_d_r*/) {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 5
            }
        } else {
            tilesetXY.x[block.index] = 1
            tilesetXY.y[block.index] = 2
        }
    }
    else if(b_u && !b_d && b_l && b_r) {
        if(layer == 0) {
            if(!b_u_l && b_u_r) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 5
            }
            else if(b_u_l && !b_u_r) {
                tilesetXY.x[block.index] = 9
                tilesetXY.y[block.index] = 5
            }
            else if(!b_u_l && !b_u_r /*&& b_d_l && !b_d_r*/) {
                tilesetXY.x[block.index] = 9
                tilesetXY.y[block.index] = 2
            } else {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 5
            }
        } else {
            tilesetXY.x[block.index] = 2
            tilesetXY.y[block.index] = 2
        }
    }
    else if(!b_u && b_d && b_l && !b_r) {
        if(layer == 0) {
            if(/*!b_u_l && !b_u_r &&*/ !b_d_l /*&& !b_d_r*/) {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 6
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 3
            }
        } else {
            tilesetXY.x[block.index] = 3
            tilesetXY.y[block.index] = 0
        }
    }
    else if(!b_u && b_d && !b_l && b_r) {
        if(layer == 0) {
            if(/*!b_u_l && !b_u_r && !b_d_l &&*/ !b_d_r) {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 6
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 3
            }
        } else {
            tilesetXY.x[block.index] = 1
            tilesetXY.y[block.index] = 0
        }
    }
    else if(!b_u && b_d && b_l && b_r) {
        if(layer == 0) {
            if(!b_d_l && b_d_r) {
                tilesetXY.x[block.index] = 8
                tilesetXY.y[block.index] = 4
            }
            else if(b_d_l && !b_d_r) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 4
            }
            else if(/*!b_u_l && !b_u_r &&*/ !b_d_l && !b_d_r) {
                tilesetXY.x[block.index] = 8
                tilesetXY.y[block.index] = 3
            } else {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 3
            }
        } else {
            if(/*b_u_l && b_u_r &&*/ !b_d_l && !b_d_r) {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 0
            }
        }
    }
    else if(b_u && b_d && !b_l && !b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 3
        } else {
            tilesetXY.x[block.index] = 0
            tilesetXY.y[block.index] = 1
        }
    }
    else if(b_u && b_d && b_l && !b_r) {
        if(layer == 0) {
            if(!b_u_l && b_d_l) {
                tilesetXY.x[block.index] = 9
                tilesetXY.y[block.index] = 4
            }
            else if(b_u_l && !b_d_l) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 5
            }
            else if(!b_u_l /*&& b_u_r*/ && !b_d_l /*&& !b_d_r*/) {
                tilesetXY.x[block.index] = 8
                tilesetXY.y[block.index] = 2
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 4
            }
        } else {
            if(!b_u_l /*&& b_u_r*/ && !b_d_l /*&& !b_d_r*/) {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 1
            }
        }
    }
    else if(b_u && b_d && !b_l && b_r) {
        if(layer == 0) {
            if(!b_u_r && b_d_r) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 4
            }
            else if(b_u_r && !b_d_r) {
                tilesetXY.x[block.index] = 8
                tilesetXY.y[block.index] = 5
            }
            else if(/*b_u_l &&*/ !b_u_r /*&& b_d_l*/ && !b_d_r) {
                tilesetXY.x[block.index] = 9
                tilesetXY.y[block.index] = 3
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 4
            }
        } else {
            if(/*b_u_l &&*/ !b_u_r /*&& b_d_l*/ && !b_d_r) {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 1
            }
        }
    }
    else if(!b_u && !b_d && b_l && b_r) {
        if(layer == 0) {
            tilesetXY.x[block.index] = 1
            tilesetXY.y[block.index] = 6
        } else {
            tilesetXY.x[block.index] = 2
            tilesetXY.y[block.index] = 3
        }
    }
    else if(b_u && b_d && b_l && b_r) {
        if(b_u_l && b_u_r && b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 1
            }
        }
        else if(!b_u_l && b_u_r && b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 5
            } else {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 0
            }
        }
        else if(b_u_l && !b_u_r && b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 5
            } else {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 0
            }
        }
        else if(b_u_l && b_u_r && !b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 2
            }
        }
        else if(b_u_l && b_u_r && b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 4
            } else {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 2
            }
        }
        else if(!b_u_l && !b_u_r && b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 6
            } else {
                tilesetXY.x[block.index] = 0
                tilesetXY.y[block.index] = 5
            }
        }
        else if(b_u_l && b_u_r && !b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 4
            }
        }
        else if(!b_u_l && b_u_r && !b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 6
            } else {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 5
            }
        }
        else if(b_u_l && !b_u_r && b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 4
            }
        }
        else if(!b_u_l && !b_u_r && !b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 2
            } else {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 0
            }
        }
        else if(!b_u_l && !b_u_r && b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 2
            } else {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 0
            }
        }
        else if(!b_u_l && b_u_r && !b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 6
                tilesetXY.y[block.index] = 3
            } else {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 2
            }
        }
        else if(b_u_l && !b_u_r && !b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 7
                tilesetXY.y[block.index] = 3
            } else {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 2
            }
        }
        else if(!b_u_l && b_u_r && b_d_l && !b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 3
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 5
                tilesetXY.y[block.index] = 2
            }
        }
        else if(b_u_l && !b_u_r && !b_d_l && b_d_r) {
            if(layer == 0) {
                tilesetXY.x[block.index] = 2
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 4
                tilesetXY.y[block.index] = 2
            }
        } else {
            if(layer == 0) {
                tilesetXY.x[block.index] = 0
                tilesetXY.y[block.index] = 7
            } else {
                tilesetXY.x[block.index] = 1
                tilesetXY.y[block.index] = 4
            }
        }
    }
}

export default CheckPattern