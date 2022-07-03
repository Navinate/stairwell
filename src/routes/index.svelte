<script>
import Button from "./button.svelte";

</script>
<div id="wrapper">
    <form action="/color" method="post">
        <label for="color" class="m-auto">Select a Color</label>
        <input type="color" id="color" name="color" class="m-auto my-5">
        <input type="submit" value="Submit Color" class="form-submit">
    </form>
    <Button buttonText="Go to Projection" destination="/projection"></Button>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Gantari:wght@300;400;700');

    #wrapper {
        width: 100vw;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-flow: column wrap;
        padding-top: 20vh;
    }

    form {
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-content: center;
        font-family: 'Gantari', cursive;
        font-size: 2em;
    }

    #color {
        @apply
        w-20
        h-20
    }

    .form-submit {
        @apply
        border 
        border-indigo-500 
        bg-indigo-500 
        text-white 
        rounded-md 
        p-2 
        m-2 
        transition 
        duration-500 
        ease-in-out 
        select-none 
        hover:bg-indigo-600 
        focus:outline-none 
    }
</style>
