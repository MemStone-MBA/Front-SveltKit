<script>
	import Nav from '../components/nav.svelte';
</script>
<link rel='stylesheet' href='static/css/style.css'>


<!--<Nav/>-->
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

    @font-face {
        font-family: "barlow-bold";
        src: url("../../static/font/Barlow-Bold.ttf")
    }

    @font-face {
        font-family: "barlow-medium";
        src: url("../../static/font/Barlow-Medium.ttf")
    }

    @font-face {
        font-family: "barlow-regular";
        src: url("../../static/font/Barlow-Regular.ttf")
    }

    @font-face {
        font-family: "barlow-light";
        src: url("../../static/font/Barlow-Light.ttf")
    }


    @font-face {
        font-family: "barlow-li";
        src: url("../../static/font/Barlow-LightItalic.ttf")
    }

    @font-face {
        font-family: "barlow-sb";
        src: url("../../static/font/Barlow-SemiBold.ttf")
    }


    @font-face {
        font-family: "barlow-sbi";
        src: url("../../static/font/Barlow-SemiBoldItalic.ttf")
    }

    @font-face {
        font-family: "barlow-thin";
        src: url("../../static/font/Barlow-Thin.ttf")
    }

    @font-face {
        font-family: "barlow-eb";
        src: url("../../static/font/Barlow-ExtraBold.ttf")
    }
</style>