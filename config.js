import { config } from 'dotenv'
config()
export default {
    
    port:process.env.PORT|| 8085,
    token:process.env.TOKEN_KEY,
    redis_port:process.env.redis_port,
    redis_ip:process.env.redis_ip,
}
