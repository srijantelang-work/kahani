// Streaming platform direct links
export const STREAMING_LINKS: Record<string, string> = {
  // Major streaming platforms
  Netflix: 'https://www.netflix.com',
  'Amazon Prime Video': 'https://www.primevideo.com',
  'Disney Plus': 'https://www.disneyplus.com',
  Hulu: 'https://www.hulu.com',
  'HBO Max': 'https://www.hbomax.com',
  'Apple TV Plus': 'https://tv.apple.com',
  Peacock: 'https://www.peacocktv.com',
  'Paramount Plus': 'https://www.paramountplus.com',
  'Discovery Plus': 'https://www.discoveryplus.com',
  Crunchyroll: 'https://www.crunchyroll.com',
  Funimation: 'https://www.funimation.com',
  Shudder: 'https://www.shudder.com',
  Mubi: 'https://mubi.com',
  'Criterion Channel': 'https://www.criterionchannel.com',
  Kanopy: 'https://www.kanopy.com',
  Tubi: 'https://tubitv.com',
  'Pluto TV': 'https://pluto.tv',
  'Roku Channel': 'https://therokuchannel.roku.com',
  'IMDb TV': 'https://www.imdb.com/tv',
  Vudu: 'https://www.vudu.com',
  'Google Play Movies': 'https://play.google.com/movies',
  iTunes: 'https://itunes.apple.com',
  'Microsoft Store': 'https://www.microsoft.com/en-us/store/movies-and-tv',
  YouTube: 'https://www.youtube.com',
  Redbox: 'https://www.redbox.com',
  FandangoNOW: 'https://www.fandangonow.com',
  'AMC Plus': 'https://www.amcplus.com',
  Showtime: 'https://www.showtime.com',
  Starz: 'https://www.starz.com',
  Epix: 'https://www.epix.com',
  'Acorn TV': 'https://acorn.tv',
  BritBox: 'https://www.britbox.com',
  'Sundance Now': 'https://www.sundancenow.com',
  'Shout Factory TV': 'https://www.shoutfactorytv.com',
  CONtv: 'https://www.contv.com',
  Dekkoo: 'https://www.dekkoo.com',
  Docurama: 'https://www.docurama.com',
  'Dove Channel': 'https://www.dovechannel.com',
  FilmRise: 'https://filmrise.com',
  'Full Moon': 'https://www.fullmoonfeatures.com',
  'Gravitas Ventures': 'https://gravitasventures.com',
  'Gunpowder & Sky': 'https://gunpowdersky.com',
  IndieFlix: 'https://www.indieflix.com',
  'Magnolia Pictures': 'https://www.magpictures.com',
  'Oscilloscope Laboratories': 'https://www.oscilloscope.net',
  PBS: 'https://www.pbs.org',
  'PBS Kids': 'https://pbskids.org',
  'PBS Masterpiece': 'https://www.pbs.org/show/masterpiece',
  'PBS Documentaries': 'https://www.pbs.org/show/pbs-documentaries',
  'PBS NewsHour': 'https://www.pbs.org/newshour',
  'PBS Nova': 'https://www.pbs.org/wgbh/nova',
  'PBS Nature': 'https://www.pbs.org/wnet/nature',
  'PBS American Experience': 'https://www.pbs.org/wgbh/americanexperience',
  'PBS Frontline': 'https://www.pbs.org/wgbh/frontline',
  'PBS Independent Lens': 'https://www.pbs.org/independentlens',
  'PBS POV': 'https://www.pbs.org/pov',
  'PBS American Masters': 'https://www.pbs.org/wnet/americanmasters',
  'PBS Great Performances': 'https://www.pbs.org/wnet/gperf',
  'PBS Live from Lincoln Center': 'https://www.pbs.org/livefromlincolncenter',
  'PBS Austin City Limits': 'https://www.pbs.org/austin-city-limits',
  'PBS Antiques Roadshow': 'https://www.pbs.org/wgbh/roadshow',
  'PBS This Old House': 'https://www.pbs.org/thisoldhouse',
  'PBS Ask This Old House': 'https://www.pbs.org/askthisoldhouse',
  'PBS New Yankee Workshop': 'https://www.pbs.org/newyankee',
  "PBS Woodwright's Shop": 'https://www.pbs.org/woodwrights',
  'PBS Rough Cut': 'https://www.pbs.org/roughcut',
  'PBS Hometime': 'https://www.pbs.org/hometime',
  'PBS This Old House Hour': 'https://www.pbs.org/thisoldhousehour',
  'PBS Ask This Old House Hour': 'https://www.pbs.org/askthisoldhousehour',
  'PBS New Yankee Workshop Hour': 'https://www.pbs.org/newyankeehour',
  "PBS Woodwright's Shop Hour": 'https://www.pbs.org/woodwrightshour',
  'PBS Rough Cut Hour': 'https://www.pbs.org/roughcuthour',
  'PBS Hometime Hour': 'https://www.pbs.org/hometimehour',
}

