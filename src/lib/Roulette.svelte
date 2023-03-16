<script lang="ts">
  import { Object3DInstance, Mesh } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import { MeshBasicMaterial } from 'three'

  const { gltf } = useGltf('https://thinkuldeep.com/modelviewer/Astronaut.glb')
</script>


{#if $gltf}
  if gltf
{/if}

{#if !$gltf}
    {$gltf}
 no gltf
{/if}

<!-- Use an object node entirely -->
{#if $gltf}
  <Object3DInstance object={$gltf.nodes['node-name']} />
{/if}


<!-- or only the geometry -->
<!-- {#if $gltf}
  <Mesh geometry={$gltf.nodes['node-name'].geometry} material={new MeshBasicMaterial()} />
{/if} -->