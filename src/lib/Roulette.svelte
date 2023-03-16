<script>
	import { DirectionalLight, Mesh, OrbitControls, PerspectiveCamera } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { derived } from 'svelte/store';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { BoxGeometry, MeshStandardMaterial } from 'three';
	import { Canvas } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	const { gltf } = useGltf('/src/assets/3dmodels/roulette.glb');
	const helmet = derived(gltf, (gltf) => {
		if (!gltf || !gltf.nodes['Mesh_Mesh_head_geo001_lambert2SG001']) return;
		return gltf.nodes['Mesh_Mesh_head_geo001_lambert2SG001'];
	});
</script>

<Canvas size={{ height: 300, width: 300 }}>
	<World>
		<PerspectiveCamera position={{ y: 50, x: 50 }} fov={40}>
			<OrbitControls target={{ x: 2.5 }} />
		</PerspectiveCamera>

		<DirectionalLight shadow position={{ y: 20, x: 8, z: -3 }} />

		{#if $gltf}
			{$gltf.nodes['Mesh_Mesh_head_geo001_lambert2SG001']}
		{/if}

		{#if $helmet}
			if helmet
			{$helmet.material}
		{/if}

		{#if $helmet}
			<RigidBody
				position={{ x: -30, y: 0, z: -25 }}
				rotation={{
					x: 270 * DEG2RAD
				}}
			>
				<Mesh castShadow geometry={$helmet.geometry} material={$helmet.material} />
			</RigidBody>
		{/if}

		<!-- <Object3DInstance object={new GridHelper(50)} /> -->

		<AutoColliders shape={'cuboid'} position={{ y: 0 }}>
			<Mesh
				receiveShadow
				geometry={new BoxGeometry(50, 1, 50)}
				material={new MeshStandardMaterial()}
			/>
		</AutoColliders>

		<HTML slot="fallback" transform>
			<p class="text-xs">
				It seems your browser<br />
				doesn't support WASM.<br />
				I'm sorry.
			</p>
		</HTML>
	</World>
</Canvas>
