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
                    <mesh castShadow position={[-2, 2, 0]}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody>
                    <mesh castShadow position={[2, 2, 0]}>
                        <boxGeometry args={[3, 2, 1]} />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <mesh castShadow position={[2, 2, 3]}>
                        <boxGeometry args={[1, 1, 1]} />
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
