import redis from 'redis';

let client = redis.createClient();
client.on('connect', () => {
    console.log('connected to Redis');
});
client.on('error', (err) => {
    console.log('Redis Client Error', err)
});
await client.connect();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post( {params} ) {

    console.log("" + params.pass);

    /* if(await params.get('pass') == '123') {

        

        let code = await params.get('code');
        switch(code) {
            case "flush":
                client.flushAll();
                break;
            case default:
                break;
        } 
    } */

    return {
        body : 'hello'
    }
}