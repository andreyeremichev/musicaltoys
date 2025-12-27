// lib/calendar/calendarData.ts
export type CalendarEntry = {
  mmdd: string;          // "01-31"
  dateLabel: string;     // "January 31"
  text: string;          // meaning sentence
  year: number;          // historical year
};

export const CALENDAR_TEST_DECEMBER: CalendarEntry[] = [
  { mmdd: "12-24", dateLabel: "December 24", text: "A test phrase for Calendar playback", year: 2001 },
  { mmdd: "12-25", dateLabel: "December 25", text: "Another test phrase to hear and highlight", year: 1999 },
  { mmdd: "12-26", dateLabel: "December 26", text: "Calendar testing with text and numbers", year: 1987 },
];

export const CALENDAR_JANUARY: CalendarEntry[] = [
  { mmdd: "01-01", dateLabel: "January 1",  text: "People change how the year itself is counted", year: 1582 },
  { mmdd: "01-02", dateLabel: "January 2",  text: "People begin reading stories about machines replacing humans", year: 1921 },
  { mmdd: "01-03", dateLabel: "January 3",  text: "People begin owning computers at home", year: 1977 },
  { mmdd: "01-04", dateLabel: "January 4",  text: "People guide machines on other worlds from home", year: 2004 },
  { mmdd: "01-05", dateLabel: "January 5",  text: "People begin watching moving images at home every day", year: 1953 },
  { mmdd: "01-06", dateLabel: "January 6",  text: "Daily life begins following clocks instead of daylight", year: 1974 },
  { mmdd: "01-07", dateLabel: "January 7",  text: "Public stages open to voices once kept outside", year: 1955 },
  { mmdd: "01-08", dateLabel: "January 8",  text: "People begin making phone calls without using an operator", year: 1963 },
  { mmdd: "01-09", dateLabel: "January 9",  text: "People begin carrying computers in their pockets", year: 2007 },
  { mmdd: "01-10", dateLabel: "January 10", text: "Cities begin moving people underground to save time", year: 1863 },
  { mmdd: "01-11", dateLabel: "January 11", text: "A deadly disease becomes something people manage daily", year: 1922 },
  { mmdd: "01-12", dateLabel: "January 12", text: "People agree not to clone human beings", year: 1998 },
  { mmdd: "01-13", dateLabel: "January 13", text: "People gain a way to escape from failing machines", year: 1942 },
  { mmdd: "01-14", dateLabel: "January 14", text: "People begin starting their mornings by watching television", year: 1952 },
  { mmdd: "01-15", dateLabel: "January 15", text: "Information begins traveling faster than physical objects", year: 1892 },
  { mmdd: "01-16", dateLabel: "January 16", text: "Messages begin arriving faster than messengers can travel", year: 1844 },
  { mmdd: "01-17", dateLabel: "January 17", text: "People begin crossing continents through the air", year: 1919 },
  { mmdd: "01-18", dateLabel: "January 18", text: "Food begins being preserved far beyond its natural lifetime", year: 1879 },
  { mmdd: "01-19", dateLabel: "January 19", text: "Images begin capturing reality with mechanical accuracy", year: 1839 },
  { mmdd: "01-20", dateLabel: "January 20", text: "Leadership begins changing hands on a set timetable", year: 1937 },
  { mmdd: "01-21", dateLabel: "January 21", text: "Large audiences begin listening to the same voice at once", year: 1927 },
  { mmdd: "01-22", dateLabel: "January 22", text: "People begin using machines to help make decisions", year: 1984 },
  { mmdd: "01-23", dateLabel: "January 23", text: "Weather begins being predicted days in advance", year: 1861 },
  { mmdd: "01-24", dateLabel: "January 24", text: "Music begins reaching people without performers present", year: 1878 },
  { mmdd: "01-25", dateLabel: "January 25", text: "People begin expecting new printed pages on a regular schedule", year: 1665 },
  { mmdd: "01-26", dateLabel: "January 26", text: "People begin navigating by signals they cannot see", year: 1978 },
  { mmdd: "01-27", dateLabel: "January 27", text: "Images begin traveling instantly across long distances", year: 1964 },
  { mmdd: "01-28", dateLabel: "January 28", text: "People begin traveling daily to work away from home", year: 1880 },
  { mmdd: "01-29", dateLabel: "January 29", text: "People begin trusting machines with personal calculations", year: 1979 },
  { mmdd: "01-30", dateLabel: "January 30", text: "Information begins being searched instead of browsed", year: 1997 },
  { mmdd: "01-31", dateLabel: "January 31", text: "People begin listening to music broadcast into their homes", year: 1923 },
];

