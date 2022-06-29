<div id="wrapper">
<form action="/color" method="post">
    <!--<input type="radio" id="red-radio" name="color" value="ff0000">
    <label for="red-radio">Red</label><br>

    <input type="radio" id="green-radio" name="color" value="00ff00">
    <label for="green-radio">Green</label><br>

    <input type="radio" id="blue-radio" name="color" value="0000ff">
    <label for="blue-radio">Blue</label><br> !-->
    <input type="color" id="color" name="color" value="#ff0000">
    <input type="submit" value="Submit">
</form>
<hr>
<a href="/projection"><button>Visit Projection</button></a>
</div>
<style>
    #wrapper {
        background-color: thistle;
        height: 90vh;
        width: 90vw;
        margin-left: auto;
        margin-right: auto;
        border: 0.5em darkblue solid;
        border-radius: 25%;
        display: flex;
        flex-flow: column;
        justify-content: space-evenly;
        align-items: center;
    }

    input, button, label{
        font-size: 2em;
    }

</style>
