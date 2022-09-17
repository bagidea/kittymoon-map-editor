import {
    InstancedMesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Shader,
    Texture
} from "three"

const CreateInstancedMesh = (tex: Texture, last_y: number = 5): InstancedMesh => {
    const floorGeometry: PlaneGeometry = new PlaneGeometry(50, 50, 1, 1)

    const floorMaterial: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true
    })

    floorMaterial.onBeforeCompile = (shader: Shader) => {
        shader.uniforms.texAtlas = { value: tex }
        shader.uniforms.l_y = { value: last_y }

        shader.vertexShader = `
            attribute float t_x;
            attribute float t_y;
            attribute float b_x;
            attribute float b_y;

            varying float vT_x;
            varying float vT_y;
            varying float vB_x;
            varying float vB_y;

            ${shader.vertexShader}
        `.replace(
            `void main() {`,
            `void main() {
                vT_x = t_x;
                vT_y = t_y;
                vB_x = b_x;
                vB_y = b_y;
            `
        ),

        shader.fragmentShader = `
            uniform sampler2D texAtlas;
            uniform float l_y;

            varying float vT_x;
            varying float vT_y;
            varying float vB_x;
            varying float vB_y;

            ${shader.fragmentShader}
        `.replaceAll(
            `#include <map_fragment>`,
            `#include <map_fragment>

                vec2 blockUv = vec2(
                    vB_x * (vUv.x + vT_x),
                    vB_y * (vUv.y + (l_y - vT_y))
                ); 

                vec4 blockColor = texture(texAtlas, blockUv);
                diffuseColor *= blockColor;
            `
        )
    }
    
    floorMaterial.defines = { "USE_UV": "" }

    return new InstancedMesh(floorGeometry, floorMaterial, 10000)
}

export default CreateInstancedMesh