import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    CuboidCollider,
    RigidBody,
    Physics,
    BallCollider,
} from "@react-three/rapier";

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

                    But for the purpose of the lesson, even though the hull is good for most cases, we want
                    a precise torus geometry so that the ball can fall inside of it, that's why we use a trimesh
                
                    DISCLAIMER: It's still not good to use trimesh with dynamic rigid bodies, because this can lead to bugs, especially with FAST objects, so static objects should be okay
                */}
                <RigidBody
                    colliders={false}
                    position={[0, 1, 0]}
                    rotation={[Math.PI * 0.5, 0, 0]}
                >
                    <BallCollider args={[1.5]} />
                    <mesh castShadow>
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
