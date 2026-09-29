require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1)

        if (error) {
            throw error
        }
        console.log('kết nối csdl thành công')

    } catch (error) {
        console.error('kết nối thất bại:', error.message)
    }
}

testConnection()


module.exports = supabase