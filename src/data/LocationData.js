// Massive list of top-tier, tier-2, and tier-3 Indian cities for Programmatic SEO scaling
export const LOCATION_DATA = [
  // Tier 1 (Metros)
  { name: "Mumbai", tier: 1 }, { name: "Delhi", tier: 1 }, { name: "Bengaluru", tier: 1 }, 
  { name: "Hyderabad", tier: 1 }, { name: "Ahmedabad", tier: 1 }, { name: "Chennai", tier: 1 }, 
  { name: "Kolkata", tier: 1 }, { name: "Surat", tier: 1 }, { name: "Pune", tier: 1 }, { name: "Jaipur", tier: 1 },
  
  // Tier 2 (Major Economic Hubs)
  { name: "Lucknow", tier: 2 }, { name: "Kanpur", tier: 2 }, { name: "Nagpur", tier: 2 }, { name: "Indore", tier: 2 }, 
  { name: "Thane", tier: 2 }, { name: "Bhopal", tier: 2 }, { name: "Visakhapatnam", tier: 2 }, { name: "Patna", tier: 2 }, 
  { name: "Vadodara", tier: 2 }, { name: "Ghaziabad", tier: 2 }, { name: "Ludhiana", tier: 2 }, { name: "Agra", tier: 2 }, 
  { name: "Nashik", tier: 2 }, { name: "Faridabad", tier: 2 }, { name: "Meerut", tier: 2 }, { name: "Rajkot", tier: 2 }, 
  { name: "Varanasi", tier: 2 }, { name: "Srinagar", tier: 2 }, { name: "Aurangabad", tier: 2 }, { name: "Dhanbad", tier: 2 }, 
  { name: "Amritsar", tier: 2 }, { name: "Navi Mumbai", tier: 2 }, { name: "Allahabad", tier: 2 }, { name: "Ranchi", tier: 2 }, 
  { name: "Gwalior", tier: 2 }, { name: "Jabalpur", tier: 2 }, { name: "Coimbatore", tier: 2 }, { name: "Vijayawada", tier: 2 }, 
  { name: "Jodhpur", tier: 2 }, { name: "Madurai", tier: 2 }, { name: "Raipur", tier: 2 }, { name: "Kota", tier: 2 }, 
  { name: "Guwahati", tier: 2 }, { name: "Chandigarh", tier: 2 }, { name: "Mysore", tier: 2 }, { name: "Gurgaon", tier: 2 },
  
  // Tier 3 (Emerging Markets)
  { name: "Aligarh", tier: 3 }, { name: "Jalandhar", tier: 3 }, { name: "Bhubaneswar", tier: 3 }, { name: "Salem", tier: 3 }, 
  { name: "Thiruvananthapuram", tier: 3 }, { name: "Guntur", tier: 3 }, { name: "Bikaner", tier: 3 }, { name: "Noida", tier: 3 }, 
  { name: "Jamshedpur", tier: 3 }, { name: "Kochi", tier: 3 }, { name: "Dehradun", tier: 3 }, { name: "Rourkela", tier: 3 }, 
  { name: "Ajmer", tier: 3 }, { name: "Ujjain", tier: 3 }, { name: "Jhansi", tier: 3 }, { name: "Jammu", tier: 3 }, 
  { name: "Mangalore", tier: 3 }, { name: "Udaipur", tier: 3 }, { name: "Kozhikode", tier: 3 }, { name: "Rohtak", tier: 3 }, 
  { name: "Mathura", tier: 3 }, { name: "Panipat", tier: 3 }, { name: "Karnal", tier: 3 }, { name: "Bathinda", tier: 3 }
];

// Spintax-style dynamic copywriting based on City Tier
export const getCityCopy = (cityName, tier) => {
  if (tier === 1) {
    return {
      heroTitle: `DOMINATE ${cityName.toUpperCase()}`,
      heroSubtitle: `The digital landscape in ${cityName} is ruthless. While other agencies sell generic templates, we build bespoke digital architecture that helps ${cityName}'s top businesses crush their local competition.`,
      cta: `Take Over ${cityName}`
    };
  } else if (tier === 2) {
    return {
      heroTitle: `${cityName.toUpperCase()}'S PREMIER AGENCY`,
      heroSubtitle: `${cityName} is growing faster than ever. If your digital presence looks like it was built in 2015, you are losing massive market share to your competitors. We engineer authority.`,
      cta: `Scale in ${cityName}`
    };
  } else {
    return {
      heroTitle: `MODERNIZE ${cityName.toUpperCase()}`,
      heroSubtitle: `Be the absolute standard in ${cityName}. We help ambitious local businesses leapfrog their competition by deploying world-class, premium digital assets that command respect.`,
      cta: `Dominate ${cityName}`
    };
  }
};

export const formatLocation = (slug) => {
  if (!slug) return null;
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getCityData = (locationName) => {
  if (!locationName) return null;
  const formatted = formatLocation(locationName);
  return LOCATION_DATA.find(city => city.name === formatted) || { name: formatted, tier: 3 }; 
};

// Helper to check if a location is valid
export const isValidLocation = (locationName) => {
  if (!locationName) return false;
  const formatted = formatLocation(locationName);
  return LOCATION_DATA.some(city => city.name === formatted);
};
