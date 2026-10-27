const supabase = require('../config/db')

const statisticModel = {

    totalUser: async()=>{
        const { count, error } = await supabase
            .from('users')
            .select('*', {count: "exact", head: true})
        
        // console.log(count)
        return {data: count, error}
    },

}

module.exports = statisticModel
