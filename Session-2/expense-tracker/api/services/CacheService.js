module.exports = {
    async set(key,value,ttl){
        try {
            await sails.redis.set(key,value,{EX:ttl})
        } catch (error) {
            return error
        }
    },

    async get(key){
        try {
            const value = await sails.redis.get(key)
            return value
        } catch (error) {
            return error
        }
    },

    async delete(key){
        try {
            await sails.redis.del(key)
        } catch (error) {
            return error
        }
    }
}