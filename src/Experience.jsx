import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { RigidBody, Physics } from "@react-three/rapier";

export default function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug>
                {/*Physics aren't enabled by default using the Physics tag, you need to use the RigidBody and items will fall*/}
                <RigidBody colliders="ball">
                    <mesh castShadow position={[0, 4, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                {/*
                    The hull is like a plastic membrane to the object, so that the collider can fit the object precisely
                    because we only have the colliders ball and cuboid and both are bad for something like a torus
                    so the hull is perfect to give correct physics to the Torus geometry
                */}
                <RigidBody colliders="hull">
                    <mesh
                        castShadow
                        position={[0, 1, 0]}
                        rotation={[Math.PI * 0.1, 0, 0]}
                    >
                        <torusGeometry args={[1, 0.5, 16, 32]} />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                </RigidBody>

                <RigidBody type="fixed">
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>
            </Physics>
        </>
    );
}
