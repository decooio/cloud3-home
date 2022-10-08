import * as THREE from 'three'
import { ReactThreeFiber } from 'react-three-fiber'

declare global {
  // tslint:disable-next-line: no-namespace
  namespace JSX {
    // tslint:disable-next-line: interface-name
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
    }
  }
}