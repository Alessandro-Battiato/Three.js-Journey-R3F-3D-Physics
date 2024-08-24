import { useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
    CuboidCollider,
    RigidBody,
    Physics,
    BallCollider,
    CylinderCollider,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Experience() {
    const [hitSound] = useState(() => new Audio("./hit.mp3"));

    const cubeRef = useRef(null);
    const twisterRef = useRef(null);

    const hamburger = useGLTF("./hamburger.glb");

    const cubeJump = () => {
        /*
            addForce is used to apply a force that lasts for quite a long time (like the wind), 
            while applyImpulse is used to apply a short force for a very short period of time (like for a projectile).
        
            The keyword for a rotation is torque and, if you check the RigidBody documentation, you’ll find both a addTorque (equivalent of addForce) and 
            a applyTorqueImpulse (equivalent of applyImpulse
        */
        const mass = cubeRef.current.mass(); // the higher y's value the stronger will be the jump
        cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }); // it needs a Vec3 but we can also provide an obj without creating a new VEC3 using three.js
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5,
        });
    };

    useFrame((state) => {
        // setNextKinematicRotation wants a Quaternion and not a Euler which makes things harder, so we just use a Euler and turn it into a Quaternion
        const time = state.clock.getElapsedTime();

        const eulerRotation = new THREE.Euler(0, time * 3, 0); // original solution using only the EULER, multiply by 3 to make it faster
        const quaternionRotation = new THREE.Quaternion();
        quaternionRotation.setFromEuler(eulerRotation); // This is friendly for the value needed by the setNextKinematicRotation
        twisterRef.current.setNextKinematicRotation(quaternionRotation);

        // Trigonometry, to make it move in a circle
        const angle = time * 0.5;
        const x = Math.cos(angle) * 2;
        const z = Math.sin(angle) * 2;
        twisterRef.current.setNextKinematicTranslation({ x, y: -0.8, z }); // the y is set to -0.8 because we set the same value for the position of the RigidBody hosting the twister
    });

    /* 
        We can listen to events by adding attributes directly on the <RigidBody>.

        There are 4 different events:

        onCollisionEnter: when the RigidBody hit something.
        onCollisionExit: when the RigidBody separates from the object it just hit.
        onSleep: when the RigidBody starts sleeping.
        onWake: when the RigidBody stops sleeping.

    */
    const collisionEnter = () => {
        hitSound.currentTime = 0;
        hitSound.volume = Math.random();
        hitSound.play();
    };

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            {/*The gravity is set to a default of -9.81 on the y axis to simulate the Earth's*/}
            <Physics debug gravity={[0, -9.81, 0]}>
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

                <RigidBody
                    ref={cubeRef}
                    position={[1.5, 2, 0]} // DO NOT change position nor rotation at RUNTIME, these are used for initial positions, so they need to be the same after build time, if you really need to do something like this, you need to use the kinematic methods
                    gravityScale={1} // this changes how this single object reacts to the gravity
                    restitution={0} // controls the "bounciness"
                    friction={0.7} // a friction of 0 (the default value is 0.7) would make the cube slide forever but ONLY, again, if the floor has a friction of 0
                    // The mass cannot be set directly as a prop of the rigid body, because it's obtained as a sum of all of the colliders that make up the object, so we are going to use a custom collider
                    colliders={false} // (Bigger objects = bigger mass) We find ourselves in a "void" context, not in real life, where a feather would fall slower than steel, so higher mass doesn't mean higher falling speed
                    onCollisionEnter={collisionEnter}
                    // onCollisionExit={() => console.log("exit")}
                    // onSleep={() => console.log("sleeping")} // when an item doesn't move after a certain period of time, Rapier stops testing it against collisions for performance reasons
                    // onWake={() => console.log("wake up")}
                >
                    <mesh onClick={cubeJump} castShadow>
                        <boxGeometry />
                        <meshStandardMaterial color="mediumpurple" />
                    </mesh>
                    <CuboidCollider
                        args={[0.5, 0.5, 0.5]}
                        mass={2} // this WON'T make the cube fall FASTER, but if you click on it to make it jump, the lower the value is the HIGHER the cube will jump
                    />
                </RigidBody>

                {/*The floor has a default restituion of 0 which can cause unexpected bounciness of the items that boucne on it, so you modify it to 1*/}
                <RigidBody type="fixed">
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    /*
                        But what if we really want to have an object that we can move and rotate? It can be the player or it can be a carousel and we don’t want to use unpredictable forces. We want them to move and rotate at an exact speed.

                        And that’s exactly the purpose of the kinematicPosition and kinematicVelocity types.

                        The difference between the kinematicPosition and the kinematicVelocity is how we update them.

                        For the kinematicPosition, we provide the next position and it’ll update the object velocity accordingly.

                        For the kinematicVelocity, we provide the velocity directly.
                    */
                    ref={twisterRef}
                    position={[0, -0.8, 0]}
                    friction={0}
                    type="kinematicPosition"
                >
                    <mesh castShadow scale={[0.4, 0.4, 3]}>
                        <boxGeometry />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>

                <RigidBody colliders={false} position={[0, 4, 0]}>
                    <primitive scale={0.3} object={hamburger.scene} />
                    <CylinderCollider args={[0.8, 1.4]} />
                </RigidBody>

                <RigidBody type="fixed">
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider
                        args={[5, 2, 0.5]}
                        position={[0, 1, -5.5]}
                    />
                    <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[-5.5, 1, 0]}
                    />
                </RigidBody>
            </Physics>
        </>
    );
}
