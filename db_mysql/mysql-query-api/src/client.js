




        
    // //Fire 120 requests without lockin and measure time
    const start = Date.now();
    const res=[]

    //lock = 0 - Without lock
    //lock = 1 - With lock
    //lock = 2 - With lock efficiency
    // for (let i = 0; i < 120; i++) {
    //     const url = new URL(`http://localhost:3000/api/checkin`);
    //     url.searchParams.append('userId', i + 1);
    //     url.searchParams.append('lock', 2);
    //     res.push(fetch(url, {
    //         method: 'POST',
    //     }))
    // }

    // Promise.all(res).then((data) => {
    //     //console.log(data);
    //     const end = Date.now();
    //     console.log(`Time taken: ${end - start}ms`);
    // });

//Average time taken without locks - ~400ms - Not all users get assigned with seats
//Average time taken with locks - ~800ms - All users get assigned with seats
//Average time taken with locks and efficiency - ~450ms - All users get assigned with seats


//Cache locking
let lock = 1
    for (let i = 0; i < 100; i++) {
        const url = new URL(`http://localhost:3000/api/get_blogs`);
        url.searchParams.append('id', 1);
        url.searchParams.append('lock', lock);
        res.push(fetch(url, {
            method: 'GET',
        }))
    }
    let cacheHits=0
    let cacheMiss=0

    Promise.all(res).then(async (data) => {
        for(let i=0;i<data.length;i++) {
            const res = await data[i].json();
            if (res.message === 1) {
                cacheHits++;
            } else {
                cacheMiss++;
            }
        }
        const end = Date.now();
        console.log(`Cache ${lock === 0 ? 'without' : 'with'} lock `);
        console.log(`Cache hits: ${cacheHits}`);
        console.log(`Cache misses: ${cacheMiss}`);
    });