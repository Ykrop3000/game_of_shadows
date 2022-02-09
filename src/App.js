/** @format */

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

import { models } from "./models";
import Modal from "./modal";

const modelPath = "/models/Psliced.glb";

// useGLTF.preload(modelPath);

function Model(props) {
  const nextLevel = props.nextLevel;
  const model = useGLTF(props.modelConfig.path);

  useEffect(() => {
    console.log(model.scene);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Маиериаол с цветом
    model.scene.children.forEach((mesh, i) => {
      // Устанавливаем текстуры и тени
      mesh.material = material;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const cof = -0.0015; //-0.0008;
      // Изменяем перспективу
      mesh.scale.set(
        mesh.scale.x + cof * mesh.position.z,
        mesh.scale.y + cof * mesh.position.z,
        mesh.scale.z + cof * mesh.position.z
      );
    });
    console.log("Perspective changed");
    console.log(props.modelConfig.path);
  }, [model]);

  const modelConfig = props.modelConfig;

  const ref = useRef();

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotatY] = useState(0);
  const [rotation, setRotation] = useState(props.rotation);

  const camera = useThree((state) => state.camera);

  // Проверяем угол
  const err = modelConfig.win.err;
  useEffect(() => {
    console.log(rotateX, rotateY);
    if (
      rotateX >= modelConfig.win.x - err &&
      rotateX <= modelConfig.win.x + err &&
      rotateY >= modelConfig.win.y - err &&
      rotateY <= modelConfig.win.y + err
    ) {
      console.log("win");
      nextLevel();
    }
  }, [rotateX, rotateY]);
  //
  useEffect(() => {
    // Запускаем управление обектом
    if (ref.current) {
      const controls = new ObjectControls(
        camera,
        props.canvasRef.current,
        ref.current.children[0],
        setRotateX,
        setRotatY
      );
      controls.disableZoom();
      controls.enableVerticalRotation();
      controls.setRotationSpeed(0.01);
      controls.setRotationSpeedTouchDevices(0.01);
    }
    setRotation([0, 0, 0]);
  }, [ref.current, props.modelConfig]);

  return (
    <group
      position={props.position}
      rotation={rotation}
      ref={ref}
      scale={modelConfig.scale}
      castShadow
      receiveShadow>
      <primitive object={model.scene} castShadow receiveShadow />
    </group>
  );
}
function Wall(props) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <planeGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color={0x3b375} />
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
  // useHelper(light, THREE.SpotLightHelper, "cyan");
  return (
    <spotLight
      ref={light}
      intensity={1}
      position={[0, -6, 10]}
      angle={0.5}
      penumbra={1}
      castShadow
    />
  );
}

function randomRotation() {
  return Math.floor(Math.random() * 100 * Math.PI) / 100;
}

function App() {
  const canvasRef = useRef();
  const [modelNum, setModelNum] = useState(0);
  const [showNext, setShowNext] = useState(false);

  const win = () => {
    setShowNext(true);
  };
  const next = () => {
    if (modelNum + 1 < models.length) {
      setModelNum(modelNum + 1);
      setShowNext(false);
    }
  };

  return (
    <>
      {showNext && (
        <Modal text={"Победа"}>
          {modelNum + 1 < models.length && (
            <button onClick={next}>Далее</button>
          )}
        </Modal>
      )}
      <Suspense fallback={<Modal text={"Загрузка..."} />}>
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
            modelConfig={models[modelNum]}
            nextLevel={win}
            rotation={[0, 0, 0]}
            position={[0, -3, 4]}
            canvasRef={canvasRef}
          />

          <Wall position={[0, 0, -8]} rotation={[0.4, 0, 0]} />
          {/* <OrbitControls enableDamping={false} regress /> */}
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
