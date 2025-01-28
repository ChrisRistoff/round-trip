import axios from 'axios';

interface TotalTime {
    totalTime: number,
    totalCalls: number,
}

async function measureRoundTripTime(url: string): Promise<number> {
    try {
        const startTime = performance.now();
        await axios.get(url);
        const endTime = performance.now();

        return endTime - startTime;
    } catch(error) {
        console.log(error);
        return -1;
    }
}

async function main(url: string, numberOfAttempts: number): Promise<TotalTime> {
    let totalTime: number = 0;
    let errors: number = 0;

    for (let i = 0; i < numberOfAttempts; i++) {
        const res = await measureRoundTripTime(url);

        if (res === -1) {
            errors += 1;
        } else {
            totalTime += res;
        }
    }

    return {
        totalTime: totalTime / (100 - errors),
        totalCalls: 100 - errors
    }
}

const url = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';

main(url, 100).then(res => console.log('average time is: ', res));
