function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanText(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeStop(stop, stopIndex, dayNumber) {
  return {
    id: cleanText(stop?.id, createId(`day-${dayNumber}-stop-${stopIndex + 1}`)),
    name: cleanText(stop?.name, `Stop ${stopIndex + 1}`),
    time: cleanText(stop?.time, 'Flexible timing'),
    category: cleanText(stop?.category, 'Sightseeing'),
    description: cleanText(stop?.description, 'A featured tourist attraction to visit.'),
    notes: cleanText(stop?.notes, 'Best visited during open hours.'),
    image: typeof stop?.image === 'string' && stop.image.trim() ? stop.image.trim() : undefined
  };
}

function normalizeDay(day, dayIndex) {
  const stops = Array.isArray(day?.stops) ? day.stops : [];
  return {
    id: cleanText(day?.id, createId(`day-${dayIndex + 1}`)),
    title: cleanText(day?.title, `Day ${dayIndex + 1}: Sightseeing Tour`),
    focus: cleanText(day?.focus, 'Key Landmarks & Tourist Attractions'),
    overview: cleanText(day?.overview, 'Explore top-rated tourist places to visit today.'),
    expanded: dayIndex === 0,
    stops: stops.map((stop, stopIndex) => normalizeStop(stop, stopIndex, dayIndex + 1))
  };
}

export function normalizeItinerary(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The model output must be a JSON object.');
  }

  const days = Array.isArray(value.days) ? value.days : [];
  if (!days.length) {
    throw new Error('The model output did not include any days.');
  }

  const normalizedDays = days.map((day, dayIndex) => normalizeDay(day, dayIndex));
  const stopCount = normalizedDays.reduce((count, day) => count + day.stops.length, 0);

  if (!stopCount) {
    throw new Error('The itinerary did not include any stops.');
  }

  return {
    id: cleanText(value.id, createId('itinerary')),
    tripTitle: cleanText(value.tripTitle, 'Trip Itinerary'),
    destination: cleanText(value.destination, 'Destination'),
    summary: cleanText(value.summary, 'A complete day-by-day tourist places schedule.'),
    days: normalizedDays
  };
}

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function inferDestination(requestText) {
  if (typeof requestText !== 'string' || !requestText.trim()) return 'Your Destination';
  const text = requestText.trim();

  const toMatch = text.match(/\bto\s+([A-Za-z\s,'-]+?)(?:\bfor\b|\bwith\b|\bin\b|\bnext\b|\bthis\b|\bfrom\b|[.,;!$]|$)/i);
  if (toMatch?.[1]?.trim()) {
    const res = toMatch[1].replace(/\b(trip|itinerary|vacation|tour|plan)\b/gi, '').trim();
    if (res.length > 1) return capitalizeWords(res);
  }

  const visitMatch = text.match(/\bvisit\s+([A-Za-z\s,'-]+?)(?:[.,;!$]|\s+with\b|\s+for\b|\s+in\b|\s+next\b|$)/i);
  if (visitMatch?.[1]?.trim()) {
    const res = visitMatch[1].replace(/\b(trip|itinerary|vacation|tour|plan)\b/gi, '').trim();
    if (res.length > 1) return capitalizeWords(res);
  }

  const tripMatch = text.match(/\b([A-Za-z\s,'-]+?)\s+(?:trip|tour|itinerary|vacation|plan)\b/i);
  if (tripMatch?.[1]?.trim()) {
    const res = tripMatch[1].replace(/^\d+[- ]*day\s*/i, '').replace(/^(a|an|the)\s+/i, '').trim();
    if (res.length > 1) return capitalizeWords(res);
  }

  const words = text
    .replace(/^\d+[- ]*day\s*/i, '')
    .replace(/\b(a|an|the|trip|itinerary|vacation|tour|plan|for|days|day)\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length > 0) {
    return capitalizeWords(words.slice(0, 3).join(' '));
  }

  return 'Your Destination';
}

function inferTripStyle(requestText) {
  const lower = requestText.toLowerCase();
  if (lower.includes('food')) return 'Culinary & Sightseeing';
  if (lower.includes('family')) return 'Family Sightseeing';
  if (lower.includes('romantic')) return 'Romantic Sightseeing';
  if (lower.includes('outdoor') || lower.includes('hike')) return 'Outdoor Adventure';
  if (lower.includes('budget')) return 'Budget Tourist';
  return 'Sightseeing & Culture';
}

export function inferDayCount(requestText) {
  if (typeof requestText !== 'string') return 4;
  const match = requestText.match(/(\d+)\s*[- ]?day/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 100) return num;
  }
  return 4;
}

const PRESET_DESTINATIONS_DATA = {
  tamilnadu: {
    name: 'Tamil Nadu',
    title: '10-Day Tamil Nadu Grand Temple & Heritage Circuit',
    summary: 'A complete 10-day cultural journey across Tamil Nadu exploring Chennai Kapaleeshwarar Temple, Mahabalipuram Shore Temple, Thanjavur Brihadisvara Temple, Madurai Meenakshi Amman Temple, Rameshwaram, and Kanyakumari.',
    days: [
      {
        title: 'Day 1: Chennai Heritage & Marina Beach Promenade',
        focus: 'Kapaleeshwarar Temple & Marina Beach',
        overview: 'Explore 7th-century Dravidian temple architecture and India’s longest natural urban beach.',
        stops: [
          { name: 'Kapaleeshwarar Temple Mylapore', time: '08:30 AM', category: 'Pilgrimage & Architecture', description: 'Marvel at the rainbow-colored 120-ft Gopuram tower dedicated to Lord Shiva.', notes: 'Remove footwear before entering sacred inner precincts.' },
          { name: 'Government Museum Chennai & Bronze Gallery', time: '11:30 AM', category: 'Culture & Art', description: 'See ancient Chola bronze idols of Nataraja and archaeological artifacts.', notes: 'India’s second oldest museum established in 1851.' },
          { name: 'San Thome Cathedral Basilica', time: '03:00 PM', category: 'Heritage', description: 'Visit the neo-Gothic white cathedral built over the tomb of St. Thomas Apostle.', notes: 'Includes museum showcasing ancient Roman coins.' },
          { name: 'Marina Beach Sunset Walk & Lighthouse', time: '05:30 PM', category: 'Sightseeing', description: 'Stroll the 13-km sandy coast and ascend Chennai Lighthouse for ocean views.', notes: 'Try fresh sundal and Murukku snacks.' }
        ]
      },
      {
        title: 'Day 2: Mahabalipuram Shore Temples & Monolithic Rathas',
        focus: 'Shore Temple, Pancha Rathas & Arjuna’s Penance',
        overview: 'Discover UNESCO World Heritage 7th-century Pallava rock-cut monuments.',
        stops: [
          { name: 'Mahabalipuram Shore Temple Complex', time: '08:30 AM', category: 'Heritage & UNESCO', description: 'Stand beside the ancient structural stone temple facing the roaring Bay of Bengal.', notes: 'Over 1,400 years old built by King Rajasimha.' },
          { name: 'Pancha Rathas Five Monolithic Chariots', time: '11:00 AM', category: 'Architecture', description: 'Marvel at 5 monolith chariot temples carved out of single granite boulders.', notes: 'Includes life-sized stone elephant sculpture.' },
          { name: 'Arjuna’s Penance & Krishna’s Butterball', time: '02:30 PM', category: 'Sightseeing', description: 'View the massive open-air relief carving and 250-ton natural balanced boulder.', notes: 'Famous physics-defying photo spot.' }
        ]
      },
      {
        title: 'Day 3: Kanchipuram Silk Weaving & Ancient Shrines',
        focus: 'Kamakshi Amman Temple & Handloom Silk Heritage',
        overview: 'Visit the City of 1,000 Temples famous for spiritual energy and Kanjivaram silk sarees.',
        stops: [
          { name: 'Sri Kamakshi Amman Temple Kanchipuram', time: '08:30 AM', category: 'Pilgrimage', description: 'Seek divine blessings at one of the 51 Shakti Peethas featuring golden sanctuary dome.', notes: 'Attend morning Lalitha Sahasranama chanting.' },
          { name: 'Kailasanathar Temple 7th Century Sandstone Arc', time: '11:30 AM', category: 'Heritage', description: 'Explore Kanchipuram’s oldest temple with 58 carved sub-shrines.', notes: 'Stunning Pallava stone carving details.' },
          { name: 'Kanchipuram Silk Weavers Cooperative Society', time: '02:30 PM', category: 'Culture & Shopping', description: 'Watch traditional handloom weavers interlace pure mulberry silk and gold zari thread.', notes: 'Buy certified Kanjivaram silk sarees directly.' }
        ]
      },
      {
        title: 'Day 4: Pondicherry French Quarter Promenade',
        focus: 'White Town Promenade, Aurobindo Ashram & Matrimandir',
        overview: 'Experience yellow French colonial villas, serene ashrams, and coastal promenades.',
        stops: [
          { name: 'Sri Aurobindo Ashram Peaceful Sanctuary', time: '09:00 AM', category: 'Culture & Peace', description: 'Visit the quiet flower-decked Samadhi shrine of Sri Aurobindo and The Mother.', notes: 'Maintain silence inside the courtyard.' },
          { name: 'Matrimandir Golden Dome Viewpoint (Auroville)', time: '11:30 AM', category: 'Sightseeing', description: 'View the 100-foot golden geodesic sphere representing human unity.', notes: 'Access pass available at Auroville Information Centre.' },
          { name: 'Pondicherry Promenade Beach Walk & French Cafes', time: '04:30 PM', category: 'Dining & Sightseeing', description: 'Stroll past French consulate buildings, Gandhi statue, and oceanfront cafes.', notes: 'Taste French crêpes and artisanal croissants.' }
        ]
      },
      {
        title: 'Day 5: Chidambaram Nataraja Temple & Pichavaram Mangroves',
        focus: 'Chidambaram Temple & Pichavaram Boat Safari',
        overview: 'Visit the Akasa Lingam cosmic dance temple and world’s second largest mangrove forest.',
        stops: [
          { name: 'Chidambaram Thillai Nataraja Temple', time: '08:30 AM', category: 'Pilgrimage', description: 'Darshan at the ancient temple celebrating Lord Shiva’s Ananda Tandava cosmic dance.', notes: 'Features 108 Bharatnatyam dance posture carvings.' },
          { name: 'Pichavaram Mangrove Forest Boat Safari', time: '01:30 PM', category: 'Nature & Adventure', description: 'Row through narrow green canopy water tunnels surrounded by 4,400 mangrove islets.', notes: 'Spot rare migratory egrets and kingfishers.' }
        ]
      },
      {
        title: 'Day 6: Thanjavur Great Living Chola Temple',
        focus: 'Brihadisvara Temple & Thanjavur Palace Museum',
        overview: 'Stand before King Raja Raja Chola’s 216-foot granite vimana tower built in 1010 AD.',
        stops: [
          { name: 'Brihadisvara Temple (Big Temple Thanjavur)', time: '08:30 AM', category: 'UNESCO & Architecture', description: 'Marvel at the 80-ton single block granite cupola and massive monolithic Nandi bull.', notes: 'The shadow of the main tower never falls on the ground at noon.' },
          { name: 'Thanjavur Royal Palace & Maratha Nayak Museum', time: '11:30 AM', category: 'Heritage', description: 'Explore the bell tower, Saraswathi Mahal Library, and Chola bronze art gallery.', notes: 'Houses 400-year-old palm leaf manuscripts.' },
          { name: 'Thanjavur Art Plate & Dancing Doll Workshop', time: '03:30 PM', category: 'Culture', description: 'Watch artisans craft brass-copper decorative plates and nodding terracotta dolls.', notes: 'GI-tagged local handicraft souvenir.' }
        ]
      },
      {
        title: 'Day 7: Madurai Meenakshi Amman Temple Gopurams',
        focus: 'Meenakshi Amman Temple & Thirumalai Nayakkar Palace',
        overview: 'Explore the 2,500-year-old cultural capital of Tamil Nadu with 14 soaring temple towers.',
        stops: [
          { name: 'Madurai Meenakshi Sundareswarar Temple', time: '08:00 AM', category: 'Pilgrimage & Heritage', description: 'Stroll the Hall of 1,000 Pillars and admire 33,000 colorful stone sculptures.', notes: 'Sacred Golden Lotus Tank inside the temple.' },
          { name: 'Thirumalai Nayakkar Palace Stucco Pillars', time: '12:00 PM', category: 'Architecture', description: 'Walk through 82-foot high white stucco pillars built by King Thirumalai Nayak in 1636.', notes: 'Combines Dravidian and Islamic architectural styles.' },
          { name: 'Madurai Night Food Tour & Jigarthanda Drink', time: '06:30 PM', category: 'Dining', description: 'Savor famous Madurai bun parotta, kari dosa, and refreshing chilled Jigarthanda.', notes: 'Visit Famous Famous Jigarthanda stall.' }
        ]
      },
      {
        title: 'Day 8: Rameshwaram Holy Island & Pamban Sea Bridge',
        focus: 'Ramanathaswamy Temple 22 Wells & Pamban Bridge',
        overview: 'Cross the sea bridge to the holy island connected to Ramayana legends.',
        stops: [
          { name: 'Pamban Railway Sea Bridge Viewpoint', time: '08:00 AM', category: 'Engineering & Sightseeing', description: 'See India’s historic 2-km railway bridge cantilevered across the Indian Ocean.', notes: 'Great photo spot as trains cross the sea.' },
          { name: 'Sri Ramanathaswamy Temple 22 Holy Tirthas Bathing', time: '10:00 AM', category: 'Pilgrimage', description: 'Walk the world’s longest 4,000-foot pillared corridor and bathe in 22 sacred wells.', notes: 'Believed to cleanse all past karma.' },
          { name: 'Dhanushkodi Ghost Town & APJ Abdul Kalam Memorial', time: '03:00 PM', category: 'Sightseeing', description: 'Visit the tip of India where Bay of Bengal meets Indian Ocean at Ram Setu point.', notes: 'Visit Dr. APJ Abdul Kalam’s inspiring memorial.' }
        ]
      },
      {
        title: 'Day 9: Kanyakumari Southern Tip & Rock Memorial',
        focus: 'Vivekananda Rock Memorial, Thiruvalluvar Statue & Sunset',
        overview: 'Stand at the southernmost tip of mainland India where three seas converge.',
        stops: [
          { name: 'Vivekananda Rock Memorial Ferry & Statue', time: '08:30 AM', category: 'Heritage & Pilgrimage', description: 'Take the ferry to the sea rock island where Swami Vivekananda meditated in 1892.', notes: 'Stands adjacent to the 133-foot Thiruvalluvar statue.' },
          { name: 'Kanyakumari Devi Temple Triveni Sangam', time: '12:00 PM', category: 'Pilgrimage', description: 'Visit the 3,000-year-old virgin goddess temple at the confluence of 3 oceans.', notes: 'Famous diamond nose ring of the deity glows out to sea.' },
          { name: 'Triveni Sangam Sunset Point', time: '05:30 PM', category: 'Nature & Sightseeing', description: 'Watch the sun set into the Arabian Sea while moon rises over Bay of Bengal.', notes: 'Unique phenomenon on full moon evenings.' }
        ]
      },
      {
        title: 'Day 10: Ooty Nilgiri Mountain Toy Train & Gardens',
        focus: 'Nilgiri Mountain Railway Toy Train & Ooty Botanical Garden',
        overview: 'Conclude your Tamil Nadu tour amidst cool Nilgiri mist mountains and pine valleys.',
        stops: [
          { name: 'Nilgiri Mountain Railway Heritage Toy Train', time: '09:00 AM', category: 'Heritage Railway', description: 'Ride the steam-powered UNESCO toy train across 208 bridges and 16 tunnels.', notes: 'Offers breathtaking cliffside Nilgiri views.' },
          { name: 'Government Botanical Gardens Ooty', time: '01:30 PM', category: 'Nature', description: 'Stroll 55 acres of terraced flower lawns, 20-million-year-old fossilized tree trunk, and orchid houses.', notes: 'Dine at Ooty’s historic mountain cafes.' }
        ]
      }
    ]
  },
  kerala: {
    name: 'Kerala',
    title: '10-Day Kerala Backwaters, Tea Hills & Beach Paradise',
    summary: 'A complete 10-day tropical journey exploring Fort Kochi beaches, Munnar tea hills, Alleppey luxury houseboat backwaters cruise, Varkala cliff beach, and Trivandrum.',
    days: [
      {
        title: 'Day 1: Fort Kochi Heritage & Chinese Fishing Nets',
        focus: 'Chinese Fishing Nets, St. Francis Church & Mattancherry Palace',
        overview: 'Explore 500 years of Portuguese, Dutch, and British colonial coastal trade heritage.',
        stops: [
          { name: 'Fort Kochi Chinese Fishing Nets Waterfront', time: '09:00 AM', category: 'Sightseeing', description: 'Watch fishermen operate massive 14th-century bamboo cantilever fishing nets.', notes: 'Best photo ops during high tide.' },
          { name: 'St. Francis Church & Vasco da Gama Burial Shrine', time: '11:30 AM', category: 'Heritage', description: 'Visit India’s oldest European church built in 1503 where explorer Vasco da Gama was buried.', notes: 'Original timber fans still hanging from roof.' },
          { name: 'Mattancherry Dutch Palace & Jew Town Synagogue', time: '02:30 PM', category: 'Culture', description: 'Admire Ramayana mythological murals and 1568 Paradesi Synagogue with Belgian crystal chandeliers.', notes: 'Shop for antique spice boxes and brass oil lamps.' }
        ]
      },
      {
        title: 'Day 2: Munnar KDHP Tea Plantation & Museum Tour',
        focus: 'KDHP Tea Museum & Rolling Green Hills',
        overview: 'Ascend to 5,200 feet altitude surrounded by 120,000 acres of tea plantations.',
        stops: [
          { name: 'KDHP Tea Museum & Factory Processing Tour', time: '10:00 AM', category: 'Culture & Taste', description: 'Watch tea leaf plucking, CTC roasting, and taste single-estate black and green teas.', notes: 'Buy freshly packed Munnar Orthodox tea.' },
          { name: 'Attukad Waterfall & Tea Garden Trek', time: '02:00 PM', category: 'Nature', description: 'Trek along cascading mountain waterfalls framed by emerald tea bush slopes.', notes: 'Wear comfortable walking shoes.' }
        ]
      },
      {
        title: 'Day 3: Munnar Mattupetty Dam & Echo Point Mist Peaks',
        focus: 'Mattupetty Speedboat & Kundala Lake Boating',
        overview: 'Cruise high altitude mountain reservoirs and hear natural mountain echo reverberations.',
        stops: [
          { name: 'Mattupetty Dam Speedboat Ride', time: '09:30 AM', category: 'Outdoor & Boating', description: 'Speed across the turquoise mountain lake reservoir surrounded by pine forests.', notes: 'Wild elephants often gather on far shores.' },
          { name: 'Echo Point Natural Sound Amphitheater', time: '12:30 PM', category: 'Sightseeing', description: 'Shout your name across the mountain valley to hear clear three-fold natural echoes.', notes: 'Sample hot spiced cardamom tea.' }
        ]
      },
      {
        title: 'Day 4: Eravikulam National Park Nilgiri Tahr Sanctuary',
        focus: 'Rajamalai Peak & Anamudi Mountain View',
        overview: 'Spot the endangered mountain goat species and view South India’s highest peak.',
        stops: [
          { name: 'Eravikulam National Park Safari Bus', time: '08:30 AM', category: 'Wildlife & Nature', description: 'Take the eco-bus up Rajamalai hill to spot Nilgiri Tahr wild goats grazing on mountain edges.', notes: 'Pre-book online park entry tickets.' },
          { name: 'Anamudi Peak Lookout (8,841 ft)', time: '11:30 AM', category: 'Sightseeing', description: 'View South India’s highest summit towering over misty shola grasslands.', notes: 'Neelakurinji flowers bloom every 12 years here.' }
        ]
      },
      {
        title: 'Day 5: Thekkady Periyar Wildlife Boat Safari',
        focus: 'Periyar Lake Wildlife Cruise & Spice Plantation Walk',
        overview: 'Explore India’s premier elephant and tiger sanctuary around Periyar lake.',
        stops: [
          { name: 'Periyar National Park Lake Boat Safari', time: '07:30 AM', category: 'Wildlife Safari', description: 'Cruise Periyar Lake to spot wild elephant herds, sambar deer, and Indian bison coming to drink.', notes: 'Early morning 07:30 boat has highest wildlife sightings.' },
          { name: 'Organic Spice Plantation Guided Walk', time: '01:30 PM', category: 'Nature & Taste', description: 'Walk past green cardamom vines, black pepper trees, cinnamon bark, and vanilla pods.', notes: 'Buy fresh organic spices directly from estate shops.' }
        ]
      },
      {
        title: 'Day 6: Alleppey Houseboat Backwater Cruise',
        focus: 'Luxury Kettuvallam Houseboat & Vembanad Lake',
        overview: 'Board an authentic thatched wooden houseboat cruising palm-fringed Kerala canals.',
        stops: [
          { name: 'Alleppey Kettuvallam Houseboat Check-in', time: '12:00 PM', category: 'Luxury Cruise', description: 'Board your private AC air-conditioned houseboat with personal chef and captain.', notes: 'Includes freshly cooked Karimeen pollichathu lunch.' },
          { name: 'Kuttanad Backwater Canals & Paddy Field Cruise', time: '02:30 PM', category: 'Sightseeing', description: 'Glide through narrow village palm canals where farming is done below sea level.', notes: 'Sunset over Vembanad Lake waters.' }
        ]
      },
      {
        title: 'Day 7: Kumarakom Bird Sanctuary & Vembanad Sunset',
        focus: 'Kumarakom Bird Sanctuary & Sunset Cruise',
        overview: 'Explore 14 acres of lush mangrove bird habitats on Vembanad Lake shores.',
        stops: [
          { name: 'Kumarakom Bird Sanctuary Forest Walk', time: '08:00 AM', category: 'Bird Watching', description: 'Spot migratory Siberian storks, herons, egrets, and darters along shaded canopy trails.', notes: 'Hire local forest guide with spotting scope.' },
          { name: 'Vembanad Lake Sunset Speedboat Cruise', time: '05:00 PM', category: 'Sightseeing', description: 'Watch coconut palms sway along the horizon during golden hour lake cruises.', notes: 'Dine at Kumarakom Lake Resort waterfront.' }
        ]
      },
      {
        title: 'Day 8: Varkala Red Cliff Beach & Mineral Springs',
        focus: 'Varkala Cliff Beach & Janardhanaswamy Temple',
        overview: 'Relax atop 80-foot dramatic red laterite ocean cliffs overlooking Arabian Sea.',
        stops: [
          { name: 'Varkala North Cliff Boardwalk & Beach', time: '09:00 AM', category: 'Beach & Outdoor', description: 'Walk cliffside pathways lined with bohemian cafes, yoga studios, and sea view lounges.', notes: 'Swim at Papanasam Beach famous for holy cleansing springs.' },
          { name: 'Janardhanaswamy 2,000-Year Ancient Temple', time: '04:00 PM', category: 'Pilgrimage', description: 'Visit the historic Lord Vishnu temple known as the Benares of the South.', notes: 'Located near the cliff entrance.' }
        ]
      },
      {
        title: 'Day 9: Kovalam Lighthouse Beach & Poovar Island',
        focus: 'Kovalam Crescent Beach & Poovar Mangrove Estuary',
        overview: 'Visit Kerala’s most famous crescent lighthouse beach and floating mangroves.',
        stops: [
          { name: 'Kovalam Lighthouse Beach & Vizhinjam Tower', time: '09:00 AM', category: 'Sightseeing', description: 'Climb the 118-foot red-and-white striped lighthouse tower for sweeping ocean views.', notes: 'Great surfing and coastal walks.' },
          { name: 'Poovar Island Backwater & Estuary Boat Cruise', time: '02:30 PM', category: 'Nature Cruise', description: 'Cruise through dense mangrove tunnels where river, lake, and sea converge.', notes: 'Visit golden sand beach spit separating river and ocean.' }
        ]
      },
      {
        title: 'Day 10: Trivandrum Padmanabhaswamy Temple & Royal Palace',
        focus: 'Sree Padmanabhaswamy Temple & Kuthira Malika Palace',
        overview: 'Conclude your Kerala trip exploring the richest temple in the world.',
        stops: [
          { name: 'Sree Padmanabhaswamy Temple Sanctuary', time: '08:30 AM', category: 'Heritage & Pilgrimage', description: 'Admire the 100-foot stone Gopuram of the world-famous golden Ananthasayanan Vishnu temple.', notes: 'Strict traditional dhoti attire required.' },
          { name: 'Kuthira Malika (Mansion of Horses) Palace', time: '11:30 AM', category: 'Culture', description: 'Tour the Travancore royal palace carved with 122 wooden horses and royal thrones.', notes: 'Constructed from teakwood, rosewood, and marble.' }
        ]
      }
    ]
  },
  kashmir: {
    name: 'Kashmir',
    title: '10-Day Kashmir Paradise Explorer Circuit',
    summary: 'A complete 10-day mountain paradise journey visiting Srinagar Dal Lake Shikara rides, Mughal Gardens, Gulmarg Gondola snow peaks, Pahalgam valleys, and Sonamarg glaciers.',
    days: [
      {
        title: 'Day 1: Srinagar Dal Lake Shikara Ride & Floating Market',
        focus: 'Dal Lake Wooden Shikara & Floating Bazaar',
        overview: 'Glide across mirror-like Himalayan waters in handcrafted cedarwood Shikara boats.',
        stops: [
          { name: 'Dal Lake Wooden Shikara Sunset Cruise', time: '09:00 AM', category: 'Sightseeing & Culture', description: 'Relax on cushioned Shikara boats passing houseboats, lotus gardens, and Zabarwan hills.', notes: 'Try hot Kashmiri Kahwa green tea with saffron on board.' },
          { name: 'Dal Lake Floating Vegetable Market', time: '06:00 AM', category: 'Culture', description: 'Witness local farmers trading fresh produce boat-to-boat at sunrise.', notes: 'Starts at 5:30 AM near Mir Bahri backwaters.' }
        ]
      },
      {
        title: 'Day 2: Shalimar Bagh & Nishat Bagh Mughal Gardens',
        focus: 'Shalimar Bagh, Nishat Bagh & Chashme Shahi',
        overview: 'Tour 17th-century terraced royal gardens designed by Mughal Emperor Jahangir.',
        stops: [
          { name: 'Shalimar Bagh Royal Mughal Garden', time: '09:30 AM', category: 'Heritage & Nature', description: 'Walk through 4 terraced levels with cascading fountains and chinar trees built in 1619.', notes: 'Built for Empress Noor Jahan.' },
          { name: 'Nishat Bagh (Garden of Pleasure)', time: '01:30 PM', category: 'Sightseeing', description: 'Stroll 12 garden terraces offering dramatic elevated views looking down over Dal Lake.', notes: 'Lined with 300-year-old giant Chinar trees.' }
        ]
      },
      {
        title: 'Day 3: Shankaracharya Hill Temple & Pari Mahal Overlook',
        focus: 'Shankaracharya Temple & Pari Mahal Palace',
        overview: 'Ascend Gopadri Hill for panoramic aerial views of Srinagar city and Dal Lake.',
        stops: [
          { name: 'Shankaracharya Shiva Hill Temple', time: '08:30 AM', category: 'Pilgrimage & View', description: 'Climb 243 stone steps to the 9th-century stone temple standing 1,000 feet above Srinagar.', notes: 'Mobile phones and cameras not allowed inside.' },
          { name: 'Pari Mahal (Palace of Fairies) Terraced Overlook', time: '01:30 PM', category: 'Heritage', description: 'Explore the 6-terraced Islamic astronomy school built by Prince Dara Shikoh in 1650.', notes: 'Spectacular sunset panorama over Srinagar.' }
        ]
      },
      {
        title: 'Day 4: Gulmarg Gondola Phase 1 Cable Car Ride',
        focus: 'Gulmarg Meadow & Phase 1 Kungdoor (10,050 ft)',
        overview: 'Ride the world’s second highest cable car into pine forests and alpine meadows.',
        stops: [
          { name: 'Gulmarg Gondola Phase 1 to Kungdoor Station', time: '09:00 AM', category: 'Cable Car & View', description: 'Ascend in 6-seater glass gondolas over pine forests to Kungdoor meadow station.', notes: 'Pre-book online tickets to skip queue.' },
          { name: 'Gulmarg Alpine Golf Course & St. Mary’s Church', time: '02:00 PM', category: 'Sightseeing', description: 'Walk through the 18-hole mountain golf course and Victorian stone church built in 1902.', notes: 'Rent mountain bicycles or ponies.' }
        ]
      },
      {
        title: 'Day 5: Gulmarg Gondola Phase 2 to Apharwat Snow Peak',
        focus: 'Apharwat Peak (13,780 ft) & Snow Sports',
        overview: 'Reach high altitude snow peaks near the Line of Control for skiing and snowmobiling.',
        stops: [
          { name: 'Apharwat Peak Snow Station (13,780 ft)', time: '09:00 AM', category: 'Snow Adventure', description: 'Step onto year-round snow summit offering views of Nanga Parbat mountain peak.', notes: 'Wear heavy winter coats, gloves, and snow boots.' },
          { name: 'Apharwat Snow Sledging & Snowmobile Ride', time: '01:00 PM', category: 'Adventure', description: 'Ride wooden sledges and snowmobiles down pristine white snow powder slopes.', notes: 'Guide charges negotiable on site.' }
        ]
      },
      {
        title: 'Day 6: Pahalgam Valley & Lidder River Walk',
        focus: 'Lidder River Trail & Saffron Fields Walk',
        overview: 'Travel to the Valley of Shepherds famous for gushing crystal Lidder river streams.',
        stops: [
          { name: 'Pampore Saffron Fields & Spice Center', time: '09:00 AM', category: 'Culture', description: 'Stop at the Saffron capital of India to see purple Crocus sativus flower fields.', notes: 'Buy certified Kashmiri Mongra Saffron.' },
          { name: 'Lidder River Bank Walk & Trout Fishing', time: '02:00 PM', category: 'Nature & Relax', description: 'Stroll along pine-shaded Lidder riverbanks and dip feet in icy snowmelt waters.', notes: 'Famous spot for mountain trout fishing.' }
        ]
      },
      {
        title: 'Day 7: Betaab Valley & Aru Village Base Camp',
        focus: 'Betaab Valley Pine Lawns & Aru Alpine Village',
        overview: 'Explore lush green film shooting meadows and alpine trek trailhead villages.',
        stops: [
          { name: 'Betaab Valley Pine Meadow Park', time: '09:30 AM', category: 'Sightseeing', description: 'Picnic beside turquoise streams in the valley named after the Bollywood film Betaab.', notes: 'Beautiful wooden footbridges for photos.' },
          { name: 'Aru Valley Alpine Village Pony Ride', time: '02:00 PM', category: 'Hiking & Nature', description: 'Travel 12 km up mountain roads to Aru village, starting point for Kolahoi Glacier treks.', notes: 'Ride local Pahalgam ponies across birch forests.' }
        ]
      },
      {
        title: 'Day 8: Sonamarg Meadow of Gold & Thajiwas Glacier',
        focus: 'Sonamarg & Thajiwas Glacier Sledging',
        overview: 'Visit the Golden Meadow on the historic Silk Route to Ladakh.',
        stops: [
          { name: 'Thajiwas Glacier Trek & Sledge Ride', time: '09:30 AM', category: 'Glacier Adventure', description: 'Trek or ride ponies 3 km up to the permanent white snow Thajiwas Glacier.', notes: 'Rent wooden snow sledges from local porters.' },
          { name: 'Sindh River Riverside Picnic', time: '02:30 PM', category: 'Nature', description: 'Relax beside roaring Sindh River rapids surrounded by fir trees and snow peaks.', notes: 'Popular whitewater rafting location.' }
        ]
      },
      {
        title: 'Day 9: Doodhpathri Valley of Milk',
        focus: 'Doodhpathri Meadows & Shaliganga River',
        overview: 'Discover an offbeat untouched valley with foaming white mountain streams.',
        stops: [
          { name: 'Doodhpathri (Valley of Milk) Rolling Lawns', time: '10:00 AM', category: 'Nature & Offbeat', description: 'Walk untouched green rolling hills where cows graze beside pristine pine forests.', notes: 'Less crowded than main tourist hubs.' },
          { name: 'Shaliganga River Cascade Walk', time: '02:00 PM', category: 'Sightseeing', description: 'Watch river waters surge over pebbles creating milk-like foam cascades.', notes: 'Peaceful spot for nature photography.' }
        ]
      },
      {
        title: 'Day 10: Srinagar Old City Heritage & Pashmina Bazaar',
        focus: 'Jamia Masjid Srinagar, Shah-e-Hamdan & Pashmina Market',
        overview: 'Conclude your Kashmir tour exploring 600-year-old wooden architecture and carpet weavers.',
        stops: [
          { name: 'Jamia Masjid Srinagar 378 Wooden Pillar Mosque', time: '09:30 AM', category: 'Heritage', description: 'Tour the 1394 Indo-Saracenic wooden mosque supported by 378 giant deodar trunk pillars.', notes: 'Peaceful internal fountain quadrangle.' },
          { name: 'Kashmiri Handloom Pashmina & Carpet Bazaar', time: '01:30 PM', category: 'Shopping', description: 'Watch master weavers knot silk carpets and hand-embroider fine Pashmina shawls.', notes: 'Look for GI quality authenticity seals.' }
        ]
      }
    ]
  },
  newyork: {
    name: 'New York',
    title: '10-Day New York City Tourist Attraction Circuit',
    summary: 'Explore all iconic NYC tourist places to visit: Times Square, Empire State Building, Statue of Liberty, Central Park, Metropolitan Museum of Art, Broadway, and Brooklyn Bridge.',
    days: [
      {
        title: 'Day 1: Times Square & Midtown Manhattan Landmarks',
        focus: 'Times Square, Broadway & Top of the Rock',
        overview: 'Experience the electric heart of NYC with world-famous neon marquees and sky-high observation decks.',
        stops: [
          { name: 'Times Square & Broadway Theater District', time: '09:00 AM', category: 'Sightseeing', description: 'Walk through the iconic neon billboard crossroads and Broadway theater street.', notes: 'Visit the red TKTS staircase for elevated views.' },
          { name: 'Grand Central Terminal & Whispering Gallery', time: '01:00 PM', category: 'Heritage', description: 'Admire the 1913 Beaux-Arts cathedral architecture and painted celestial ceiling.', notes: 'Check out the historic Oyster Bar.' },
          { name: 'Top of the Rock Observatory (Rockefeller Center)', time: '05:00 PM', category: 'Sightseeing', description: 'Ascend 70 floors for unobstructed sunset views of the Empire State Building.', notes: 'Pre-book timed sunset entry passes.' }
        ]
      },
      {
        title: 'Day 2: Empire State Building & Fifth Avenue',
        focus: 'Empire State Building & St. Patrick’s Cathedral',
        overview: 'Visit New York’s most famous 102-story landmark skyscraper and Fifth Avenue luxury row.',
        stops: [
          { name: 'Empire State Building 86th Floor Observatory', time: '08:30 AM', category: 'Sightseeing', description: 'Stand on the 360-degree open-air deck overlooking Manhattan skyscrapers.', notes: 'Early morning entry has zero waiting lines.' },
          { name: 'St. Patrick’s Cathedral Gothic Sanctuary', time: '12:00 PM', category: 'Culture', description: 'Tour the neo-Gothic Catholic cathedral featuring 330-foot spires and stained glass.', notes: 'Located directly across from Rockefeller Center.' },
          { name: 'Fifth Avenue Luxury Shopping & Saks Walk', time: '03:00 PM', category: 'Shopping', description: 'Stroll past Tiffany & Co., Bergdorf Goodman, and flagship storefront displays.', notes: 'Great afternoon pedestrian walk.' }
        ]
      },
      {
        title: 'Day 3: Central Park Landmarks & Bethesda Terrace',
        focus: 'Bethesda Terrace, Bow Bridge & Strawberry Fields',
        overview: 'Stroll through Manhattan’s 843-acre green sanctuary visiting famous film locations.',
        stops: [
          { name: 'Bethesda Terrace & Angel of the Waters Fountain', time: '09:30 AM', category: 'Nature & Outdoor', description: 'Marvel at the grand double staircase and arched tile ceiling overlooking the lake.', notes: 'Musicians perform acoustic music in the arcade.' },
          { name: 'Bow Bridge & Loeb Boathouse Rowboats', time: '01:00 PM', category: 'Sightseeing', description: 'Cross the romantic cast-iron bridge and rent a wooden rowboat on Central Park Lake.', notes: 'Iconic movie filming location.' },
          { name: 'Strawberry Fields John Lennon Memorial', time: '04:00 PM', category: 'Culture', description: 'Pay respect at the Imagine mosaic dedicated to John Lennon near the Dakota building.', notes: 'Quiet tree-shaded gathering spot.' }
        ]
      },
      {
        title: 'Day 4: Metropolitan Museum of Art (The Met)',
        focus: 'The Met Museum & Temple of Dendur',
        overview: 'Immerse yourself in 5,000 years of world art inside North America’s largest museum.',
        stops: [
          { name: 'The Met Great Hall & Egyptian Temple of Dendur', time: '10:00 AM', category: 'Culture & Art', description: 'See a real 15 BC Egyptian temple illuminated inside a glass atrium overlooking Central Park.', notes: 'Download The Met audio guide app.' },
          { name: 'European Paintings & Medieval Armor Hall', time: '01:30 PM', category: 'Art', description: 'Admire masterpieces by Monet, Rembrandt, Van Gogh, and medieval knight armor.', notes: 'Dine at The Met Cafe or Roof Garden.' },
          { name: 'The Met Roof Garden Overlook', time: '04:30 PM', category: 'Sightseeing', description: 'Sip cocktails while taking in rooftop views of the Central Park tree canopy skyline.', notes: 'Open seasonally from May to October.' }
        ]
      },
      {
        title: 'Day 5: Statue of Liberty & Ellis Island Harbor Ferry',
        focus: 'Statue of Liberty & Ellis Island Immigration Museum',
        overview: 'Cruise New York Harbor to visit America’s ultimate symbol of freedom.',
        stops: [
          { name: 'Statue of Liberty Pedestal & Museum Ferry', time: '08:30 AM', category: 'Heritage', description: 'Board the Statue City Cruises ferry from Battery Park to Liberty Island.', notes: 'Includes access to the Statue Museum and torch.' },
          { name: 'Ellis Island National Museum of Immigration', time: '12:30 PM', category: 'Heritage', description: 'Walk through the historic Great Hall where 12 million immigrants entered America.', notes: 'Search passenger registries at the American Immigrant Wall.' },
          { name: 'Battery Park Waterfront SeaGlass Carousel', time: '04:30 PM', category: 'Sightseeing', description: 'Ride the glowing nautical glass fish carousel overlooking the Harbor.', notes: 'Beautiful illuminated evening ride.' }
        ]
      },
      {
        title: 'Day 6: One World Observatory & 9/11 Memorial',
        focus: 'One World Trade Center & 9/11 Memorial Pools',
        overview: 'Visit the tallest building in the Western Hemisphere and honor 9/11 memory.',
        stops: [
          { name: 'National 9/11 Memorial Reflecting Pools', time: '09:00 AM', category: 'Culture & Reflection', description: 'Stand beside the giant twin cascading water pools set within original tower footprints.', notes: 'Bronze walls carved with names of victims.' },
          { name: 'One World Observatory 102nd Floor SkyPod', time: '11:30 AM', category: 'Sightseeing', description: 'Ride high-speed SkyPod elevators to the top of Freedom Tower for 360-degree vistas.', notes: 'Features See Forever Theater presentation.' },
          { name: 'Oculus Transportation Hub & Westfield Mall', time: '02:30 PM', category: 'Architecture', description: 'Admire Santiago Calatrava’s ribbed white bird-like steel structure.', notes: 'Premier indoor shopping and subway connection.' }
        ]
      },
      {
        title: 'Day 7: Brooklyn Bridge & DUMBO Waterfront',
        focus: 'Brooklyn Bridge Walk & DUMBO Skyline View',
        overview: 'Walk across the historic 1883 suspension bridge for panoramic Manhattan views.',
        stops: [
          { name: 'Brooklyn Bridge Pedestrian Boardwalk Walk', time: '09:00 AM', category: 'Sightseeing', description: 'Walk elevated wooden boardwalk over Gothic stone arches connecting Manhattan to Brooklyn.', notes: 'Best photo ops are midway on the bridge.' },
          { name: 'DUMBO Washington Street Empire State Photo Spot', time: '11:30 AM', category: 'Sightseeing', description: 'Snap the famous shot of Manhattan Bridge framing the Empire State Building between brick cobblestone buildings.', notes: 'Extremely popular photography location.' },
          { name: 'Jane’s Carousel & Brooklyn Bridge Park', time: '02:00 PM', category: 'Sightseeing', description: 'Stroll Pier 1 waterfront lawns and ride the restored 1922 wooden carousel.', notes: 'Enjoy coal-fired pizza at Grimaldi’s nearby.' }
        ]
      },
      {
        title: 'Day 8: High Line Elevated Park & Hudson Yards',
        focus: 'High Line Park, Chelsea Market & The Vessel',
        overview: 'Walk a 1.45-mile elevated rail line park converted into public art gardens.',
        stops: [
          { name: 'The High Line Elevated Public Park Walk', time: '09:30 AM', category: 'Nature & Art', description: 'Stroll 30 feet above city streets along former freight rail tracks with wildflowers.', notes: 'Starts at Gansevoort Street in Meatpacking District.' },
          { name: 'Chelsea Market Food Hall Lunch', time: '12:30 PM', category: 'Dining & Food', description: 'Dine on fresh lobster rolls, tacos, artisanal cheeses, and baked sweets inside a historic biscuit factory.', notes: 'Housed in the original Nabisco factory building.' },
          { name: 'Hudson Yards Vessel & Edge Observatory', time: '03:30 PM', category: 'Sightseeing', description: 'See the 16-story honeycomb Vessel structure and Edge outdoor glass skydeck.', notes: 'Edge is the highest outdoor skydeck in the Western Hemisphere.' }
        ]
      },
      {
        title: 'Day 9: Greenwich Village & Soho Historic Districts',
        focus: 'Washington Square Arch, SoHo Cast-Iron Architecture',
        overview: 'Discover cobblestone streets, bohemian jazz clubs, and historic cast-iron buildings.',
        stops: [
          { name: 'Washington Square Park & Marble Arch', time: '10:00 AM', category: 'Sightseeing', description: 'See the iconic 1892 George Washington triumphal arch and fountain.', notes: 'Street musicians and chess players gather here.' },
          { name: 'SoHo Cast-Iron Historic District Walk', time: '01:30 PM', category: 'Architecture & Shopping', description: 'Walk cobblestone streets surrounded by 19th-century cast-iron facades and designer boutiques.', notes: 'Located along Greene and Spring Streets.' },
          { name: 'Greenwich Village Jazz Club Evening', time: '07:30 PM', category: 'Culture & Entertainment', description: 'Listen to live jazz at legendary venues like Village Vanguard or Blue Note.', notes: 'Book jazz show tickets online in advance.' }
        ]
      },
      {
        title: 'Day 10: Wall Street & Financial District Icons',
        focus: 'New York Stock Exchange, Charging Bull & Trinity Church',
        overview: 'Conclude your trip exploring the financial birthplace of global commerce.',
        stops: [
          { name: 'Wall Street & New York Stock Exchange', time: '09:30 AM', category: 'Sightseeing', description: 'Stand in front of the historic neoclassic facade of NYSE and Federal Hall.', notes: 'Where George Washington took oath as 1st US President.' },
          { name: 'Charging Bull & Fearless Girl Sculptures', time: '11:30 AM', category: 'Sightseeing', description: 'Take photos with Arturo Di Modica’s famous 7,100 lb bronze bull sculpture.', notes: 'Located at Bowling Green park.' },
          { name: 'Trinity Church & Alexander Hamilton Tomb', time: '02:00 PM', category: 'Heritage', description: 'Visit the 1846 Gothic Revival church and historic graveyard holding Alexander Hamilton’s grave.', notes: 'Located at the intersection of Broadway and Wall Street.' }
        ]
      }
    ]
  }
};

function matchPresetKey(destinationText = '', requestText = '') {
  const combined = `${destinationText} ${requestText}`.toLowerCase();
  if (combined.includes('tamil nadu') || combined.includes('tamilnadu') || combined.includes('chennai') || combined.includes('madurai') || combined.includes('mahabalipuram')) return 'tamilnadu';
  if (combined.includes('tirupati') || combined.includes('thirupathi') || combined.includes('tirumala') || combined.includes('balaji')) return 'tirupati';
  if (combined.includes('kerala') || combined.includes('kochi') || combined.includes('munnar') || combined.includes('alleppey')) return 'kerala';
  if (combined.includes('kashmir') || combined.includes('srinagar') || combined.includes('gulmarg') || combined.includes('pahalgam')) return 'kashmir';
  if (combined.includes('california') || combined.includes('san francisco') || combined.includes('yosemite') || combined.includes('napa')) return 'california';
  if (combined.includes('new york') || combined.includes('newyork') || combined.includes('nyc') || combined.includes('manhattan')) return 'newyork';
  return null;
}

function generateDynamicNamedStops(destination, dayIndex, style) {
  const destClean = destination || 'City Center';
  
  const DAY_SCHEMES = [
    {
      title: `Day ${dayIndex + 1}: ${destClean} Historic Center & Heritage Landmarks`,
      focus: 'Central Square, Historic Monuments & Cultural Heritage',
      overview: `Explore ${destClean}’s defining historic monuments, landmark architecture, and heritage squares.`,
      stops: [
        [`${destClean} Central Heritage Plaza & Memorial Arch`, '09:00 AM', 'Sightseeing', `Walk through the historic central plaza of ${destClean} surrounded by landmark architecture.`, 'Arrive early for great lighting and photos.'],
        [`${destClean} Grand Cathedral & History Museum`, '11:30 AM', 'Culture', `Discover centuries of art, artifacts, and royal history inside ${destClean}’s premier sanctuary.`, 'Audio tours available at the entrance.'],
        [`${destClean} Old Town Historic Bistro`, '01:30 PM', 'Dining', `Taste authentic regional specialties at a top-rated traditional restaurant in ${destClean}.`, 'Try signature house dishes.'],
        [`${destClean} Waterfront Promenade & Sunset Overlook`, '05:00 PM', 'Sightseeing', `Stroll along the scenic waterfront capturing panoramic sunset views over ${destClean}.`, 'Ideal photo spot at golden hour.']
      ]
    },
    {
      title: `Day ${dayIndex + 1}: ${destClean} National Park & Scenic Mountain Heights`,
      focus: 'Mountain Viewpoint, Hiking Trails & Panoramic Overlooks',
      overview: `Discover ${destClean}’s breathtaking natural landscapes, mountain trails, and scenic vistas.`,
      stops: [
        [`${destClean} National Park Mountain Trailhead`, '08:30 AM', 'Outdoor & Nature', `Embark on a refreshing morning walk with sweeping mountain and forest vistas near ${destClean}.`, 'Wear sturdy walking shoes and bring water.'],
        [`${destClean} Alpine Botanical Gardens & Conservatory`, '11:30 AM', 'Nature', `Explore exotic plant collections, peaceful lotus ponds, and manicured garden paths.`, 'Includes shaded benches for relaxing.'],
        [`${destClean} Hillside View Terrace Restaurant`, '01:30 PM', 'Dining', `Enjoy lunch with elevated panoramic views looking down over ${destClean}.`, 'Reserve terrace seating.'],
        [`${destClean} Scenic Peak Lookout & Cable Car Platform`, '04:30 PM', 'Sightseeing', `Ascend to the mountain summit for 360-degree views of the ${destClean} region.`, 'Spectacular camera panorama spot.']
      ]
    },
    {
      title: `Day ${dayIndex + 1}: ${destClean} Famous Museums & Art Galleries`,
      focus: 'Art Museums, Sculptures & Cultural Exhibitions',
      overview: `Immerse yourself in world-class art collections, sculpture gardens, and cultural treasures in ${destClean}.`,
      stops: [
        [`${destClean} National Art Museum & Sculpture Hall`, '09:30 AM', 'Culture & Art', `View famous paintings, classical sculptures, and historical masterpieces.`, 'Museum guided tours run hourly.'],
        [`${destClean} Cultural Heritage Center & Craft Gallery`, '01:30 PM', 'Culture', `Watch live local craft demonstrations and traditional artisan weaving.`, 'Support local community artists.'],
        [`${destClean} Museum Quarter Alfresco Cafe`, '04:30 PM', 'Dining', `Relax with coffee and artisanal pastries amidst sculpture gardens.`, 'Great spot to reset after gallery visits.']
      ]
    },
    {
      title: `Day ${dayIndex + 1}: ${destClean} Coastal Beaches & Harbor Islands`,
      focus: 'Harbor Cruise, Beachfront Boardwalk & Marine Life',
      overview: `Enjoy refreshing coastal waters, scenic harbor cruises, and sandy beach promenades.`,
      stops: [
        [`${destClean} Harbor Ferry & Coastal Island Cruise`, '09:00 AM', 'Sightseeing', `Cruise past scenic island lighthouse monuments and coastline cliffs.`, 'Open upper deck seating available.'],
        [`${destClean} Beachfront Boardwalk & Lighthouse Pier`, '01:00 PM', 'Outdoor & Beach', `Walk along the oceanfront boardwalk with sea breeze views.`, 'Taste fresh local seafood on the pier.'],
        [`${destClean} Sunset Beach Cove & Marine Sanctuary`, '05:30 PM', 'Nature', `Watch golden hour rays illuminate the sea and coastal rock formations.`, 'Bring a light shell jacket for evening ocean breeze.']
      ]
    },
    {
      title: `Day ${dayIndex + 1}: ${destClean} Sacred Temples & Ancient Shrines`,
      focus: 'Sacred Temples, Monastic Architecture & Pilgrimage Sights',
      overview: `Visit ancient sacred shrines, gilded domes, and peaceful spiritual sanctuaries in ${destClean}.`,
      stops: [
        [`${destClean} Ancient Sacred Temple & Golden Gopuram`, '08:30 AM', 'Pilgrimage & Culture', `Darshan at the sacred ancient temple complex featuring intricate stone carvings.`, 'Traditional modest attire required.'],
        [`${destClean} Sacred Temple Tank & Peace Gardens`, '11:30 AM', 'Culture', `Stroll the peaceful holy water tank and manicured temple courtyard.`, 'Peaceful environment for reflection.'],
        [`${destClean} Traditional Temple Prasadam & Vegetarian Lunch`, '01:30 PM', 'Dining', `Taste authentic traditional vegetarian thali served on banana leaves.`, 'Prepared with pure local ingredients.']
      ]
    }
  ];

  const scheme = DAY_SCHEMES[dayIndex % DAY_SCHEMES.length];
  return {
    title: scheme.title,
    focus: scheme.focus,
    overview: scheme.overview,
    stops: scheme.stops.map((s) => ({
      name: s[0],
      time: s[1],
      category: s[2],
      description: s[3],
      notes: s[4]
    }))
  };
}

export function buildDemoItinerary(requestText) {
  const destination = inferDestination(requestText);
  const style = inferTripStyle(requestText);
  const dayCount = inferDayCount(requestText);
  const presetKey = matchPresetKey(destination, requestText);

  if (presetKey && PRESET_DESTINATIONS_DATA[presetKey]) {
    const data = PRESET_DESTINATIONS_DATA[presetKey];
    const rawDays = data.days;
    const days = Array.from({ length: dayCount }, (_, dayIndex) => {
      const srcDay = rawDays[dayIndex % rawDays.length];
      return {
        title: dayIndex < rawDays.length ? srcDay.title : `Day ${dayIndex + 1}: ${data.name} Sightseeing Tour Part ${Math.floor(dayIndex / rawDays.length) + 1}`,
        focus: srcDay.focus,
        overview: srcDay.overview,
        stops: srcDay.stops.map((st) => ({ ...st }))
      };
    });

    return normalizeItinerary({
      tripTitle: `${data.name} ${dayCount}-Day Sightseeing Itinerary`,
      destination: data.name,
      summary: `A complete ${dayCount}-day ${style} itinerary exploring the top tourist places to visit in ${data.name}. ${data.summary}`,
      days
    });
  }

  const summary = `A custom ${dayCount}-day ${style} itinerary for ${destination} curated with top-rated tourist places to visit, famous landmarks, and cultural sights.`;
  const days = Array.from({ length: dayCount }, (_, dayIndex) => {
    return generateDynamicNamedStops(destination, dayIndex, style);
  });

  return normalizeItinerary({
    tripTitle: `${destination} ${dayCount}-Day Tourist Attractions Itinerary`,
    destination,
    summary,
    days
  });
}
