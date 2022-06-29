<div id="wrapper">
<form action="/color" method="post">
    <input type="color" id="color" name="color" value="#ff00ff">
    <input type="submit" value="Submit">
</form>
<a href="/projection"><button>Visit Projection</button></a>
</div>


<style>
    #wrapper {
        background-color: rgb(51, 60, 99);
        height: 90vh;
        width: 90vw;
        margin-left: auto;
        margin-right: auto;
        border: 0.5em rgb(104, 104, 211) solid;
        display: flex;
        flex-flow: column;
        justify-content: space-evenly;
        align-items: center;
    }

    input, button {
        font-size: 2em;
    }

</style>
