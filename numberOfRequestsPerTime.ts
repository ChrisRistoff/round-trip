import axios from 'axios';
import plimit from 'p-limit';

type RequestLimit = {
    numberOfRequests: number,
    duration: number,
    concurrencyLimit: number,
}

async function getRateLimit(url: string, seconds: number, concurrencyLimit: number): Promise<RequestLimit> {
    const limit = plimit(concurrencyLimit);
    const startTime = performance.now();
    const duration = seconds * 1000;
    const requests = []

    let callCount = 0;

    const makeRequest = async () => {
        try {
            await axios.get(url);
            callCount++;
        } catch (error) {
            console.log('request failed', error);
        }
    }

    while (performance.now() - startTime < duration) {
        requests.push(limit(makeRequest))
    }

    await Promise.all(requests);

    return {
        numberOfRequests: callCount,
        duration,
        concurrencyLimit
    }
}

const url = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';

getRateLimit(url, 30, 1).then(res => console.log(res));
