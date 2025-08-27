const fs = require('fs');
const https = require('https');

const url = 'https://api.cloudflare.com/client/v4/ips';

https.get(url, (res) => {
    let data = '';

    // Collect data
    res.on('data', (chunk) => {
        data += chunk;
    });

    // On end, write to a JSON file
    res.on('end', () => {
        const ipRanges = JSON.parse(data);
        const ipArray = {
            ipv4: ipRanges.result.ipv4_cidrs,
            ipv6: ipRanges.result.ipv6_cidrs,
        };

        // Write the IP ranges to a JSON file
        fs.writeFileSync('cloudflareIPs.json', JSON.stringify(ipArray.ipv4.concat(ipArray.ipv6), null, 2));
        console.log('IP ranges saved to cloudflareIPs.json');
    });
}).on('error', (err) => {
    console.error('Error fetching data:', err);
});

