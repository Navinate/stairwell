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
export async function post( {request} ) {
    //get data from post request
    let data = await request.formData();
    //check if password is entered
    let pass = await data.get('pass');
    if (pass === 'trey') {
        let code = await data.get('code') ?? '';
        switch ( code) {
            case 'flush':
                await client.flushAll();
                return {
                    body: 'list flushed'
                };
                break;
            case 'listall':
                let colors = await client.LRANGE('color', 0 ,-1);
                return {
                    body: colors
                };
                break;
            default:
                return {
                    body: 'code not recognized'
                };
                break;
        }
    } else {
        return {
            status: 400,
            body: 'wrong password'
        }
    }
}