import redis from 'redis';

let current = new Date();
let time = current.getSeconds();

let client = redis.createClient();
client.on('connect', () => {
    console.log('connected to Redis');
});
await client.connect();

export async function get() {
    let color = await client.LINDEX('color', 0);
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
            status: 400,
            body: message
        };
    } else {
        let color = await "" + data.get('color');
        await client.LPUSH('color', color);
        message = 'color added';
        return {
            status: 200,
            headers: {
                location: './'
            },
            body: message
        }
    }
}