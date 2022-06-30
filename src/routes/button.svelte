<script>
    /**
    * @type {string}
    */
    export let buttonText;

    /**
    * @type {string}
    */
    export let destination;
</script>

<button href="{destination}">
    {buttonText}
</button>

<style>

    button {
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