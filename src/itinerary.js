function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanText(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeStop(stop, stopIndex, dayNumber) {
  return {
    id: cleanText(stop?.id, createId(`day-${dayNumber}-stop-${stopIndex + 1}`)),
    name: cleanText(stop?.name, `Stop ${stopIndex + 1}`),
    time: cleanText(stop?.time, 'Flexible timing'),
    category: cleanText(stop?.category, 'General'),
    description: cleanText(stop?.description, 'A useful stop for the itinerary.'),
    notes: cleanText(stop?.notes, 'Keep it easy to swap if plans change.')
  };
}

function normalizeDay(day, dayIndex) {
  const stops = Array.isArray(day?.stops) ? day.stops : [];

  return {
    id: cleanText(day?.id, createId(`day-${dayIndex + 1}`)),
    title: cleanText(day?.title, `Day ${dayIndex + 1}`),
    focus: cleanText(day?.focus, 'Balanced sightseeing'),
    overview: cleanText(day?.overview, 'A flexible day designed by the model.'),
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
    tripTitle: cleanText(value.tripTitle, 'Trip itinerary'),
    destination: cleanText(value.destination, 'Destination'),
    summary: cleanText(value.summary, 'A structured trip plan built from the model response.'),
    days: normalizedDays
  };
}

function inferDestination(requestText) {
  const patterns = [
    /\bto\s+([A-Za-z][A-Za-z\s,'-]+?)(?:\bfor\b|\bwith\b|\bin\b|\bnext\b|\bthis\b|\bthat\b|\bfrom\b|[.,;!$])/i,
    /\bvisit\s+([A-Za-z][A-Za-z\s,'-]+?)(?:[.,;!$]|\s+with\b|\s+for\b|\s+in\b|\s+next\b)/i
  ];

  for (const pattern of patterns) {
    const match = requestText.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return 'your destination';
}

function inferTripStyle(requestText) {
  const lower = requestText.toLowerCase();

  if (lower.includes('food')) return 'food-forward';
  if (lower.includes('family')) return 'family-friendly';
  if (lower.includes('romantic')) return 'romantic';
  if (lower.includes('outdoor') || lower.includes('hike')) return 'outdoor';
  if (lower.includes('budget')) return 'budget-conscious';
  return 'well-rounded';
}

const DAY_TEMPLATES = [
  {
    title: 'Arrival and first impressions',
    focus: 'Easy pacing and neighborhood orientation',
    overview: 'Start light, get your bearings, and leave room for spontaneous detours.',
    stops: [
      ['Check in and settle in', 'Hotel / lodging', 'Drop bags, hydrate, and recover from the journey.'],
      ['Local lunch', 'Food', 'Pick a neighborhood spot that reflects the city’s everyday rhythm.'],
      ['Walking loop', 'Sightseeing', 'A low-pressure route through the most photogenic streets.'],
      ['Sunset overlook', 'Scenic', 'End the day with a view and an early dinner nearby.']
    ]
  },
  {
    title: 'Signature highlights',
    focus: 'Museum, landmark, or bucket-list core',
    overview: 'This is the highest-intensity day: the big reason for the trip gets the most attention.',
    stops: [
      ['Morning anchor', 'Landmark', 'Book the most important stop for the first half of the day.'],
      ['Coffee break', 'Break', 'Use this pause to reset before the next block.'],
      ['Main attraction', 'Experience', 'The centerpiece activity or reservation worth planning around.'],
      ['Evening neighborhood', 'Dining', 'Pick a walkable dinner zone so the day ends smoothly.']
    ]
  },
  {
    title: 'Local texture',
    focus: 'Markets, parks, and smaller discoveries',
    overview: 'Shift away from the headline sights and spend time where the city feels lived in.',
    stops: [
      ['Market or market street', 'Shopping', 'Browse local products, snacks, and small souvenirs.'],
      ['Park, trail, or waterfront', 'Outdoor', 'Build in movement and a change of pace.'],
      ['Neighborhood lunch', 'Food', 'Choose something regional and unhurried.'],
      ['Optional second museum', 'Culture', 'Add this only if the day still has energy left.']
    ]
  },
  {
    title: 'Flexible finale',
    focus: 'Open space for the trip’s favorite repeatable parts',
    overview: 'Repeat whatever worked best: a view, a meal, a ride, or a last-minute discovery.',
    stops: [
      ['Revisit favorite area', 'Flexible', 'Go back to the part of town that felt most compelling.'],
      ['One last signature meal', 'Food', 'Reserve the splurge meal or the dish you still want to try.'],
      ['Pack and reset', 'Logistics', 'Create a calm transition before departure.'],
      ['Departure buffer', 'Travel', 'Leave space for traffic, security, and one final coffee.']
    ]
  }
];

export function inferDayCount(requestText) {
  if (typeof requestText !== 'string') return 4;
  const match = requestText.match(/(\d+)\s*[- ]?day/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 100) return num;
  }
  return 4;
}

export function buildDemoItinerary(requestText) {
  const destination = inferDestination(requestText);
  const style = inferTripStyle(requestText);
  const dayCount = inferDayCount(requestText);
  const summary = `A ${dayCount}-day ${style} plan for ${destination} with enough structure to guide the trip and enough slack to keep it enjoyable.`;

  const days = Array.from({ length: dayCount }, (_, dayIndex) => {
    const template = DAY_TEMPLATES[dayIndex % DAY_TEMPLATES.length];
    const stopCount = dayIndex === 0 ? 3 : dayIndex % 3 === 0 ? 3 : 4;

    return {
      title: `${template.title} ${dayIndex + 1}`,
      focus: template.focus,
      overview: template.overview,
      stops: template.stops.slice(0, stopCount).map((stop, stopIndex) => ({
        name: stop[0],
        time: ['Morning', 'Late morning', 'Afternoon', 'Evening'][stopIndex] || 'Flexible',
        category: stop[1],
        description: `${stop[2]} Tailor it to ${destination}.`,
        notes: `Designed as a ${style} stop for ${destination}.`
      }))
    };
  });

  return normalizeItinerary({
    tripTitle: `${destination} trip itinerary`,
    destination,
    summary,
    days
  });
}
