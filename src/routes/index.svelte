<script>
import Button from "./button.svelte";

</script>
<div id="wrapper">
    <form action="/color" method="post">
        <input type="color" id="color" name="color" class="w-50 h-200">
        <label for="color">Pick a Color</label>
        <input type="submit" value="Submit Color" class="form-submit">
    </form>
    <a href="/projection">
        <Button buttonText="Go to Projection" destination="/projection"></Button>
    </a>
</div>

<style>
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
