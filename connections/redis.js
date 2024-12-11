import Redis  from 'redis'
import config from '../config.js';
export const InitClientRedisOther = ()=>{
    const clt =Redis.createClient({
   

       
        socket:{
            host:config.redis_ip,        
            port:config.redis_port
        },
        legacyMode: true
    })
    return clt;
    // return Client;
}
