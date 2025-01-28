import axios from 'axios';

async function measureUptime(url: string): Promise<number> {
    const response = await axios.get(url);

    if (response.status === 200) {
        return 1;
    } else {
        return -1;
    }
}

async function main(url: string, numberOfAttempts: number): Promise<number> {
    let succesfullAttempts = 0;

    for (let i = 0; i < numberOfAttempts; i++) {
        succesfullAttempts += await measureUptime(url);
    }

    return succesfullAttempts;
}

const url = 'https://api.kraken.com/0/public/Ticker\\?pair\\=XXBTZUSD';

main(url, 100).then(res => console.log('uptime % : ', res));
