import { OrthographicCamera, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
extend({ Line_: THREE.Line });

type V3 = [x: number, y: number, z: number];
const LINE_WIDTH = 1;
const POINT_SIZE = 4;
const UNSPEED = 6;
function LinePointGroup() {
  const color = "#787980";
  const data_earth = useMemo(() => {
    const datas: [V3, V3][] = [];
    const v3 = new THREE.Vector3();
    for (let i = 0; i < 2000; i++) {
      v3.x = Math.random() * 2 - 1;
      v3.y = Math.random() * 2 - 1;
      v3.z = Math.random() * 2 - 1;
      v3.normalize();
      v3.multiplyScalar(26);
      const start: V3 = [v3.x, v3.y, v3.z];
      v3.multiplyScalar(Math.random() * 0.2 + 1);
      const end: V3 = [v3.x, v3.y, v3.z];
      datas.push([start, end]);
    }
    return datas;
  }, []);
  const data_fly = useMemo(() => {
    const datas: [V3, V3, V3[]][] = [];
    const v3 = new THREE.Vector3();
    for (let i = 0; i < 300; i++) {
      v3.x = i % 2 === 0 ? -1 : 1 ;
      v3.y = (Math.random() * 2 - 1) * 0.5;
      v3.z = (Math.random() * 2 - 1) * 0.3;
      v3.normalize();
      v3.multiplyScalar(26 + Math.random() * 4  - 2);
      const start: V3 = [v3.x, v3.y, v3.z];
      v3.multiplyScalar(Math.random() * 2 + 1.3);
      const end: V3 = [v3.x, v3.y, v3.z];
      const dx = Math.abs(start[0] - end[0]);
      const count = Math.round(1 + (5 * dx) / 27);
      // const count = Math.round(Math.random() + 2);
      const delta = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
      const [sx, sy, sz] = [
        delta[0] / (count + 1),
        delta[1] / (count + 1),
        delta[2] / (count + 1),
      ];
      const mid: V3[] = [];
      if( Math.random() > 0.5 ){
        for (let i = 1; i <= count; i++) {
          const min = 2
          const max = 5
          const sig = Math.ceil(Math.random() - 0.5)
          const dy = (Math.random() * (max - min) + min) * sig;
          const dz = 0;
          mid.push([
            start[0] + i * sx,
            start[1] + i * sy + dy,
            start[2] + i * sz + dz,
          ]);
        }
      }
      datas.push([start, end, mid]);
    }
    return datas;
  }, []);

  const group = useRef<THREE.Group>();
  const fly = useRef<THREE.Group>();
  const count = useRef<{ count: number }>({ count: 0 });
  const animStart = useRef<any>({});
  useFrame((state, delta, xrFrame) => {
    // console.info('delta:', delta, xrFrame)
    if (group.current) {
      const pi = Math.PI * 2;
      const nr = group.current.rotation.x + pi * delta * 0.01;
      group.current.rotation.x = nr > pi ? nr - pi : nr;
    }
    if (fly.current) {
      const isRun = count.current.count % UNSPEED === 0;
      for (const flyitem of fly.current.children) {
        if (flyitem.type === "Points") {
          const points = flyitem as THREE.Points;
          const attr = points.geometry.getAttribute(
            "position"
          ) as THREE.Float32BufferAttribute;
          for (let i = 0; i < Math.round(attr.array.length / 3); i++) {
            const buffer = fly_lines[i];
            const cache = animStart[i];
            if (cache) {
              const nCount = cache.count + (isRun ? 1 : 0);
              const nextCount = nCount > cache.max * 2 ? 1 : nCount;
              const nextIndex = nextCount <= cache.max? nextCount - 1: cache.max * 2 - nextCount - 1;
              attr.setXYZ(
                i,
                buffer.getX(nextIndex),
                buffer.getY(nextIndex),
                buffer.getZ(nextIndex)
              );
            } else {
               attr.setXYZ(i,  buffer.getX(0), buffer.getY(0), buffer.getZ(0));
            }
          }
          attr.needsUpdate = true;
        } else if (flyitem.type === "Line") {
          const line = flyitem as THREE.Line;
          const cache = animStart[line.name];
          if (cache) {
            const nCount = cache.count + (isRun ? 1 : 0);
            const nextCount = nCount > cache.max * 2 ? 1 : nCount;
            const nextRange = nextCount <= cache.max? nextCount: cache.max * 2 - nextCount;
            line.geometry.setDrawRange(0, nextRange);
            cache.count = nextCount;
          } else {
            line.geometry.setDrawRange(0, 0);
            if (Math.random() < 0.001) {
              const max = Math.round(
                line.geometry.getAttribute("position").array.length / 3
              );
              animStart[line.name] = { count: 1, max };
            }
          }
        }
      }
      count.current.count++;
      if (count.current.count > 100 * UNSPEED) {
        count.current.count = 0;
      }
    }
  }, -2);

  const disc = useTexture("disc.png");
  const position_earth = useMemo(
    () =>
      new THREE.Float32BufferAttribute(
        data_earth.flatMap((item) => item[1]),
        3
      ),
    [data_earth]
  );
  const position_earth_line = useMemo(
    () =>
      new THREE.Float32BufferAttribute(
        data_earth.flatMap((item) => item[0].concat(item[1])),
        3
      ),
    [data_earth]
  );

  const position_fly = useMemo(
    () =>
      new THREE.Float32BufferAttribute(
        data_fly.flatMap((item) => item[1]),
        3
      ),
    [data_fly]
  );
  const fly_lines = useMemo(() => {
    const buffers: THREE.Float32BufferAttribute[] = [];
    for (const [s, e, m] of data_fly) {
      const data = [s, ...m, e];
      const curve = new THREE.CatmullRomCurve3(
        data.map((xyz) => new THREE.Vector3(...xyz)),
        false,
        "chordal",
        0.5
      );
      const dx = Math.abs(s[0] - e[0]);
      const points_count = Math.round(20 + (160 * dx) / 27);
      const vertexs = curve
        .getPoints(points_count)
        .flatMap((v) => [v.x, v.y, v.z]);
      buffers.push(new THREE.Float32BufferAttribute(vertexs, 3));
    }
    return buffers;
  }, [data_fly]);

  return (
    <group position={[40, 0, 0]}>
      {/* {data.map(([start, end, mid], index) => (
        <LinePoint start={start} end={end} mid={mid} key={`line_p_${index}`} />
      ))} */}
      <group ref={group}>
        <points>
          <bufferGeometry attributes={{ position: position_earth }} />
          <pointsMaterial
            color={color}
            opacity={0.7}
            map={disc}
            size={POINT_SIZE}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            transparent={true}
          />
        </points>
        <lineSegments>
          <bufferGeometry attributes={{ position: position_earth_line }} />
          <lineBasicMaterial color={color} linewidth={LINE_WIDTH} />
        </lineSegments>
      </group>
      <group ref={fly}>
        <points>
          <bufferGeometry attributes={{ position: position_fly }} />
          <pointsMaterial
            color={'#cdcccc'}
            opacity={0.7}
            map={disc}
            size={POINT_SIZE}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            transparent={true}
          />
        </points>
        {fly_lines.map((position, index) => (
          <line_ key={`line_${index}`} name={index}>
            <bufferGeometry attributes={{ position }} />
            <lineBasicMaterial color={color} linewidth={LINE_WIDTH} />
          </line_>
        ))}
      </group>
    </group>
  );
}

function HomeBg_() {
  return (
    <Canvas gl={{ antialias: true }}>
      <OrthographicCamera
        makeDefault
        zoom={9}
        args={[-150, 50, 30, -30, 50, -100]}
      />
      <ambientLight color="#eaeaea" intensity={1} />
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <LinePointGroup />
    </Canvas>
  );
}

export const HomeBg = React.memo(HomeBg_);
export default HomeBg;
