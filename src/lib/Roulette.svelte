<script>
  import { Canvas, InteractiveObject, OrbitControls, T } from '@threlte/core';
  import { spring } from 'svelte/motion';
  import { degToRad } from 'three/src/math/MathUtils';

  const scale = spring(1);
</script>

<Canvas>
  <T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={25}>
    <OrbitControls
      maxPolarAngle={degToRad(80)}
      enableZoom={true}
      target={{ y: 0.5 }}
    />
  </T.PerspectiveCamera>

  <T.DirectionalLight castShadow position={[3, 10, 10]} />
  <T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
  <T.AmbientLight intensity={0.2} />

  <!-- Floor -->
  <T.Mesh receiveShadow rotation.x={degToRad(-90)}>
    <T.CircleGeometry args={[3, 20]} />
    <T.MeshStandardMaterial color="black" />
  </T.Mesh>
</Canvas>
