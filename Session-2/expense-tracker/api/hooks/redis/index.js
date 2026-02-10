const {createClient} = require('ioredis');

module.exports = function defineRedisHook(sails){
    return{
        async initialize(done){
            try {
                const client = createClient({
                    url:process.env.REDIS_URL || 'redis://localhost:6379'
                })

                client.on('error',function(err){
                    sails.log.error('Redis connection error',err)
                })

                client.on('connect',function(err){
                    sails.log.info('Redis connection success')
                })

                sails.redis = client
                sails.log.info('Redis connection success')
                done()
            } catch (error) {
                sails.log.error('Redis connection error',error)
                done(error)
            }
        }   
    }
}