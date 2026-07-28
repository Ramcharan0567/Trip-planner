export function getDestinationServices(destName = '', promptText = '', homeCountry = 'India', homeCity = 'Chennai') {
  const text = `${destName} ${promptText}`.toLowerCase();
  const hCountry = homeCountry || 'India';
  const hCity = homeCity || 'Home City';
  const isHomeIndia = hCountry.toLowerCase().includes('india');

  // NEW YORK / NYC
  if (
    text.includes('new york') ||
    text.includes('newyork') ||
    text.includes('nyc') ||
    text.includes('manhattan') ||
    text.includes('brooklyn')
  ) {
    return {
      realFlights: isHomeIndia ? [
        { title: 'Air India Direct AI-101', carrier: 'Air India', type: 'Flight', code: 'AI-101', time: '01:30 AM ➔ 07:55 AM', duration: '15h 25m (Non-stop)', priceUSD: 780, bag: '2x 23kg Included', class: 'Economy Choice', originDest: `${hCity} (India) ➔ JFK (NYC)` },
        { title: 'Emirates EK-501 / EK-201', carrier: 'Emirates', type: 'Flight', code: 'EK-501', time: '04:15 AM ➔ 02:20 PM', duration: '16h 35m (1 Stop Dubai)', priceUSD: 820, bag: '30kg Full Service', class: 'Economy Flex', originDest: `${hCity} (India) ➔ EWR (NYC)` },
        { title: 'Qatar Airways QR-571', carrier: 'Qatar Airways', type: 'Flight', code: 'QR-571', time: '03:40 AM ➔ 03:30 PM', duration: '17h 10m (1 Stop Doha)', priceUSD: 890, bag: '30kg Full Service', class: 'Economy Flex', originDest: `India ➔ JFK (NYC)` },
        { title: 'Delta Air Lines DL-106', carrier: 'Delta Air Lines', type: 'Flight', code: 'DL-106', time: '11:15 PM ➔ 06:45 AM (+1)', duration: '15h 00m (Direct)', priceUSD: 950, bag: '2 Bags Included', class: 'Main Cabin Express', originDest: `BOM (India) ➔ JFK (NYC)` }
      ] : [
        { title: 'Delta Air Lines DL-412', carrier: 'Delta Air Lines', type: 'Flight', code: 'DL-412', time: '08:30 AM ➔ 04:45 PM', duration: '5h 15m (Non-stop)', priceUSD: 190, bag: '23kg Included', class: 'Main Cabin Express', originDest: `${hCity} ➔ JFK` },
        { title: 'United Airlines UA-510', carrier: 'United Airlines', type: 'Flight', code: 'UA-510', time: '11:00 AM ➔ 07:25 PM', duration: '5h 25m (Non-stop)', priceUSD: 180, bag: '23kg Included', class: 'Economy Choice', originDest: 'SFO ➔ EWR' }
      ],
      realTrains: [
        { title: 'Amtrak Acela Express #2150', carrier: 'Amtrak Acela High Speed', type: 'Train', code: 'AC-2150', time: '07:00 AM ➔ 09:55 AM', duration: '2h 55m', priceUSD: 120, seats: '22 Seats Left', class: 'Acela First Class' },
        { title: 'Amtrak Northeast Regional #172', carrier: 'Amtrak Northeast', type: 'Train', code: 'NR-172', time: '08:15 AM ➔ 12:25 PM', duration: '4h 10m', priceUSD: 65, seats: '64 Available', class: 'Quiet Car Coach' },
        { title: 'LIRR Express Airport Connector', carrier: 'MTA Long Island Rail Road', type: 'Train', code: 'LIRR-901', time: '09:30 AM ➔ 10:05 AM', duration: '0h 35m', priceUSD: 12, seats: 'Open Seating', class: 'Grand Central Express' }
      ],
      realBuses: [
        { title: 'FlixBus USA NYC Express #NY-102', carrier: 'FlixBus America', type: 'Bus', code: 'FB-102', time: '08:00 AM ➔ 12:15 PM', duration: '4h 15m', priceUSD: 28, seats: '14 Available', class: 'AC Recliner (Free WiFi)' },
        { title: 'Megabus Double Decker #MB-101', carrier: 'Megabus USA', type: 'Bus', code: 'MB-101', time: '01:30 PM ➔ 06:00 PM', duration: '4h 30m', priceUSD: 25, seats: '6 Upper Deck Seats', class: 'Panoramique Coach' }
      ],
      realHotels: [
        { title: 'The Plaza Hotel New York', rating: '⭐ 4.9 (3,420 reviews)', loc: 'Fifth Avenue & Central Park South · NYC', priceUSD: 550, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Central Park View', 'Champagne Bar', 'Historic Luxury'] },
        { title: 'The Ritz-Carlton New York NoMad', rating: '⭐ 4.9 (1,850 reviews)', loc: 'Madison Avenue & 28th St · NYC', priceUSD: 480, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Empire State View', 'Rooftop Lounge', 'Luxury Spa'] },
        { title: 'Marriott Marquis Times Square', rating: '⭐ 4.8 (2,910 reviews)', loc: 'Broadway & 45th St · Times Square NYC', priceUSD: 290, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Times Square View', 'Revolving Dining', 'Broadway Hub'] },
        { title: 'Arlo SoHo Boutique Hotel', rating: '⭐ 4.7 (1,140 reviews)', loc: 'Hudson Street · SoHo NYC', priceUSD: 210, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Courtyard Lounge', 'Rooftop Bar', 'SoHo District'] }
      ],
      realCabs: [
        { title: 'NYC Yellow Cab Airport Express', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 65, perKm: 'Flat Rate $70', feature: 'Official NYC Yellow Cab Flat Rate JFK/EWR to Manhattan' },
        { title: 'Executive SUV Chauffeur NYC', type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 120, perKm: '$3.5/mile', feature: 'Luxury Suburban SUV for Broadway & Manhattan City Sightseeing' }
      ]
    };
  }

  // CALIFORNIA / US WEST
  if (
    text.includes('california') ||
    text.includes('san francisco') ||
    text.includes('los angeles') ||
    text.includes('yosemite') ||
    text.includes('napa') ||
    text.includes('monterey')
  ) {
    return {
      realFlights: isHomeIndia ? [
        { title: 'Air India AI-173 SFO Direct', carrier: 'Air India', type: 'Flight', code: 'AI-173', time: '04:00 AM ➔ 07:00 AM', duration: '15h 30m (Non-stop)', priceUSD: 850, bag: '2x 23kg Included', class: 'Economy Choice', originDest: `${hCity} (India) ➔ SFO (California)` },
        { title: 'Singapore Airlines SQ-31', carrier: 'Singapore Airlines', type: 'Flight', code: 'SQ-31', time: '11:15 PM ➔ 08:30 PM', duration: '17h 15m (1 Stop)', priceUSD: 920, bag: '30kg Full Service', class: 'Economy Flex', originDest: `${hCity} ➔ SFO` }
      ] : [
        { title: 'United Airlines UA-872', carrier: 'United Airlines', type: 'Flight', code: 'UA-872', time: '07:30 AM ➔ 08:55 AM', duration: '1h 25m (Non-stop)', priceUSD: 95, bag: '23kg Included', class: 'Economy Choice', originDest: 'SFO ➔ LAX' },
        { title: 'Delta Air Lines DL-402', carrier: 'Delta Air Lines', type: 'Flight', code: 'DL-402', time: '11:15 AM ➔ 01:00 PM', duration: '1h 45m (Non-stop)', priceUSD: 115, bag: '23kg Included', class: 'Main Cabin', originDest: 'SJC ➔ SAN' }
      ],
      realTrains: [
        { title: 'Amtrak Coast Starlight #14', carrier: 'Amtrak California', type: 'Train', code: 'AM-14', time: '08:45 AM ➔ 08:05 PM', duration: '11h 20m (Coastal)', priceUSD: 58, seats: '34 Seats Left', class: 'Business Coast View' },
        { title: 'Amtrak Pacific Surfliner #572', carrier: 'Pacific Surfliner', type: 'Train', code: 'PS-572', time: '09:15 AM ➔ 03:00 PM', duration: '5h 45m', priceUSD: 42, seats: '80 Available', class: 'Ocean View Coach' }
      ],
      realBuses: [
        { title: 'FlixBus USA Express #US-302', carrier: 'FlixBus America', type: 'Bus', code: 'FB-302', time: '09:00 AM ➔ 03:30 PM', duration: '6h 30m', priceUSD: 22, seats: '18 Available', class: 'AC Recliner (Free WiFi)' }
      ],
      realHotels: [
        { title: 'The Ritz-Carlton San Francisco', rating: '⭐ 4.9 (2,890 reviews)', loc: 'Nob Hill · San Francisco, CA', priceUSD: 280, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Nob Hill View', 'Club Lounge Access', 'Michelin Dining'] },
        { title: 'Yosemite Valley Lodge & Cabins', rating: '⭐ 4.8 (1,950 reviews)', loc: 'Yosemite National Park, CA', priceUSD: 190, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Glacier View', 'Fireplace', 'Walking Trails'] }
      ],
      realCabs: [
        { title: 'SFO / LAX Airport Sedan Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 45, perKm: '$1.8/mile', feature: 'AC Sedan for SFO/LAX Airport & Downtown Transfer' }
      ]
    };
  }

  // TIRUPATI / ANDHRA PRADESH
  if (
    text.includes('tirupati') ||
    text.includes('thirupathi') ||
    text.includes('tirumala') ||
    text.includes('balaji') ||
    text.includes('chittoor')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-7201', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-7201', time: '06:30 AM ➔ 07:40 AM', duration: '1h 10m (Non-stop)', priceUSD: 45, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ TIR` },
        { title: 'Air India AI-542', carrier: 'Air India', type: 'Flight', code: 'AI-542', time: '09:15 AM ➔ 10:10 AM', duration: '0h 55m (Non-stop)', priceUSD: 48, bag: '25kg Check-in', class: 'Economy Flex', originDest: 'BLR ➔ TIR' },
        { title: 'Star Air S5-114', carrier: 'Star Air India', type: 'Flight', code: 'S5-114', time: '02:40 PM ➔ 03:40 PM', duration: '1h 00m (Direct)', priceUSD: 40, bag: '15kg Check-in', class: 'Economy Express', originDest: 'VGA ➔ TIR' }
      ],
      realTrains: [
        { title: 'Tirupati Vande Bharat #20701', carrier: 'Indian Railways Vande Bharat', type: 'Train', code: '20701', time: '06:00 AM ➔ 02:15 PM', duration: '8h 15m', priceUSD: 24, seats: '42 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Sapthagiri Express #12734', carrier: 'South Central Railway', type: 'Train', code: '12734', time: '06:25 AM ➔ 09:40 AM', duration: '3h 15m', priceUSD: 8, seats: '110 Available', class: 'AC Chair Car (CC)' },
        { title: 'Rayalaseema Express #12793', carrier: 'South Central Railway', type: 'Train', code: '12793', time: '05:30 PM ➔ 06:00 AM (+1)', duration: '12h 30m', priceUSD: 14, seats: '28 Available', class: '2nd AC Tier (2A)' }
      ],
      realBuses: [
        { title: 'APSRTC Garuda Plus AC Volvo', carrier: 'APSRTC Volvo', type: 'Bus', code: 'AP-102', time: '10:30 PM ➔ 03:00 AM (+1)', duration: '4h 30m', priceUSD: 9, seats: '16 Seats Available', class: 'AC Multi-Axle Volvo' },
        { title: 'APSRTC Amaravathi AC Sleeper', carrier: 'APSRTC Amaravathi', type: 'Bus', code: 'AP-804', time: '09:00 PM ➔ 06:00 AM (+1)', duration: '9h 00m', priceUSD: 14, seats: '10 Sleepers Available', class: 'AC Sleeper 2+1' }
      ],
      realHotels: [
        { title: 'Taj Tirupati', rating: '⭐ 4.9 (1,840 reviews)', loc: 'Alipiri Road · Tirupati', priceUSD: 130, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Sacred Hill View', 'Infinity Pool', 'Pure Veg Restaurant'] },
        { title: 'Fortune Select Grand Ridge', rating: '⭐ 4.8 (2,150 reviews)', loc: 'Shilparamam Theme Park Road', priceUSD: 85, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Temple Shuttle', 'Swimming Pool', 'Free Breakfast'] }
      ],
      realCabs: [
        { title: 'Alipiri Foothills Sedan Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 20, perKm: '₹14/km', feature: 'AC Dzire for Tirupati Station to Tirumala Hill Up/Down' },
        { title: 'Innova Crysta Pilgrim SUV', type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 45, perKm: '₹19/km', feature: 'Innova Crysta for Chandragiri Fort & Srikalahasti Temple Tour' }
      ]
    };
  }

  // KERALA
  if (
    text.includes('kerala') ||
    text.includes('kochi') ||
    text.includes('munnar') ||
    text.includes('alleppey') ||
    text.includes('trivandrum')
  ) {
    return {
      realFlights: [
        { title: 'Air India Express IX-482', carrier: 'Air India Express', type: 'Flight', code: 'IX-482', time: '08:00 AM ➔ 09:05 AM', duration: '1h 05m (Non-stop)', priceUSD: 48, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ COK` },
        { title: 'IndiGo Airlines 6E-612', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-612', time: '11:30 AM ➔ 01:40 PM', duration: '2h 10m (Non-stop)', priceUSD: 62, bag: '15kg Check-in', class: 'Economy Choice', originDest: 'BOM ➔ TRV' }
      ],
      realTrains: [
        { title: 'Kerala Vande Bharat #20634', carrier: 'Indian Railways Vande Bharat', type: 'Train', code: '20634', time: '05:30 AM ➔ 01:35 PM', duration: '8h 05m', priceUSD: 22, seats: '30 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Trivandrum Jan Shatabdi #12075', carrier: 'Southern Railway', type: 'Train', code: '12075', time: '08:15 AM ➔ 02:45 PM', duration: '6h 30m', priceUSD: 12, seats: '86 Available', class: 'AC Chair Car (CC)' }
      ],
      realBuses: [
        { title: 'KSRTC SWIFT Deluxe AC Volvo', carrier: 'KSRTC SWIFT Kerala', type: 'Bus', code: 'KS-301', time: '08:30 PM ➔ 07:00 AM (+1)', duration: '10h 30m', priceUSD: 15, seats: '18 Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'Kumarakom Lake Resort', rating: '⭐ 4.9 (2,450 reviews)', loc: 'Vembanad Lake · Alleppey', priceUSD: 220, img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2', tags: ['Heritage Villas', 'Infinity Pool', 'Sunset Cruise'] },
        { title: 'Spice Village Munnar Hills', rating: '⭐ 4.8 (1,340 reviews)', loc: 'Munnar & Periyar, Kerala', priceUSD: 140, img: 'https://images.unsplash.com/photo-1586041829158-b807759b407b', tags: ['Organic Tea Garden', 'Ayurveda Spa', 'Mountain View'] }
      ],
      realCabs: [
        { title: 'Kochi Airport Sedan Transfer', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 28, perKm: '₹15/km', feature: 'AC Sedan for Kochi Airport to Munnar / Alleppey' }
      ]
    };
  }

  // KASHMIR
  if (
    text.includes('kashmir') ||
    text.includes('srinagar') ||
    text.includes('gulmarg') ||
    text.includes('pahalgam')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-2104', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-2104', time: '08:15 AM ➔ 09:40 AM', duration: '1h 25m (Non-stop)', priceUSD: 58, bag: '15kg Check-in', class: 'Economy Choice', originDest: `${hCity} ➔ SXR` },
        { title: 'Air India AI-825', carrier: 'Air India', type: 'Flight', code: 'AI-825', time: '10:30 AM ➔ 01:10 PM', duration: '2h 40m (Non-stop)', priceUSD: 85, bag: '25kg Check-in', class: 'Economy Flex', originDest: 'DEL ➔ SXR' }
      ],
      realTrains: [
        { title: 'Vande Bharat Srinagar #22439', carrier: 'Indian Railways Vande Bharat', type: 'Train', code: '22439', time: '06:00 AM ➔ 02:00 PM', duration: '8h 00m', priceUSD: 26, seats: '20 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Kashmir Rail Valley Express #04618', carrier: 'Northern Railway Kashmir', type: 'Train', code: '04618', time: '08:30 AM ➔ 10:45 AM', duration: '2h 15m', priceUSD: 5, seats: 'Open Seating', class: 'Snow View Vista Coach' }
      ],
      realBuses: [
        { title: 'JKSRTC Super Deluxe AC Coach', carrier: 'JKSRTC Kashmir', type: 'Bus', code: 'JK-101', time: '07:00 AM ➔ 03:30 PM', duration: '8h 30m', priceUSD: 12, seats: '22 Seats Available', class: 'Executive AC Coach' }
      ],
      realHotels: [
        { title: 'Taj Dal View Srinagar', rating: '⭐ 4.9 (1,920 reviews)', loc: 'Kralsangri Hills · Srinagar', priceUSD: 260, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', tags: ['Dal Lake Panorama', 'Heated Pool', 'Wazwan Dining'] },
        { title: 'The Khyber Himalayan Resort & Spa', rating: '⭐ 4.9 (2,410 reviews)', loc: 'Gulmarg Snow Slopes, Kashmir', priceUSD: 320, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', tags: ['Gondola View', 'Heated Indoor Pool', 'Ski Resort'] }
      ],
      realCabs: [
        { title: 'Srinagar Airport Sedan Transfer', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 25, perKm: '₹16/km', feature: 'AC Sedan for Srinagar Airport & Shikara Ghats' }
      ]
    };
  }

  // DEFAULT FALLBACK
  const dName = destName || 'Destination';
  return {
    realFlights: isHomeIndia ? [
      { title: `IndiGo International 6E-204`, carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-204', time: '06:15 AM ➔ 02:30 PM', duration: '8h 15m', priceUSD: 310, bag: '25kg Included', class: 'Economy Standard', originDest: `${hCity} (India) ➔ ${dName}` },
      { title: `Air India Direct AI-802`, carrier: 'Air India', type: 'Flight', code: 'AI-802', time: '10:40 AM ➔ 06:10 PM', duration: '9h 30m', priceUSD: 420, bag: '2x 23kg Included', class: 'Economy Flex', originDest: `India ➔ ${dName}` }
    ] : [
      { title: `Global Express DL-204`, carrier: 'Delta Air Lines', type: 'Flight', code: 'DL-204', time: '06:15 AM ➔ 08:30 AM', duration: '2h 15m', priceUSD: 185, bag: '23kg Included', class: 'Economy Standard', originDest: `${hCity} (${hCountry}) ➔ ${dName}` },
      { title: `United Airlines UA-542`, carrier: 'United Airlines', type: 'Flight', code: 'UA-542', time: '10:40 AM ➔ 01:10 PM', duration: '2h 30m', priceUSD: 210, bag: '23kg Included', class: 'Economy Flex', originDest: `${hCountry} ➔ ${dName}` }
    ],
    realTrains: isHomeIndia ? [
      { title: `${dName} Vande Bharat Express #20608`, carrier: 'Indian Railways Vande Bharat', type: 'Train', code: '20608', time: '05:50 AM ➔ 12:30 PM', duration: '6h 40m', priceUSD: 28, seats: '42 Available', class: 'AC Executive Chair Car (EC)' },
      { title: `${dName} Rajdhani Express #12432`, carrier: 'Indian Railways Rajdhani', type: 'Train', code: '12432', time: '04:30 PM ➔ 06:15 AM (+1)', duration: '13h 45m', priceUSD: 42, seats: '18 Available', class: '1st AC Tier (1A)' }
    ] : [
      { title: `${dName} Express Rail #20608`, carrier: 'National Rail Express', type: 'Train', code: '20608', time: '05:50 AM ➔ 12:30 PM', duration: '6h 40m', priceUSD: 38, seats: '42 Available', class: '1st Class Express' }
    ],
    realBuses: [
      { title: `${dName} IntrCity SmartBus AC Volvo`, carrier: 'IntrCity SmartBus', type: 'Bus', code: 'SB-804', time: '10:30 PM ➔ 06:00 AM (+1)', duration: '7h 30m', priceUSD: 15, seats: '14 Sleepers Available', class: 'AC Sleeper 2+1' }
    ],
    realHotels: [
      { title: `The Grand Taj Heritage Resort ${dName}`, rating: '⭐ 4.9 (2,480 reviews)', loc: `City Center · ${dName}`, priceUSD: 180, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Free Cancellation', 'Breakfast Included', 'Infinity Pool'] },
      { title: `Radisson Blu Luxury Suites ${dName}`, rating: '⭐ 4.8 (1,150 reviews)', loc: `Landmark Zone · ${dName}`, priceUSD: 140, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Free WiFi', 'Spa & Wellness', 'Airport Shuttle'] }
    ],
    realCabs: [
      { title: `${dName} Airport Sedan Cab Transfer`, type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 35, perKm: '₹14/km', feature: `AC Sedan for ${dName} Airport & Local Sightseeing` }
    ]
  };
}