// Generate search URLs for platforms that don't have direct movie/show links
export const getStreamingLink = (
  providerName: string,
  title: string
): string => {
  const baseLink = STREAMING_LINKS[providerName]

  if (!baseLink) {
    // Fallback to a general search
    return `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + providerName)}`
  }

  // For platforms that support direct search, append the title
  const searchablePlatforms = [
    'Netflix',
    'Amazon Prime Video',
    'Disney Plus',
    'Hulu',
    'HBO Max',
    'Apple TV Plus',
    'Peacock',
    'Paramount Plus',
    'Discovery Plus',
    'Crunchyroll',
    'Funimation',
    'Shudder',
    'Mubi',
    'Criterion Channel',
    'Kanopy',
    'Tubi',
    'Pluto TV',
    'Roku Channel',
    'IMDb TV',
    'Vudu',
    'Google Play Movies',
    'iTunes',
    'Microsoft Store',
    'YouTube',
    'Redbox',
    'FandangoNOW',
    'AMC Plus',
    'Showtime',
    'Starz',
    'Epix',
    'Acorn TV',
    'BritBox',
    'Sundance Now',
    'Shout Factory TV',
    'CONtv',
    'Dekkoo',
    'Docurama',
    'Dove Channel',
    'FilmRise',
    'Full Moon',
    'Gravitas Ventures',
    'Gunpowder & Sky',
    'IndieFlix',
    'Magnolia Pictures',
    'Oscilloscope Laboratories',
    'PBS',
    'PBS Kids',
    'PBS Masterpiece',
    'PBS Documentaries',
    'PBS NewsHour',
    'PBS Nova',
    'PBS Nature',
    'PBS American Experience',
    'PBS Frontline',
    'PBS Independent Lens',
    'PBS POV',
    'PBS American Masters',
    'PBS Great Performances',
    'PBS Live from Lincoln Center',
    'PBS Austin City Limits',
    'PBS Antiques Roadshow',
    'PBS This Old House',
    'PBS Ask This Old House',
    'PBS New Yankee Workshop',
    "PBS Woodwright's Shop",
    'PBS Rough Cut',
    'PBS Hometime',
    'PBS This Old House Hour',
    'PBS Ask This Old House Hour',
    'PBS New Yankee Workshop Hour',
    "PBS Woodwright's Shop Hour",
    'PBS Rough Cut Hour',
    'PBS Hometime Hour',
  ]

  if (searchablePlatforms.includes(providerName)) {
    // For most platforms, we'll use the base URL since they have search functionality
    return baseLink
  }

  return baseLink
}

// Get a more specific search URL for certain platforms
export const getSearchUrl = (providerName: string, title: string): string => {
  const encodedTitle = encodeURIComponent(title)

  switch (providerName) {
    case 'Netflix':
      return `https://www.netflix.com/search?q=${encodedTitle}`
    case 'Amazon Prime Video':
      return `https://www.primevideo.com/search?phrase=${encodedTitle}`
    case 'Hulu':
      return `https://www.hulu.com/search?q=${encodedTitle}`
    case 'Disney Plus':
      return `https://www.disneyplus.com/search?q=${encodedTitle}`
    case 'HBO Max':
      return `https://play.hbomax.com/search?q=${encodedTitle}`
    case 'Apple TV Plus':
      return `https://tv.apple.com/search?q=${encodedTitle}`
    case 'Peacock':
      return `https://www.peacocktv.com/search?q=${encodedTitle}`
    case 'Paramount Plus':
      return `https://www.paramountplus.com/search?q=${encodedTitle}`
    case 'YouTube':
      return `https://www.youtube.com/results?search_query=${encodedTitle}`
    case 'Google Play Movies':
      return `https://play.google.com/store/search?q=${encodedTitle}&c=movies`
    case 'iTunes':
      return `https://itunes.apple.com/search?term=${encodedTitle}&media=movie`
    case 'Vudu':
      return `https://www.vudu.com/content/search.html?searchString=${encodedTitle}`
    default:
      return getStreamingLink(providerName, title)
  }
}
