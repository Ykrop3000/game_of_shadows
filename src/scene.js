/** @format */

import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  useGLTF,
  useHelper,
} from "@react-three/drei/native";
import { ObjectControls } from "./ObjectControls";
import * as THREE from "three";

const modelPath = "/models/jsliced.glb";

// useGLTF.preload(modelPath);

function Model(props) {
  const ref = useRef();
  const model = useGLTF(modelPath);
  const normalMaterial = new THREE.MeshNormalMaterial();
  model.scene.children.forEach((mesh, i) => {
    mesh.material = normalMaterial;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const cof = 0.1;

    // mesh.scale.set(
    //   mesh.scale.x + cof * mesh.scale.x,
    //   mesh.scale.y + cof * mesh.scale.y,
    //   mesh.scale.z + cof * mesh.scale.z
    // );
    console.log(mesh);
  });
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (ref.current) {
      const controls = new ObjectControls(
        camera,
        props.canvasRef.current,
        ref.current.children[0]
      );
      controls.disableZoom();
      controls.enableVerticalRotation();
      controls.setRotationSpeed(0.01);
      controls.setRotationSpeedTouchDevices(0.01);
    }
  }, [ref.current]);
  console.log(props.rotation);
  //useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  return (
    <group {...props} ref={ref} scale={0.01} castShadow receiveShadow>
      <primitive object={model.scene} castShadow receiveShadow />
    </group>
  );
}
function Wall(props) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <planeGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  );
}
function Lights() {
  const light = useRef();
  // useEffect(() => {
  //   if (!wallRef.current || light.current) {
  //     return;
  //   }
  //   light.current.lookAt(wallRef.current.position);
  // }, [light.current, wallRef.current]);
  useHelper(light, THREE.SpotLightHelper, "cyan");
  return (
    <spotLight ref={light} intensity={1} position={[0, -3, 8]} castShadow />
  );
}

function randomRotation() {
  return Math.random(Math.PI * 100) / 100;
}

function App() {
  const canvasRef = useRef();

  return (
    <Suspense fallback={null}>
      <Canvas
        ref={canvasRef}
        colorManagement
        concurrent
        shadowMap
        shadows
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ width: window.innerWidth, height: window.innerHeight }}>
        <ambientLight />
        <Lights />

        <Model
          position={[0, -2, 4]}
          rotation={[randomRotation, randomRotation, randomRotation]}
          canvasRef={canvasRef}
        />

        <Wall position={[0, 0, -8]} rotation={[0.45, 0, 0]} />
        <OrbitControls enableDamping={false} regress />
      </Canvas>
    </Suspense>
  );
}

export default App;