export const CALENDAR_FEBRUARY: CalendarEntry[] = [
  { mmdd: "02-01", dateLabel: "February 1",  text: "Published timetables start shaping long-distance travel", year: 1830 },
  { mmdd: "02-02", dateLabel: "February 2",  text: "Weather forecasts start influencing daily plans", year: 1849 },
  { mmdd: "02-03", dateLabel: "February 3",  text: "Radio broadcasts bring music into homes", year: 1916 },
  { mmdd: "02-04", dateLabel: "February 4",  text: "Agreements start traveling instantly across long distances", year: 1876 },
  { mmdd: "02-05", dateLabel: "February 5",  text: "Everyday moments start being captured instantly", year: 1888 },
  { mmdd: "02-06", dateLabel: "February 6",  text: "News starts being heard as it happens on the radio", year: 1922 },
  { mmdd: "02-07", dateLabel: "February 7",  text: "Music becomes something to listen to while walking outside", year: 1979 },
  { mmdd: "02-08", dateLabel: "February 8",  text: "Paying with a card starts replacing cash in daily life", year: 1950 },
  { mmdd: "02-09", dateLabel: "February 9",  text: "Complex calculations start being handed to machines", year: 1946 },
  { mmdd: "02-10", dateLabel: "February 10", text: "Information starts spreading faster than print can keep up", year: 1969 },
  { mmdd: "02-11", dateLabel: "February 11", text: "Voices begin crossing continents instantly", year: 1876 },
  { mmdd: "02-12", dateLabel: "February 12", text: "Everyday sounds start being recorded for later listening", year: 1877 },
  { mmdd: "02-13", dateLabel: "February 13", text: "Motion starts being captured as a sequence of images", year: 1890 },
  { mmdd: "02-14", dateLabel: "February 14", text: "Personal messages start arriving faster than messengers can travel", year: 1844 },
  { mmdd: "02-15", dateLabel: "February 15", text: "Machines start predicting outcomes before they happen", year: 1951 },
  { mmdd: "02-16", dateLabel: "February 16", text: "Images start being copied without losing fine detail", year: 1935 },
  { mmdd: "02-17", dateLabel: "February 17", text: "Reaching space becomes possible without leaving the Earth", year: 1959 },
  { mmdd: "02-18", dateLabel: "February 18", text: "Live events start being watched from far away", year: 1964 },
  { mmdd: "02-19", dateLabel: "February 19", text: "News starts being chosen automatically for each reader", year: 1995 },
  { mmdd: "02-20", dateLabel: "February 20", text: "Maps start updating themselves while people move", year: 2005 },
  { mmdd: "02-21", dateLabel: "February 21", text: "Voices from the past become something people can hear again", year: 1878 },
  { mmdd: "02-22", dateLabel: "February 22", text: "Photographs start being accepted as proof of what happened", year: 1839 },
  { mmdd: "02-23", dateLabel: "February 23", text: "Time zones start coordinating lives across distance", year: 1884 },
  { mmdd: "02-24", dateLabel: "February 24", text: "Large collections of information become searchable by machines", year: 1957 },
  { mmdd: "02-25", dateLabel: "February 25", text: "Personal communication devices start being carried everywhere", year: 1973 },
  { mmdd: "02-26", dateLabel: "February 26", text: "Collaboration starts happening through connected computers", year: 1968 },
  { mmdd: "02-27", dateLabel: "February 27", text: "Knowledge starts being stored in digital form", year: 1971 },
  { mmdd: "02-28", dateLabel: "February 28", text: "Daily life begins being published online", year: 2004 },
];

