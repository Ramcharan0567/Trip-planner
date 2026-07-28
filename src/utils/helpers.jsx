import { useEffect, useState } from 'react';

const FEATURE_PHOTO_POOLS = {
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
  ],
  station: [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3',
    'https://images.unsplash.com/photo-1515165562839-978bbcf18277'
  ],
  footpath: [
    'https://images.unsplash.com/photo-1551632811-561732d1e306',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
  ],
  lake: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9'
  ],
  market: [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9'
  ],
  temple: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9',
    'https://images.unsplash.com/photo-1609946851508-019a2729a67a',
    'https://images.unsplash.com/photo-1548625361-18da90e930f3'
  ],
  food: [
    'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206'
  ],
  houseboat: [
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2'
  ],
  tea: [
    'https://images.unsplash.com/photo-1586041829158-b807759b407b'
  ],
  heritage: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04'
  ],
  nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
  ],
  city: [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'
  ]
};

export const RELIABLE_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80';

export function getAccuratePlacePhoto(name = '', category = '', destination = '', width = 800, height = 600) {
  const stopText = `${name} ${category}`.toLowerCase();
  const fullText = `${name} ${category} ${destination}`.toLowerCase();

  let poolKey = 'city';

  if (stopText.includes('hotel') || stopText.includes('check-in') || stopText.includes('resort') || stopText.includes('lodge') || stopText.includes('stay')) {
    poolKey = 'hotel';
  } else if (stopText.includes('station') || stopText.includes('railway') || stopText.includes('airport') || stopText.includes('transfer') || stopText.includes('train') || stopText.includes('flight')) {
    poolKey = 'station';
  } else if (stopText.includes('footpath') || stopText.includes('walk') || stopText.includes('trek') || stopText.includes('hike') || stopText.includes('trail')) {
    poolKey = 'footpath';
  } else if (stopText.includes('lake') || stopText.includes('pushkarini') || stopText.includes('pond') || stopText.includes('river') || stopText.includes('waterfall') || stopText.includes('falls')) {
    poolKey = 'lake';
  } else if (stopText.includes('market') || stopText.includes('shopping') || stopText.includes('bazaar') || stopText.includes('store')) {
    poolKey = 'market';
  } else if (stopText.includes('temple') || stopText.includes('iskcon') || stopText.includes('shrine') || stopText.includes('mandir') || stopText.includes('church') || stopText.includes('cathedral')) {
    poolKey = 'temple';
  } else if (stopText.includes('food') || stopText.includes('dining') || stopText.includes('lunch') || stopText.includes('dinner') || stopText.includes('restaurant') || stopText.includes('cafe')) {
    poolKey = 'food';
  } else if (stopText.includes('beach') || stopText.includes('coast') || stopText.includes('sea') || stopText.includes('ocean')) {
    poolKey = 'beach';
  } else if (stopText.includes('houseboat') || stopText.includes('backwater') || stopText.includes('cruise')) {
    poolKey = 'houseboat';
  } else if (stopText.includes('tea') || stopText.includes('plantation')) {
    poolKey = 'tea';
  } else if (stopText.includes('fort') || stopText.includes('palace') || stopText.includes('museum') || stopText.includes('monument') || stopText.includes('heritage')) {
    poolKey = 'heritage';
  } else if (stopText.includes('mountain') || stopText.includes('snow') || stopText.includes('park') || stopText.includes('garden') || stopText.includes('nature')) {
    poolKey = 'nature';
  } else {
    if (fullText.includes('tamil nadu') || fullText.includes('chennai') || fullText.includes('madurai') || fullText.includes('temple')) poolKey = 'temple';
    else if (fullText.includes('kerala') || fullText.includes('alleppey')) poolKey = 'houseboat';
    else if (fullText.includes('paris') || fullText.includes('france')) poolKey = 'heritage';
    else if (fullText.includes('iceland') || fullText.includes('swiss')) poolKey = 'nature';
  }

  const pool = FEATURE_PHOTO_POOLS[poolKey] || FEATURE_PHOTO_POOLS.city;

  let hash = 0;
  for (let i = 0; i < fullText.length; i++) {
    hash = (hash << 5) - hash + fullText.charCodeAt(i);
    hash |= 0;
  }
  const variantIndex = Math.abs(hash) % pool.length;

  return `${pool[variantIndex]}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function PlaceImage({ stop, destination, className, width = 800, height = 600 }) {
  const [photoUrl, setPhotoUrl] = useState(() => stop?.image || null);

  useEffect(() => {
    if (stop?.image) {
      setPhotoUrl(stop.image);
      return;
    }

    let isMounted = true;
    const query = `${stop?.name || ''} ${destination || ''}`.trim();

    if (!query) return;

    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      query
    )}&gsrlimit=1&prop=pageimages&pithumbsize=1000&format=json&origin=*`;

    fetch(wikiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const pages = data?.query?.pages;
        if (pages) {
          const firstPage = Object.values(pages)[0];
          const src = firstPage?.thumbnail?.source;
          if (src) {
            setPhotoUrl(src);
            return;
          }
        }
        setPhotoUrl(getAccuratePlacePhoto(stop?.name, stop?.category, destination, width, height));
      })
      .catch(() => {
        if (isMounted) {
          setPhotoUrl(getAccuratePlacePhoto(stop?.name, stop?.category, destination, width, height));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [stop?.name, stop?.category, stop?.image, destination, width, height]);

  const src = photoUrl || getAccuratePlacePhoto(stop?.name, stop?.category, destination, width, height);

  return (
    <img
      src={src}
      alt={stop?.name || 'Place stop'}
      className={className}
      onError={(e) => {
        e.currentTarget.src = getAccuratePlacePhoto(stop?.name, stop?.category, destination, width, height);
      }}
    />
  );
}

export function resolveHeroPhoto(destination = '', requestText = '') {
  const text = `${destination} ${requestText}`.toLowerCase();
  if (
    text.includes('tamil nadu') || text.includes('chennai') || text.includes('madurai') || text.includes('mahabalipuram') ||
    text.includes('tirupati') || text.includes('thirupathi') || text.includes('thanjavur')
  ) {
    return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('kerala') || text.includes('kochi') || text.includes('alleppey') || text.includes('munnar')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('tokyo') || text.includes('japan') || text.includes('kyoto')) {
    return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('paris') || text.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('iceland')) {
    return 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('rome') || text.includes('italy')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&h=900&q=80';
  }
  if (text.includes('kashmir') || text.includes('swiss') || text.includes('mountain')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&h=900&q=80';
  }

  return 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&h=900&q=80';
}
