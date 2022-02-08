<script>
	import Nav from '../components/nav.svelte';
</script>
<link rel='stylesheet' href='static/css/style.css'>


<Nav/>
<!-- Slot représente le reste du code chragé par la page -->
<slot></slot>

<style>
		/* Import Tailwind */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @font-face {
    font-family: Hamston;
    src: url("../../static/font/Hamston.ttf");
    }
</style>