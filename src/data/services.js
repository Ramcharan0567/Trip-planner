export function getDestinationServices(destName = '', promptText = '', homeCountry = 'India', homeCity = 'Chennai') {
  const text = `${destName} ${promptText}`.toLowerCase();
  const hCountry = homeCountry || 'India';
  const hCity = homeCity || 'Home City';
  const isHomeIndia = hCountry.toLowerCase().includes('india');

  // GUJARAT (Ahmedabad, Somnath, Dwarka, Gir, Kevadia / Statue of Unity, Surat, Vadodara, Kutch, Rajkot, etc.)
  if (
    text.includes('gujarat') ||
    text.includes('ahmedabad') ||
    text.includes('somnath') ||
    text.includes('dwarka') ||
    text.includes('gir') ||
    text.includes('statue of unity') ||
    text.includes('kevadia') ||
    text.includes('rann of kutch') ||
    text.includes('kutch') ||
    text.includes('bhuj') ||
    text.includes('vadodara') ||
    text.includes('baroda') ||
    text.includes('surat') ||
    text.includes('rajkot') ||
    text.includes('jamnagar') ||
    text.includes('gandhinagar') ||
    text.includes('diu') ||
    text.includes('porbandar')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-602 (Ahmedabad Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-602', time: '06:10 AM ➔ 08:15 AM', duration: '2h 05m (Non-stop)', priceUSD: 52, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ AMD (Ahmedabad)` },
        { title: 'Air India AI-112 Direct', carrier: 'Air India', type: 'Flight', code: 'AI-112', time: '09:40 AM ➔ 11:35 AM', duration: '1h 55m (Non-stop)', priceUSD: 65, bag: '25kg Check-in', class: 'Economy Flex', originDest: `DEL ➔ AMD` },
        { title: 'Star Air S5-201 Regional Express', carrier: 'Star Air India', type: 'Flight', code: 'S5-201', time: '02:15 PM ➔ 03:30 PM', duration: '1h 15m (Direct)', priceUSD: 46, bag: '15kg Check-in', class: 'Economy Choice', originDest: `BOM ➔ STV (Surat)` }
      ],
      realTrains: [
        { title: 'Vande Bharat Express Ahmedabad #20901', carrier: 'Western Railway Vande Bharat', type: 'Train', code: '20901', time: '06:00 AM ➔ 11:25 AM', duration: '5h 25m', priceUSD: 22, seats: '38 Seats Left', class: 'AC Executive Chair Car (EC)' },
        { title: 'Gujarat Superfast Express #12901', carrier: 'Western Railway', type: 'Train', code: '12901', time: '09:30 PM ➔ 05:40 AM (+1)', duration: '8h 10m', priceUSD: 14, seats: '65 Available', class: '2nd AC Tier (2A)' },
        { title: 'Somnath Mail Express #19251', carrier: 'Western Railway', type: 'Train', code: '19251', time: '10:45 PM ➔ 07:15 AM (+1)', duration: '8h 30m', priceUSD: 11, seats: '40 Available', class: '3rd AC Tier (3A)' }
      ],
      realBuses: [
        { title: 'GSRTC Volvo AC Sleeper #GJ-102', carrier: 'GSRTC Express Gujarat', type: 'Bus', code: 'GJ-102', time: '10:00 PM ➔ 05:30 AM (+1)', duration: '7h 30m', priceUSD: 11, seats: '14 Sleepers Available', class: 'AC Multi-Axle Volvo' },
        { title: 'IntrCity SmartBus Gujarat Express #GJ-808', carrier: 'IntrCity SmartBus', type: 'Bus', code: 'GJ-808', time: '09:30 PM ➔ 06:15 AM (+1)', duration: '8h 45m', priceUSD: 13, seats: '10 Sleepers Available', class: 'Luxury AC Sleeper' }
      ],
      realHotels: [
        { title: 'Taj Gandhinagar Resort & Spa', rating: '⭐ 4.9 (2,180 reviews)', loc: 'Sarkhej-Gandhinagar Hwy · Gandhinagar / Ahmedabad', priceUSD: 190, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Royal Heritage Architecture', 'Lush Gardens', 'Pure Veg Gourmet'] },
        { title: 'Hyatt Regency Ahmedabad', rating: '⭐ 4.8 (3,420 reviews)', loc: 'Ashram Road · Sabarmati Riverfront, Ahmedabad', priceUSD: 125, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Sabarmati River View', 'Infinity Pool', '24/7 Fine Dining'] },
        { title: 'Tent City Narmada (Statue of Unity)', rating: '⭐ 4.9 (4,150 reviews)', loc: 'Statue of Unity Zone · Kevadia, Gujarat', priceUSD: 160, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Statue of Unity View', 'Luxury Swiss Tents', 'Cultural Night Shows'] },
        { title: 'Welcomhotel by ITC Hotels Vadodara', rating: '⭐ 4.8 (1,890 reviews)', loc: 'RC Dutt Road · Alkapuri, Vadodara', priceUSD: 105, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Laxmi Vilas Palace Access', 'Outdoor Pool', 'Gujarati Thali Special'] },
        { title: 'The Gateway Hotel Somnath & Gir', rating: '⭐ 4.7 (2,100 reviews)', loc: 'Near Temple Precinct · Somnath & Gir Sanctuary', priceUSD: 115, img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2', tags: ['Somnath Temple Shuttle', 'Lion Safari Desk', 'Arabian Sea View'] },
        { title: 'Rann Resort White Rann Kutch', rating: '⭐ 4.8 (1,650 reviews)', loc: 'Dhordo Village · White Rann of Kutch', priceUSD: 145, img: 'https://images.unsplash.com/photo-1586041829158-b807759b407b', tags: ['Kutchi Bhunga Huts', 'Rann Utsav Safari', 'Stargazing Lounge'] },
        { title: 'Courtyard by Marriott Surat', rating: '⭐ 4.8 (2,250 reviews)', loc: 'Hazira Road · Textile Hub, Surat', priceUSD: 110, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', tags: ['Diamond & Textile District', 'Executive Lounge', 'Poolside BBQ'] },
        { title: 'The Fern Residency Rajkot', rating: '⭐ 4.7 (1,340 reviews)', loc: 'Kuwadwa Road · Rajkot', priceUSD: 75, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', tags: ['Eco-Friendly Luxury', 'Kathiyawadi Thali', 'Central Location'] }
      ],
      realCabs: [
        { title: 'Ahmedabad Dzire Airport & City Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 24, perKm: '₹14/km', feature: 'AC Sedan for Ahmedabad Airport, Heritage Walk & Riverfront' },
        { title: 'Innova Crysta Gujarat Tour SUV', type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 52, perKm: '₹19/km', feature: 'Innova Crysta for Statue of Unity, Somnath, Dwarka & Gir Safari Tour' }
      ]
    };
  }

  // GOA (Panjim, Baga, Calangute, Anjuna, Palolem, South Goa, North Goa)
  if (
    text.includes('goa') ||
    text.includes('panjim') ||
    text.includes('calangute') ||
    text.includes('baga') ||
    text.includes('anjuna') ||
    text.includes('palolem') ||
    text.includes('candolim') ||
    text.includes('dudhsagar')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-244 (Mopa Airport Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-244', time: '07:30 AM ➔ 08:45 AM', duration: '1h 15m (Non-stop)', priceUSD: 48, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ GOX (North Goa)` },
        { title: 'Air India Express IX-712', carrier: 'Air India Express', type: 'Flight', code: 'IX-712', time: '10:15 AM ➔ 11:30 AM', duration: '1h 15m (Non-stop)', priceUSD: 55, bag: '15kg Check-in', class: 'Economy Flex', originDest: `BOM ➔ GOI (Dabolim)` }
      ],
      realTrains: [
        { title: 'Goa Vande Bharat Express #22229', carrier: 'Central Railway Vande Bharat', type: 'Train', code: '22229', time: '05:25 AM ➔ 01:10 PM', duration: '7h 45m', priceUSD: 26, seats: '24 Seats Left', class: 'AC Executive Chair Car (EC)' },
        { title: 'Mandovi Express #10103', carrier: 'Konkan Railway', type: 'Train', code: '10103', time: '07:10 AM ➔ 06:45 PM', duration: '11h 35m (Scenic Konkan)', priceUSD: 16, seats: '50 Available', class: '2nd AC Tier (2A)' }
      ],
      realBuses: [
        { title: 'Paulo Travels Volvo AC Multi-Axle Sleeper', carrier: 'Paulo Travels Goa', type: 'Bus', code: 'PT-108', time: '09:00 PM ➔ 07:00 AM (+1)', duration: '10h 00m', priceUSD: 16, seats: '12 Sleepers Available', class: 'AC Sleeper 2+1' }
      ],
      realHotels: [
        { title: 'Taj Exotica Resort & Spa Goa', rating: '⭐ 4.9 (3,120 reviews)', loc: 'Benaulim Beach · South Goa', priceUSD: 260, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Private Beach Front', 'Golf Course', 'Seafood Grill'] },
        { title: 'W Goa Beach Resort', rating: '⭐ 4.8 (2,450 reviews)', loc: 'Vagator Beach · North Goa', priceUSD: 230, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Sunset Cliff Deck', 'Rock Pool Bar', 'Spa & Wellness'] },
        { title: 'Heritage Village Resort & Spa Goa', rating: '⭐ 4.7 (1,890 reviews)', loc: 'Arossim Beach · Cansaulim', priceUSD: 130, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Portuguese Architecture', 'All-Inclusive Bar', 'Ayurveda Spa'] },
        { title: 'Novotel Goa Candolim Hotel', rating: '⭐ 4.7 (1,620 reviews)', loc: 'Pinto Waddo · Candolim', priceUSD: 110, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Candolim Beach Shuttle', 'Kids Club', 'Poolside Lounge'] }
      ],
      realCabs: [
        { title: 'Goa Mopa / Dabolim Airport Dzire Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 28, perKm: '₹18/km', feature: 'AC Sedan for Airport Pick-up & North / South Goa Beaches' }
      ]
    };
  }

  // RAJASTHAN / JAIPUR / UDAIPUR / JODHPUR / JAISALMER / AGRA
  if (
    text.includes('rajasthan') ||
    text.includes('jaipur') ||
    text.includes('udaipur') ||
    text.includes('jodhpur') ||
    text.includes('jaisalmer') ||
    text.includes('pushkar') ||
    text.includes('bikaner') ||
    text.includes('agra')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Express 6E-294 (Jaipur Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-294', time: '07:15 AM ➔ 09:20 AM', duration: '2h 05m (Non-stop)', priceUSD: 58, bag: '15kg Check-in', class: 'Economy Choice', originDest: `${hCity} ➔ JAI` },
        { title: 'Air India AI-471 (Udaipur Direct)', carrier: 'Air India', type: 'Flight', code: 'AI-471', time: '11:10 AM ➔ 12:40 PM', duration: '1h 30m (Non-stop)', priceUSD: 68, bag: '25kg Check-in', class: 'Economy Flex', originDest: `DEL ➔ UDR` }
      ],
      realTrains: [
        { title: 'Jaipur Vande Bharat #20977', carrier: 'North Western Railway', type: 'Train', code: '20977', time: '06:15 AM ➔ 10:15 AM', duration: '4h 00m', priceUSD: 20, seats: '32 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Ajmer Shatabdi Express #12015', carrier: 'Northern Railway', type: 'Train', code: '12015', time: '06:00 AM ➔ 10:40 AM', duration: '4h 40m', priceUSD: 14, seats: '80 Available', class: 'AC Chair Car (CC)' }
      ],
      realBuses: [
        { title: 'RSRTC Goldline AC Volvo', carrier: 'RSRTC Rajasthan', type: 'Bus', code: 'RJ-101', time: '09:30 PM ➔ 04:30 AM (+1)', duration: '7h 00m', priceUSD: 12, seats: '16 Sleepers Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'The Leela Palace Udaipur', rating: '⭐ 4.9 (3,980 reviews)', loc: 'Lake Pichola · Udaipur, Rajasthan', priceUSD: 380, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Lake Pichola Panorama', 'Boat Arrival', 'Royal Butler Service'] },
        { title: 'Rambagh Palace Jaipur', rating: '⭐ 4.9 (4,120 reviews)', loc: 'Bhawani Singh Road · Jaipur', priceUSD: 420, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Royal Heritage Palace', 'Peacock Gardens', 'Polo Bar'] },
        { title: 'Suryagarh Jaisalmer', rating: '⭐ 4.8 (2,150 reviews)', loc: 'Sam Sand Dunes Road · Jaisalmer', priceUSD: 220, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Thar Desert Fortress', 'Dune Safari', 'Rajasthani Folk Nights'] },
        { title: 'The Oberoi Amarvilas Agra', rating: '⭐ 4.9 (3,600 reviews)', loc: 'Taj East Gate Road · Agra', priceUSD: 390, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Unobstructed Taj Mahal View', 'Private Balcony', 'Royal Spa'] }
      ],
      realCabs: [
        { title: 'Jaipur Forts & Udaipur Palace Innova SUV', type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 48, perKm: '₹18/km', feature: 'Innova Crysta for Amer Fort, City Palace & Lake Tour' }
      ]
    };
  }

  // TAMIL NADU / CHENNAI / MADURAI / OOTY / RAMESHWARAM / KANYAKUMARI / PONDICHERRY
  if (
    text.includes('tamil nadu') ||
    text.includes('tamilnadu') ||
    text.includes('chennai') ||
    text.includes('madurai') ||
    text.includes('thanjavur') ||
    text.includes('mahabalipuram') ||
    text.includes('ooty') ||
    text.includes('kanyakumari') ||
    text.includes('rameshwaram') ||
    text.includes('pondicherry') ||
    text.includes('kanchipuram') ||
    text.includes('coimbatore')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-205 (Chennai Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-205', time: '08:00 AM ➔ 10:15 AM', duration: '2h 15m', priceUSD: 46, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ MAA` },
        { title: 'Air India AI-560 (Madurai Direct)', carrier: 'Air India', type: 'Flight', code: 'AI-560', time: '11:45 AM ➔ 01:05 PM', duration: '1h 20m', priceUSD: 52, bag: '25kg Check-in', class: 'Economy Flex', originDest: `BLR ➔ IXM` }
      ],
      realTrains: [
        { title: 'Vande Bharat Chennai-Madurai #20601', carrier: 'Southern Railway Vande Bharat', type: 'Train', code: '20601', time: '06:00 AM ➔ 11:50 AM', duration: '5h 50m', priceUSD: 21, seats: '40 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Nilgiri Mountain Railway Toy Train #56136', carrier: 'Southern Railway Heritage', type: 'Train', code: '56136', time: '07:10 AM ➔ 12:00 PM', duration: '4h 50m (UNESCO Toy Train)', priceUSD: 8, seats: 'Open First Class', class: 'Vista Heritage Coach' }
      ],
      realBuses: [
        { title: 'SETC Ultra Deluxe AC Volvo', carrier: 'SETC Tamil Nadu', type: 'Bus', code: 'TN-105', time: '09:30 PM ➔ 05:00 AM (+1)', duration: '7h 30m', priceUSD: 10, seats: '20 Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'ITC Grand Chola Chennai', rating: '⭐ 4.9 (4,250 reviews)', loc: 'Guindy · Chennai, Tamil Nadu', priceUSD: 190, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Chola Dynasty Grandeur', '10 Luxury Dining Outlets', 'Rooftop Pools'] },
        { title: 'Savoy - IHCL SeleQtions Ooty', rating: '⭐ 4.8 (1,920 reviews)', loc: 'IBP Road · Ooty Hill Station', priceUSD: 170, img: 'https://images.unsplash.com/photo-1586041829158-b807759b407b', tags: ['Colonial Cottage Heritage', 'Tea Estate Views', 'Fireplace Suites'] },
        { title: 'Heritage Madurai Resort', rating: '⭐ 4.8 (2,100 reviews)', loc: 'Kochadai · Madurai', priceUSD: 110, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Olympic Temple Pool', 'Meenakshi Temple Shuttle', 'Traditional South Dining'] },
        { title: 'The Promenade Pondicherry', rating: '⭐ 4.7 (1,740 reviews)', loc: 'Goubert Avenue · French Quarter, Pondicherry', priceUSD: 125, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['French Quarter Ocean Front', 'Lighthouse View Deck', 'Woodfire Pizza'] }
      ],
      realCabs: [
        { title: 'Chennai & Temple Circuit Dzire Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 26, perKm: '₹14/km', feature: 'AC Dzire for Chennai, Mahabalipuram & Kanchipuram Tour' }
      ]
    };
  }

  // MUMBAI / MAHARASHTRA / PUNE / LONAVALA
  if (
    text.includes('mumbai') ||
    text.includes('bombay') ||
    text.includes('maharashtra') ||
    text.includes('pune') ||
    text.includes('lonavala') ||
    text.includes('mahableshwar') ||
    text.includes('shirdi') ||
    text.includes('nashik')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-5301 (Mumbai Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-5301', time: '06:45 AM ➔ 08:30 AM', duration: '1h 45m', priceUSD: 54, bag: '15kg Check-in', class: 'Economy Choice', originDest: `${hCity} ➔ BOM` },
        { title: 'Air India AI-615', carrier: 'Air India', type: 'Flight', code: 'AI-615', time: '10:30 AM ➔ 12:40 PM', duration: '2h 10m', priceUSD: 66, bag: '25kg Check-in', class: 'Economy Flex', originDest: `DEL ➔ BOM` }
      ],
      realTrains: [
        { title: 'Mumbai Vande Bharat #22224', carrier: 'Central Railway Vande Bharat', type: 'Train', code: '22224', time: '06:00 AM ➔ 12:30 PM', duration: '6h 30m', priceUSD: 24, seats: '30 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Deccan Queen Express #12124', carrier: 'Central Railway', type: 'Train', code: '12124', time: '07:15 AM ➔ 10:25 AM', duration: '3h 10m', priceUSD: 9, seats: '95 Available', class: 'AC Chair Car (CC)' }
      ],
      realBuses: [
        { title: 'Neeta Travels Volvo AC Sleeper', carrier: 'Neeta Travels Mumbai', type: 'Bus', code: 'MH-102', time: '10:00 PM ➔ 05:30 AM (+1)', duration: '7h 30m', priceUSD: 14, seats: '14 Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'The Taj Mahal Palace Mumbai', rating: '⭐ 4.9 (5,120 reviews)', loc: 'Apollo Bunder · Gateway of India, Mumbai', priceUSD: 310, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Gateway of India View', 'Sea Lounge Afternoon Tea', 'Iconic 1903 Landmark'] },
        { title: 'JW Marriott Mumbai Juhu', rating: '⭐ 4.8 (3,840 reviews)', loc: 'Juhu Beach · Mumbai', priceUSD: 210, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Juhu Beach Front', 'Celebrity Dining', 'Saltwater Pools'] },
        { title: 'Trident Nariman Point Mumbai', rating: '⭐ 4.8 (2,910 reviews)', loc: 'Marine Drive · Mumbai', priceUSD: 195, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Queens Necklace View', 'Opulent Bar', 'Marine Drive Walk'] }
      ],
      realCabs: [
        { title: 'Mumbai Airport & Marine Drive Chauffeur', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 30, perKm: '₹16/km', feature: 'AC Sedan for BOM Airport & South Mumbai Sightseeing' }
      ]
    };
  }

  // BENGALURU / KARNATAKA / MYSORE / COORG / HAMPI
  if (
    text.includes('karnataka') ||
    text.includes('bangalore') ||
    text.includes('bengaluru') ||
    text.includes('mysore') ||
    text.includes('coorg') ||
    text.includes('hampi') ||
    text.includes('gokarna') ||
    text.includes('chikmagalur')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-401 (Bengaluru Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-401', time: '06:00 AM ➔ 07:05 AM', duration: '1h 05m', priceUSD: 42, bag: '15kg Check-in', class: 'Economy Standard', originDest: `${hCity} ➔ BLR` },
        { title: 'Star Air S5-108 (Mysore Express)', carrier: 'Star Air', type: 'Flight', code: 'S5-108', time: '10:00 AM ➔ 11:15 AM', duration: '1h 15m', priceUSD: 48, bag: '15kg Check-in', class: 'Economy Flex', originDest: `BOM ➔ MYQ` }
      ],
      realTrains: [
        { title: 'Mysuru Vande Bharat Express #20607', carrier: 'South Western Railway Vande Bharat', type: 'Train', code: '20607', time: '05:50 AM ➔ 10:20 AM', duration: '4h 30m', priceUSD: 19, seats: '35 Available', class: 'AC Executive Chair Car (EC)' },
        { title: 'Shatabdi Express Bengaluru #12007', carrier: 'Southern Railway', type: 'Train', code: '12007', time: '06:00 AM ➔ 10:45 AM', duration: '4h 45m', priceUSD: 13, seats: '60 Available', class: 'AC Chair Car (CC)' }
      ],
      realBuses: [
        { title: 'KSRTC Airavat Club Class Volvo', carrier: 'KSRTC Karnataka', type: 'Bus', code: 'KA-101', time: '10:30 PM ➔ 05:00 AM (+1)', duration: '6h 30m', priceUSD: 12, seats: '18 Seats Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'The Leela Palace Bengaluru', rating: '⭐ 4.9 (3,410 reviews)', loc: 'HAL Old Airport Road · Bengaluru', priceUSD: 220, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Vijayanagara Palace Style', 'Lagoon Pool', 'Award-Winning Dining'] },
        { title: 'Evolve Back Coorg Wilderness Resort', rating: '⭐ 4.9 (2,650 reviews)', loc: 'Chikkana Halli Estate · Coorg', priceUSD: 280, img: 'https://images.unsplash.com/photo-1586041829158-b807759b407b', tags: ['Coffee Plantation Eco Lodge', 'Private Pool Villa', 'Nature Trails'] },
        { title: 'Grand Mercure Mysore', rating: '⭐ 4.7 (1,890 reviews)', loc: 'Sayyaji Rao Road · Mysore', priceUSD: 95, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Mysore Palace Shuttle', 'Rooftop Swimming Pool', 'South Gourmet'] }
      ],
      realCabs: [
        { title: 'Bengaluru Airport & Mysore Tour Dzire', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 25, perKm: '₹14/km', feature: 'AC Sedan for BLR Airport & City Sightseeing' }
      ]
    };
  }

  // HIMACHAL / UTTARAKHAND / SHIMLA / MANALI / RISHIKESH / KASOL / LADAKH
  if (
    text.includes('himachal') ||
    text.includes('shimla') ||
    text.includes('manali') ||
    text.includes('kasol') ||
    text.includes('dharamshala') ||
    text.includes('uttarakhand') ||
    text.includes('rishikesh') ||
    text.includes('mussoorie') ||
    text.includes('nainital') ||
    text.includes('ladakh') ||
    text.includes('leh')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-214 (Leh Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-214', time: '06:30 AM ➔ 07:55 AM', duration: '1h 25m', priceUSD: 72, bag: '15kg Check-in', class: 'Economy Choice', originDest: `DEL ➔ IXL (Leh)` },
        { title: 'Alliance Air 9I-801 (Kullu / Manali Direct)', carrier: 'Alliance Air', type: 'Flight', code: '9I-801', time: '07:45 AM ➔ 09:10 AM', duration: '1h 25m', priceUSD: 85, bag: '15kg Check-in', class: 'Economy Flex', originDest: `DEL ➔ KUU` }
      ],
      realTrains: [
        { title: 'Kalka-Shimla Toy Train #52453', carrier: 'Northern Railway Heritage', type: 'Train', code: '52453', time: '06:20 AM ➔ 11:35 AM', duration: '5h 15m (UNESCO Heritage)', priceUSD: 7, seats: 'Open First Class', class: 'Heritage Shivalik Deluxe' },
        { title: 'Vande Bharat Dehradun #22457', carrier: 'Northern Railway Vande Bharat', type: 'Train', code: '22457', time: '05:50 AM ➔ 10:35 AM', duration: '4h 45m', priceUSD: 22, seats: '28 Available', class: 'AC Executive Chair Car (EC)' }
      ],
      realBuses: [
        { title: 'HPTDC Volvo AC Coach Shimla / Manali', carrier: 'HPTDC Himachal', type: 'Bus', code: 'HP-101', time: '08:30 PM ➔ 07:00 AM (+1)', duration: '10h 30m', priceUSD: 16, seats: '14 Available', class: 'AC Multi-Axle Volvo' }
      ],
      realHotels: [
        { title: 'Wildflower Hall Shimla (Oberoi)', rating: '⭐ 4.9 (2,750 reviews)', loc: 'Charabra · Shimla, Himachal', priceUSD: 310, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Himalayan Peak Views', 'Heated Outdoor Whirlpool', 'Pine Forest Trails'] },
        { title: 'Ananda in the Himalayas Rishikesh', rating: '⭐ 4.9 (2,300 reviews)', loc: 'Palace Estate · Narendra Nagar / Rishikesh', priceUSD: 350, img: 'https://images.unsplash.com/photo-1586041829158-b807759b407b', tags: ['Ganges Valley Overlook', 'Ayurveda Wellness Spa', 'Yoga Pavilion'] },
        { title: 'The Grand Dragon Ladakh', rating: '⭐ 4.8 (1,950 reviews)', loc: 'Old Road Sheynam · Leh, Ladakh', priceUSD: 185, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Stok Kangri Mountain View', 'Solar Heated Eco Rooms', 'Ladakhi Hospitality'] }
      ],
      realCabs: [
        { title: 'Himalayan Mountain Tour Innova SUV', type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 55, perKm: '₹20/km', feature: 'Innova Crysta for Mountain Pass, Rohtang & Valley Sightseeing' }
      ]
    };
  }

  // VARANASI / AYODHYA / UTTAR PRADESH
  if (
    text.includes('varanasi') ||
    text.includes('kashi') ||
    text.includes('ayodhya') ||
    text.includes('lucknow') ||
    text.includes('prayagraj')
  ) {
    return {
      realFlights: [
        { title: 'IndiGo Airlines 6E-2201 (Varanasi Direct)', carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-2201', time: '07:10 AM ➔ 08:35 AM', duration: '1h 25m', priceUSD: 48, bag: '15kg Check-in', class: 'Economy Choice', originDest: `${hCity} ➔ VNS` },
        { title: 'Air India AI-431 (Ayodhya Direct)', carrier: 'Air India', type: 'Flight', code: 'AI-431', time: '10:15 AM ➔ 11:40 AM', duration: '1h 25m', priceUSD: 52, bag: '25kg Check-in', class: 'Economy Flex', originDest: `DEL ➔ AYJ` }
      ],
      realTrains: [
        { title: 'Vande Bharat Varanasi Express #22436', carrier: 'Northern Railway Vande Bharat', type: 'Train', code: '22436', time: '06:00 AM ➔ 02:00 PM', duration: '8h 00m', priceUSD: 25, seats: '22 Available', class: 'AC Executive Chair Car (EC)' }
      ],
      realBuses: [
        { title: 'UPSRTC AC Janrath Sleeper', carrier: 'UPSRTC Uttar Pradesh', type: 'Bus', code: 'UP-102', time: '09:00 PM ➔ 05:00 AM (+1)', duration: '8h 00m', priceUSD: 11, seats: '16 Available', class: 'AC Sleeper 2+1' }
      ],
      realHotels: [
        { title: 'BrijRama Palace Varanasi', rating: '⭐ 4.9 (2,140 reviews)', loc: 'Darbhanga Ghat · Ganges Waterfront, Varanasi', priceUSD: 270, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['Ganges Ghat Front', 'Private Bajra Boat Access', 'Live Sitar Performance'] },
        { title: 'Taj Ganges Varanasi', rating: '⭐ 4.8 (2,610 reviews)', loc: 'Nadesar Palace Grounds · Varanasi', priceUSD: 160, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['12-Acre Mango Orchards', 'Kashi Vishwanath Shuttle', 'Classical Concerts'] },
        { title: 'The Park Inn by Radisson Ayodhya', rating: '⭐ 4.8 (1,450 reviews)', loc: 'Ram Path · Ayodhya', priceUSD: 120, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Ram Mandir Precinct', 'Pure Veg Dining', 'Temple Concierge'] }
      ],
      realCabs: [
        { title: 'Varanasi Ghats & Sarnath Sedan Cab', type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 22, perKm: '₹14/km', feature: 'AC Dzire for Ganga Aarti Ghats & Sarnath Deer Park' }
      ]
    };
  }

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

  // DYNAMIC FALLBACK FOR ANY PROMPT STATE OR CITY
  let rawName = destName && destName !== 'Destination' ? destName : promptText || 'Destination';
  rawName = rawName.replace(/trip|itinerary|tour|vacation|plan|days|day|\d+/gi, '').trim();
  const dName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Destination';

  return {
    realFlights: isHomeIndia ? [
      { title: `IndiGo Express 6E-408 (${dName})`, carrier: 'IndiGo Airlines', type: 'Flight', code: '6E-408', time: '06:15 AM ➔ 08:30 AM', duration: '2h 15m', priceUSD: 62, bag: '15kg Included', class: 'Economy Standard', originDest: `${hCity} ➔ ${dName}` },
      { title: `Air India Direct AI-802`, carrier: 'Air India', type: 'Flight', code: 'AI-802', time: '10:40 AM ➔ 01:10 PM', duration: '2h 30m', priceUSD: 78, bag: '25kg Included', class: 'Economy Flex', originDest: `DEL ➔ ${dName}` }
    ] : [
      { title: `Global Express DL-204`, carrier: 'Delta Air Lines', type: 'Flight', code: 'DL-204', time: '06:15 AM ➔ 08:30 AM', duration: '2h 15m', priceUSD: 185, bag: '23kg Included', class: 'Economy Standard', originDest: `${hCity} (${hCountry}) ➔ ${dName}` },
      { title: `United Airlines UA-542`, carrier: 'United Airlines', type: 'Flight', code: 'UA-542', time: '10:40 AM ➔ 01:10 PM', duration: '2h 30m', priceUSD: 210, bag: '23kg Included', class: 'Economy Flex', originDest: `${hCountry} ➔ ${dName}` }
    ],
    realTrains: isHomeIndia ? [
      { title: `${dName} Vande Bharat Express #20608`, carrier: 'Indian Railways Vande Bharat', type: 'Train', code: '20608', time: '05:50 AM ➔ 11:30 AM', duration: '5h 40m', priceUSD: 22, seats: '42 Available', class: 'AC Executive Chair Car (EC)' },
      { title: `${dName} Superfast Express #12432`, carrier: 'Indian Railways', type: 'Train', code: '12432', time: '04:30 PM ➔ 06:15 AM (+1)', duration: '13h 45m', priceUSD: 15, seats: '38 Available', class: '2nd AC Tier (2A)' }
    ] : [
      { title: `${dName} Express Rail #20608`, carrier: 'National Rail Express', type: 'Train', code: '20608', time: '05:50 AM ➔ 12:30 PM', duration: '6h 40m', priceUSD: 38, seats: '42 Available', class: '1st Class Express' }
    ],
    realBuses: [
      { title: `${dName} IntrCity SmartBus AC Volvo`, carrier: 'IntrCity SmartBus', type: 'Bus', code: 'SB-804', time: '10:30 PM ➔ 06:00 AM (+1)', duration: '7h 30m', priceUSD: 14, seats: '14 Sleepers Available', class: 'AC Sleeper 2+1' }
    ],
    realHotels: [
      { title: `Taj Palace & Heritage Resort ${dName}`, rating: '⭐ 4.9 (2,480 reviews)', loc: `City Promenade & Heritage Precinct · ${dName}`, priceUSD: 175, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', tags: ['5-Star Heritage Luxury', 'Rooftop Infinity Pool', 'Fine Dining Restaurant'] },
      { title: `Radisson Blu Luxury Suites ${dName}`, rating: '⭐ 4.8 (1,850 reviews)', loc: `Financial & Business District · ${dName}`, priceUSD: 135, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', tags: ['Executive Club Lounge', 'Free Breakfast & WiFi', 'Luxury Spa'] },
      { title: `The Fern Eco-Resort & Spa ${dName}`, rating: '⭐ 4.7 (1,340 reviews)', loc: `Scenic Nature Belt · ${dName}`, priceUSD: 95, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', tags: ['Eco-Friendly Retreat', 'Organic Garden Dining', 'Local Sightseeing Desk'] },
      { title: `Marriott Courtyard Hotel ${dName}`, rating: '⭐ 4.8 (1,620 reviews)', loc: `Landmark Zone · ${dName}`, priceUSD: 120, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', tags: ['Central Location', 'Outdoor Pool', '24/7 Fitness Center'] }
    ],
    realCabs: [
      { title: `${dName} Airport Sedan Cab Transfer`, type: 'Cab Sedan', capacity: '4 Seats · 2 Bags', priceUSD: 24, perKm: '₹14/km', feature: `AC Dzire for ${dName} Airport & Local Sightseeing` },
      { title: `${dName} Luxury SUV Tour Chauffeur`, type: 'Cab SUV', capacity: '6 Seats · 4 Bags', priceUSD: 45, perKm: '₹19/km', feature: `Innova Crysta SUV for ${dName} Outstation & Sightseeing` }
    ]
  };
}

