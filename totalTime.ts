import axios from 'axios';

type TotalTime = {
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

async function main(urls: string[], numberOfAttempts: number): Promise<TotalTime[]> {
    const urlsLadderArray: TotalTime[] = []

    for (let i = 0; i < urls.length; i++) {
        let totalTime: number = 0;
        let errors: number = 0;

        for (let j = 0; j < numberOfAttempts; j++) {
            const res = await measureRoundTripTime(urls[i]);

            if (res === -1) {
                errors += 1;
            } else {
                totalTime += res;
            }
        }

        urlsLadderArray.push({
            totalTime,
            totalCalls: numberOfAttempts - errors,
        })
    }

    return urlsLadderArray.sort((a, b) => a.totalTime - b.totalTime);
}

const url = 'https://api.coinbase.com/v2/prices/BTC-USD/spot';

main([url], 100).then(res => console.log('average time is: ', res));
