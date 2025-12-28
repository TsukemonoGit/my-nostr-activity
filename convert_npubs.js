const { nip19 } = require('nostr-tools');

const npub1 = 'npub1sjcvg64knxkrt6ev52rywzu9uzqakgy8ehhk8yezxmpewsthst6sw3jqcw';
const npub2 = 'npub12egp0pvh2f0fp6sk5nt6ncehqzkz8zsma8dl8agf8p3f98v6resqku4w26';

try {
    const pub1 = nip19.decode(npub1).data;
    const pub2 = nip19.decode(npub2).data;
    console.log(`PUB1: ${pub1}`);
    console.log(`PUB2: ${pub2}`);
} catch (e) {
    console.error(e);
}
