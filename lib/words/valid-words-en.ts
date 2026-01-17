// Valid English words for guess validation

import { SOLUTIONS_EN } from './solutions-en';

// Additional common English words (not solutions but valid guesses)
const ADDITIONAL_VALID_EN: Record<number, string[]> = {
  4: [
    // Common words
    'THAT', 'WITH', 'THIS', 'WILL', 'FROM', 'THEY', 'WERE', 'BEEN', 'HAVE', 'MANY',
    'SOME', 'THEM', 'THEN', 'WHAT', 'WHEN', 'MUCH', 'WELL', 'SUCH', 'HERE', 'MOST',
    'KNOW', 'TIME', 'OVER', 'BOTH', 'LIKE', 'DOES', 'GOOD', 'LOOK', 'LONG', 'TELL',
    'ALSO', 'BACK', 'JUST', 'ONLY', 'COME', 'MADE', 'FIND', 'GIVE', 'MORE', 'TAKE',
    'WANT', 'WORK', 'PART', 'YEAR', 'LAST', 'EACH', 'EVEN', 'SAME', 'LIFE', 'MUST',
    'NAME', 'CALL', 'VERY', 'HIGH', 'NEED', 'SAID', 'WENT', 'AWAY', 'KEEP', 'PLAY',
    'SHOW', 'SEEM', 'LIVE', 'REAL', 'FEEL', 'MEAN', 'HELP', 'SIDE', 'FORM', 'CITY',
    'FACT', 'BEST', 'WEEK', 'NEXT', 'SELF', 'HAND', 'LINE', 'WORD', 'HOME', 'BODY',
    'AREA', 'LEFT', 'TURN', 'MOVE', 'DAYS', 'OPEN', 'IDEA', 'CASE', 'HEAD', 'ROOM',
    'FREE', 'LESS', 'USED', 'FOUR', 'FIVE', 'ONCE', 'ABLE', 'HARD', 'SURE', 'EVER',
    // More verbs
    'GETS', 'PUTS', 'RUNS', 'SITS', 'EATS', 'SEES', 'USES', 'SAYS', 'ASKS', 'GOES',
    'LETS', 'SETS', 'CUTS', 'HITS', 'WINS', 'HELD', 'GAVE', 'KEPT', 'LOST', 'SOLD',
    'TOLD', 'GREW', 'DREW', 'KNEW', 'BLEW', 'FLEW', 'FELL', 'FELT', 'PAID', 'LAID',
    // Nouns
    'KIDS', 'BOYS', 'GIRL', 'DOGS', 'CATS', 'CARS', 'JOBS', 'BOOK', 'BANK', 'GAME',
    'FILM', 'SHOP', 'CLUB', 'NEWS', 'HILL', 'ROAD', 'WALL', 'DOOR', 'TREE', 'MOON',
    'KING', 'LORD', 'GIRL', 'WIFE', 'MIND', 'SOUL', 'FOOD', 'MILK', 'WINE', 'BEER',
    'FISH', 'BIRD', 'BEAR', 'DEER', 'WOLF', 'LION', 'SHIP', 'BOAT', 'GOLD', 'IRON',
    'WOOD', 'COAL', 'SAND', 'SOIL', 'CLAY', 'ROCK', 'RAIN', 'SNOW', 'WIND', 'WAVE',
    // Adjectives
    'EASY', 'FAST', 'SLOW', 'WARM', 'COOL', 'COLD', 'SOFT', 'LOUD', 'WIDE', 'DEEP',
    'THIN', 'TALL', 'PALE', 'DARK', 'PALE', 'BOLD', 'CALM', 'WILD', 'POOR', 'RICH',
    'DEAD', 'SICK', 'LATE', 'SOON', 'TINY', 'HUGE', 'SAFE', 'RARE', 'PURE', 'FAIR',
    // Tech/modern
    'APPS', 'DATA', 'WIFI', 'BLOG', 'SPAM', 'CHAT', 'SITE', 'LINK', 'CODE', 'BYTE',
    'DISK', 'FILE', 'PORT', 'BOOT', 'SYNC', 'UNDO', 'COPY', 'EDIT', 'SAVE', 'LOAD',
  ],
  5: [
    // Common words
    'THERE', 'WHICH', 'THEIR', 'WOULD', 'FIRST', 'THESE', 'OTHER', 'COULD', 'AFTER',
    'BEING', 'WHERE', 'THOSE', 'STILL', 'WHILE', 'FOUND', 'THREE', 'PLACE', 'EVERY',
    'GREAT', 'SMALL', 'LARGE', 'WRITE', 'WROTE', 'RIGHT', 'THING', 'POINT', 'HOUSE',
    'ABOUT', 'WORLD', 'YEARS', 'SINCE', 'UNDER', 'AGAIN', 'NEVER', 'THINK', 'STATE',
    'YOUNG', 'WATER', 'NIGHT', 'ABOVE', 'ALONG', 'MIGHT', 'UNTIL', 'OFTEN', 'LATER',
    'TAKEN', 'GIVEN', 'KNOWN', 'SHOWN', 'BEGUN', 'WOMEN', 'MONEY', 'GROUP', 'POWER',
    'COURT', 'EARLY', 'TODAY', 'USING', 'PARTS', 'STUDY', 'LEVEL', 'ORDER', 'LIGHT',
    'LEAST', 'SENSE', 'HUMAN', 'VOICE', 'STORY', 'CHILD', 'AMONG', 'STAND', 'FORCE',
    'TIMES', 'WHOLE', 'WORDS', 'HANDS', 'LOCAL', 'THIRD', 'CASES', 'AREAS', 'WORKS',
    'COMES', 'GIVES', 'TAKES', 'MAKES', 'MOVES', 'SHOWS', 'KEEPS', 'LEADS', 'MEANS',
    // More verbs
    'CALLS', 'FEELS', 'SEEMS', 'LOOKS', 'TELLS', 'TURNS', 'HOLDS', 'WANTS', 'NEEDS',
    'PLAYS', 'LIVES', 'HELPS', 'MEETS', 'GOES', 'KNOWS', 'STAYS', 'SENDS', 'READS',
    'SPENT', 'BUILT', 'MEANT', 'HEARD', 'STOOD', 'SPOKE', 'DROVE', 'CHOSE', 'BROKE',
    'THREW', 'CAUGHT', 'TAUGHT', 'BROUGHT', 'FOUGHT', 'SOUGHT', 'BOUGHT', 'THOUGHT',
    // Nouns
    'CHILD', 'MONTH', 'NIGHT', 'PAPER', 'MUSIC', 'TABLE', 'CLASS', 'HEART', 'FIELD',
    'FLOOR', 'RIVER', 'SOUTH', 'NORTH', 'WOMAN', 'TERMS', 'IDEAS', 'HOURS', 'GIRLS',
    'BOOKS', 'PLANS', 'ROADS', 'WEEKS', 'DOORS', 'TREES', 'BALLS', 'WALLS', 'ROOMS',
    'HOMES', 'HEADS', 'FOODS', 'BIRDS', 'SONGS', 'GAMES', 'FILMS', 'SHOPS', 'CLUBS',
    'BANKS', 'RULES', 'TYPES', 'FORMS', 'VIEWS', 'ROLES', 'COSTS', 'RATES', 'SALES',
    // Adjectives
    'HAPPY', 'SORRY', 'READY', 'CLEAR', 'SHORT', 'QUICK', 'QUIET', 'HEAVY', 'EMPTY',
    'WRONG', 'FRESH', 'CLEAN', 'SWEET', 'TOUGH', 'PLAIN', 'LOOSE', 'TIGHT', 'EXACT',
    'BASIC', 'FINAL', 'MAJOR', 'MINOR', 'USUAL', 'TOTAL', 'EXTRA', 'INNER', 'OUTER',
    'UPPER', 'LOWER', 'FRONT', 'SOLID', 'BRIEF', 'SHARP', 'ROUGH', 'THICK', 'BLIND',
    // Tech/modern
    'EMAIL', 'PHONE', 'CLICK', 'FLASH', 'PRINT', 'PATCH', 'DEBUG', 'CACHE', 'PIXEL',
    'FRAME', 'STACK', 'QUEUE', 'ARRAY', 'FLOAT', 'WHILE', 'BREAK', 'THROW', 'CATCH',
    'CLASS', 'CONST', 'SUPER', 'MATCH', 'SLICE', 'SPLIT', 'PARSE', 'FETCH', 'ASYNC',
  ],
  6: [
    // Common words
    'PEOPLE', 'SHOULD', 'BEFORE', 'LITTLE', 'SYSTEM', 'SOCIAL', 'DURING', 'NUMBER',
    'ALWAYS', 'BECOME', 'WITHIN', 'THOUGH', 'RATHER', 'THINGS', 'BETTER', 'PUBLIC',
    'FAMILY', 'MEMBER', 'FRIEND', 'STATES', 'SCHOOL', 'GROUND', 'OTHERS', 'SECOND',
    'AROUND', 'SIMPLY', 'COURSE', 'ALMOST', 'CHANGE', 'REALLY', 'COMMON', 'ACTION',
    'NATURE', 'REASON', 'MOMENT', 'PERIOD', 'RETURN', 'APPEAR', 'FORMER', 'MATTER',
    'BEHIND', 'ACROSS', 'RESULT', 'EFFECT', 'POLICY', 'LIKELY', 'NEEDED', 'ENOUGH',
    'SINGLE', 'ANSWER', 'PERSON', 'EITHER', 'RECENT', 'CHOOSE', 'ANIMAL', 'RECORD',
    'TURNED', 'CALLED', 'WORKED', 'PLAYED', 'LOOKED', 'SEEMED', 'SHOWED', 'HELPED',
    // More verbs
    'COMING', 'GOING', 'MAKING', 'TAKING', 'GIVING', 'SEEING', 'BEING', 'HAVING',
    'DOING', 'SAYING', 'ASKING', 'TRYING', 'USING', 'MOVING', 'LIVING', 'THINKING',
    'WANTED', 'NEEDED', 'TALKED', 'WALKED', 'PASSED', 'OPENED', 'CLOSED', 'STARTED',
    'BECAME', 'BROUGHT', 'CAUGHT', 'TAUGHT', 'BOUGHT', 'FOUGHT', 'SOUGHT', 'THOUGHT',
    // Nouns
    'MOTHER', 'FATHER', 'SISTER', 'HEALTH', 'CHURCH', 'MARKET', 'OFFICE', 'GARDEN',
    'WINTER', 'SUMMER', 'SPRING', 'AUTUMN', 'LETTER', 'DOCTOR', 'POLICE', 'STREET',
    'FUTURE', 'ANSWER', 'COUPLE', 'FACTOR', 'BORDER', 'CORNER', 'BOTTOM', 'CENTER',
    'MIDDLE', 'NORMAL', 'DIRECT', 'ACTUAL', 'MENTAL', 'GLOBAL', 'MODERN', 'FORMER',
    'CITIES', 'PAPERS', 'TABLES', 'CHAIRS', 'FLOORS', 'RIVERS', 'MONTHS', 'NIGHTS',
    'HEARTS', 'FIELDS', 'HOUSES', 'HORSES', 'PLANTS', 'LEAVES', 'STONES', 'PRICES',
    // Adjectives
    'STRONG', 'SIMPLE', 'ENTIRE', 'PROPER', 'NORMAL', 'ACTIVE', 'STABLE', 'DIRECT',
    'SUDDEN', 'SENIOR', 'JUNIOR', 'FAMOUS', 'SMOOTH', 'STRICT', 'SECRET', 'SILENT',
    'BRIGHT', 'DOUBLE', 'TRIPLE', 'LATEST', 'LESSER', 'NARROW', 'FORMAL', 'MANUAL',
    'VISUAL', 'RACIAL', 'SEXUAL', 'MENTAL', 'GLOBAL', 'MODERN', 'RECENT', 'GOLDEN',
    // Tech/modern
    'LAPTOP', 'MOBILE', 'TABLET', 'SCREEN', 'DEVICE', 'SERVER', 'CLIENT', 'SOCKET',
    'MODULE', 'OBJECT', 'METHOD', 'STRING', 'NUMBER', 'BUFFER', 'STREAM', 'THREAD',
    'RENDER', 'UPDATE', 'DELETE', 'CREATE', 'INSERT', 'SELECT', 'EXPORT', 'IMPORT',
    'ONLINE', 'UPLOAD', 'BACKUP', 'SEARCH', 'BROWSE', 'FILTER', 'FORMAT', 'SUBMIT',
  ],
  7: [
    // Common words
    'ANOTHER', 'BETWEEN', 'AGAINST', 'PROBLEM', 'THOUGHT', 'BELIEVE', 'CONTROL',
    'HOWEVER', 'COUNTRY', 'PROGRAM', 'EXAMPLE', 'SERVICE', 'WHETHER', 'COMPANY',
    'SUPPORT', 'PROVIDE', 'PRESENT', 'PICTURE', 'CERTAIN', 'PROCESS', 'MILLION',
    'BECAUSE', 'THROUGH', 'WITHOUT', 'SEVERAL', 'ALREADY', 'HIMSELF', 'HERSELF',
    'NOTHING', 'BROUGHT', 'THOUGHT', 'PERHAPS', 'FINALLY', 'GENERAL', 'ACCOUNT',
    'HISTORY', 'TEACHER', 'STUDENT', 'ECONOMY', 'SOCIETY', 'SECTION', 'COLLEGE',
    'NETWORK', 'CULTURE', 'FOREIGN', 'MILLION', 'EVENING', 'MORNING', 'CENTURY',
    'NATURAL', 'QUICKLY', 'CLEARLY', 'USUALLY', 'EXACTLY', 'FURTHER', 'OUTSIDE',
    // More verbs
    'WORKING', 'LOOKING', 'TALKING', 'WALKING', 'PLAYING', 'HELPING', 'SHOWING',
    'TURNING', 'CALLING', 'FEELING', 'KEEPING', 'LEADING', 'READING', 'WRITING',
    'RUNNING', 'SITTING', 'GETTING', 'PUTTING', 'SETTING', 'CUTTING', 'HITTING',
    'STARTED', 'CHANGED', 'CREATED', 'WATCHED', 'LEARNED', 'OPENED', 'STOPPED',
    'REACHED', 'COVERED', 'OFFERED', 'ALLOWED', 'DECIDED', 'NOTICED', 'POINTED',
    'ENTERED', 'PLANNED', 'MANAGED', 'HANDLED', 'APPLIED', 'STUDIED', 'CARRIED',
    // Nouns
    'BROTHER', 'HUSBAND', 'MANAGER', 'OFFICER', 'SOLDIER', 'CAPTAIN', 'PATIENT',
    'MACHINE', 'LIBRARY', 'KITCHEN', 'BEDROOM', 'STATION', 'AIRPORT', 'VILLAGE',
    'WEATHER', 'TRAFFIC', 'JOURNEY', 'PROJECT', 'MEETING', 'SESSION', 'ARTICLE',
    'CHAPTER', 'WEBSITE', 'MESSAGE', 'SCIENCE', 'SUBJECT', 'OPINION', 'FEELING',
    'PERSONS', 'MEMBERS', 'LEADERS', 'WORKERS', 'WRITERS', 'PLAYERS', 'PARENTS',
    'MOTHERS', 'FATHERS', 'SISTERS', 'GARDENS', 'OFFICES', 'MARKETS', 'STREETS',
    // Adjectives
    'SPECIAL', 'PRIVATE', 'PERFECT', 'CENTRAL', 'AVERAGE', 'CORRECT', 'COMPLEX',
    'PRIMARY', 'CLASSIC', 'ANCIENT', 'POPULAR', 'REGULAR', 'SERIOUS', 'OBVIOUS',
    'WILLING', 'SIMILAR', 'VARIOUS', 'TYPICAL', 'HELPFUL', 'CAREFUL', 'MEDICAL',
    'FEDERAL', 'WESTERN', 'EASTERN', 'NUCLEAR', 'DIGITAL', 'CURRENT', 'GROWING',
    // Tech/modern
    'DESKTOP', 'BROWSER', 'DISPLAY', 'KEYWORD', 'NETWORK', 'PACKAGE', 'COMMAND',
    'STORAGE', 'TESTING', 'LOADING', 'PARSING', 'RUNNING', 'MAPPING', 'BINDING',
    'VIRTUAL', 'DYNAMIC', 'PRIVATE', 'BOOLEAN', 'DEFAULT', 'EXTENDS', 'FINALLY',
    'PROMISE', 'REQUEST', 'REQUIRE', 'TIMEOUT', 'TRIGGER', 'LOGGING', 'WRAPPER',
  ],
};

function buildValidWordsSetEN(wordLength: number): Set<string> {
  const solutions = SOLUTIONS_EN[wordLength] || [];
  const additional = ADDITIONAL_VALID_EN[wordLength] || [];
  return new Set([...solutions, ...additional]);
}

const VALID_WORDS_CACHE_EN: Record<number, Set<string>> = {};

export function getValidWordsEN(wordLength: number): Set<string> {
  if (!VALID_WORDS_CACHE_EN[wordLength]) {
    VALID_WORDS_CACHE_EN[wordLength] = buildValidWordsSetEN(wordLength);
  }
  return VALID_WORDS_CACHE_EN[wordLength];
}

export function isValidWordEN(word: string, wordLength: number): boolean {
  const validWords = getValidWordsEN(wordLength);
  return validWords.has(word.toUpperCase());
}
