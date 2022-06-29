import redis from 'redis';

let client = redis.createClient();
client.on('connect', () => {
    console.log('connected to Redis');
});
client.on('error', (err) => {
    console.log('Redis Client Error', err)
});
await client.connect();

export async function get() {
    let color = await client.LPOP('color');
    if (color == null ) {
        color = '#FFFFFF';
    } else {
        await client.RPUSH('color', color);
    }
    return {
        body: color
    };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post( {request} ) {
    let data = await request.formData();
    let message = "error";
    if (await data.get('color') == null) {
        message = 'no color sent';
        return {
            status: 200,
            body: message
        };
    } else {
        let color = await "" + data.get('color');
        await client.RPUSH('color', color);
        message = 'color added';
        return {
            status: 302,
            headers: {
                location: './'
            },
            body: message
        }
    }
}