const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = 'https://sbihnoprvggxkwbbrdcj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (req, res) => {
    if (req.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { username, password } = JSON.parse(req.body);

    try {
        // Hash and salt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password: hashedPassword }]);

        if (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'User created successfully' }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};