export default function(count, max) {
    let randoms = [];
    while(randoms.length !== count) {
        let rand = Math.floor(Math.random() * max);
        if (randoms.indexOf(rand) === -1) {
            randoms.push(rand);
        }
    }
    return randoms;
}