export const CALENDAR_MARCH: CalendarEntry[] = [
  { mmdd: "03-01", dateLabel: "March 1",  text: "Messages start traveling through wires faster than horses can run", year: 1847 },
  { mmdd: "03-02", dateLabel: "March 2",  text: "Newspapers begin arriving on a predictable daily schedule", year: 1702 },
  { mmdd: "03-03", dateLabel: "March 3",  text: "Mail delivery starts following fixed routes and rules", year: 1635 },
  { mmdd: "03-04", dateLabel: "March 4",  text: "Clocks begin being synchronized across entire countries", year: 1884 },
  { mmdd: "03-05", dateLabel: "March 5",  text: "Printed words start reaching large audiences at low cost", year: 1836 },
  { mmdd: "03-06", dateLabel: "March 6",  text: "Sound begins being recorded clearly enough to preserve voices", year: 1889 },
  { mmdd: "03-07", dateLabel: "March 7",  text: "Telephone calls start becoming part of everyday business life", year: 1876 },
  { mmdd: "03-08", dateLabel: "March 8",  text: "Women begin organizing publicly for political rights", year: 1911 },
  { mmdd: "03-09", dateLabel: "March 9",  text: "Maps begin being created from aerial photographs", year: 1936 },
  { mmdd: "03-10", dateLabel: "March 10", text: "People begin speaking to someone far away as if nearby", year: 1876 },
  { mmdd: "03-11", dateLabel: "March 11", text: "Radio broadcasting begins spreading news beyond cities", year: 1920 },
  { mmdd: "03-12", dateLabel: "March 12", text: "Everyday life begins getting photographed without special occasions", year: 1900 },
  { mmdd: "03-13", dateLabel: "March 13", text: "Newspapers begin reaching readers before the day is over", year: 1896 },
  { mmdd: "03-14", dateLabel: "March 14", text: "Mathematics begins guiding everyday engineering work", year: 1873 },
  { mmdd: "03-15", dateLabel: "March 15", text: "Money begins moving as numbers instead of coins", year: 1950 },
  { mmdd: "03-16", dateLabel: "March 16", text: "Homes begin receiving radio broadcasts regularly", year: 1920 },
  { mmdd: "03-17", dateLabel: "March 17", text: "Public holidays begin being celebrated far from their place of origin", year: 1762 },
  { mmdd: "03-18", dateLabel: "March 18", text: "Industrial work begins running on shifts instead of daylight", year: 1888 },
  { mmdd: "03-19", dateLabel: "March 19", text: "Mass-produced objects begin looking identical everywhere", year: 1908 },
  { mmdd: "03-20", dateLabel: "March 20", text: "Weather forecasts begin influencing travel and farming decisions", year: 1870 },
  { mmdd: "03-21", dateLabel: "March 21", text: "Sound recordings begin preserving everyday speech", year: 1890 },
  { mmdd: "03-22", dateLabel: "March 22", text: "Moving pictures begin attracting regular public audiences", year: 1895 },
  { mmdd: "03-23", dateLabel: "March 23", text: "Health measurements begin being tracked as daily numbers", year: 1954 },
  { mmdd: "03-24", dateLabel: "March 24", text: "Images begin traveling across oceans in minutes", year: 1962 },
  { mmdd: "03-25", dateLabel: "March 25", text: "Electric light begins replacing candles in homes", year: 1882 },
  { mmdd: "03-26", dateLabel: "March 26", text: "Computers begin fitting onto a single small chip", year: 1971 },
  { mmdd: "03-27", dateLabel: "March 27", text: "Space travel becomes something people watch live", year: 1961 },
  { mmdd: "03-28", dateLabel: "March 28", text: "Digital networks begin linking distant computers together", year: 1969 },
  { mmdd: "03-29", dateLabel: "March 29", text: "Personal calendars begin living inside electronic devices", year: 1996 },
  { mmdd: "03-30", dateLabel: "March 30", text: "Music begins being carried in a pocket instead of a room", year: 1979 },
  { mmdd: "03-31", dateLabel: "March 31", text: "Online publishing begins reaching readers instantly", year: 1999 },
];

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  ...CALENDAR_JANUARY,
  ...CALENDAR_FEBRUARY,
  ...CALENDAR_MARCH,
  ...CALENDAR_TEST_DECEMBER,
];

export const CALENDAR_BY_MMDD: Record<string, CalendarEntry> = Object.fromEntries(
  CALENDAR_ENTRIES.map((e) => [e.mmdd, e])
);