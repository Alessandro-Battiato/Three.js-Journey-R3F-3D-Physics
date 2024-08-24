import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    CuboidCollider,
    RigidBody,
    Physics,
    BallCollider,
} from "@react-three/rapier";

export default function Experience() {
    const cubeRef = useRef(null);

    const cubeJump = () => {
        /*
            addForce is used to apply a force that lasts for quite a long time (like the wind), 
            while applyImpulse is used to apply a short force for a very short period of time (like for a projectile).
        
            The keyword for a rotation is torque and, if you check the RigidBody documentation, you’ll find both a addTorque (equivalent of addForce) and 
            a applyTorqueImpulse (equivalent of applyImpulse
        */
        cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 }); // it needs a Vec3 but we can also provide an obj without creating a new VEC3 using three.js
        cubeRef.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 });
    };

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug>
                {/*Physics aren't enabled by default using the Physics tag, you need to use the RigidBody and items will fall*/}
                <RigidBody colliders="ball">
                    <mesh castShadow position={[-1.5, 2, 0]}>
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

                */}

                <RigidBody ref={cubeRef} position={[1.5, 2, 0]}>
                    <mesh onClick={cubeJump} castShadow>
                        <boxGeometry />
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
