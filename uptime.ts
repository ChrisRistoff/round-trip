import axios from 'axios';

type UrlLadder = {
    url: string,
    successRate: number,
}

async function measureUptime(url: string): Promise<number> {
    const response = await axios.get(url);

    if (response.status === 200) {
        return 1;
    } else {
        return -1;
    }
}

async function main(urls: string[], numberOfAttempts: number): Promise<UrlLadder[]> {
    const urlLadder: UrlLadder[] = [];

    for (let i = 0; i < urls.length; i++) {
        let succesfullAttempts = 0;

        for (let j = 0; j < numberOfAttempts; j++) {
            succesfullAttempts += await measureUptime(urls[i]);
        }

        urlLadder.push({
            url: urls[i],
            successRate: succesfullAttempts,
        })
    }

    return urlLadder.sort((a, b) => a.successRate - b.successRate);
}

const url = 'https://api.kraken.com/0/public/Ticker\\?pair\\=XXBTZUSD';

main([url], 100).then(res => console.log('uptime % : ', res));
