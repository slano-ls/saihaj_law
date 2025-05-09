import TextMaterial from "@components/visual/shaders/home/textMaterial";

import { Text, useKTX2 } from "@react-three/drei";
import {
    Canvas,
    extend,
    type ShaderMaterialProps,
    useFrame,
    useThree,
} from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

extend({ TextMaterial });

interface Material extends ShaderMaterialProps {
    uTime?: number;
    uPointer?: THREE.Vector2;
    tNoise: THREE.Texture;
}

declare module "@react-three/fiber" {
    interface ThreeElements {
        textMaterial: Material;
    }
}
const HomePortrait = ({}) => {
    return (
        <Canvas
            orthographic
            camera={{
                zoom: 100,
            }}
        >
            <Heading />
        </Canvas>
    );
};

// font size: 16px
const FONT_SIZE = 16 / 100;

const Heading = () => {
    const material = useRef<THREE.ShaderMaterial & Material>(null!);

    const tNoise = useKTX2("/images/noise-simplex-layered.ktx2");
    tNoise.wrapS = THREE.RepeatWrapping;
    tNoise.wrapT = THREE.RepeatWrapping;

    const { size } = useThree();
    const aspect = size.width / size.height;

    useFrame(({ clock, pointer }) => {
        material.current.uTime = clock.elapsedTime;
        material.current.uPointer = pointer;
    });

    return (
        <Text
            color="black"
            font="/fonts/PPSupplyMono-Regular.woff"
            fontSize={FONT_SIZE}
            maxWidth={aspect * 0.48}
            glyphGeometryDetail={8}
            textAlign="justify"
            anchorX="center"
            anchorY="middle"
        >
            A (RESEARCHER) AND FOUNDER BASED IN TORONTO.
            <textMaterial
                ref={material}
                key={TextMaterial.key}
                tNoise={tNoise}
            />
        </Text>
    );
};

export default HomePortrait;
