<script>
	import Nav from '../components/nav.svelte';
</script>

<Nav/>
<!-- Slot représente le reste du code chragé par la page -->
<slot></slot>

<style>
		/* Import Tailwind */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>