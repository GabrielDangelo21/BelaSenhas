
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/passwords';

async function testAPI() {
    console.log('🚀 Starting API Verification...');

    try {
        // 1. Clear current passwords (manual file clear first if needed, but here we just test flow)

        // 2. Add a password
        const postRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'API Test Service', password: 'api-pass-123' })
        });
        const newEntry = await postRes.json();
        console.log('✅ POST Success:', newEntry.name);

        // 3. Get all passwords
        const getRes = await fetch(BASE_URL);
        const passwords = await getRes.json();
        const found = passwords.find(p => p.id === newEntry.id);

        if (found && found.password === 'api-pass-123') {
            console.log('✅ GET Success: Password decrypted correctly in response');
        } else {
            console.error('❌ GET Failure: Password mismatch or entry not found');
            process.exit(1);
        }

        // 4. Delete the password
        const delRes = await fetch(BASE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newEntry.id })
        });
        const delResult = await delRes.json();
        if (delResult.success) {
            console.log('✅ DELETE Success');
        } else {
            console.error('❌ DELETE Failure');
            process.exit(1);
        }

        console.log('🏁 API Verification Completed Successfully!');
    } catch (err) {
        console.error('❌ API Verification Failed with error:', err.message);
        process.exit(1);
    }
}

testAPI();
