/* MagicMirror² config — Wallboard
 *
 * Two env vars must be set before starting the container:
 *   GCAL_SECRET_URL     — family shared calendar iCal secret URL
 *   GCAL_NP_SECRET_URL  — Neil's personal calendar (neil.piper@gmail.com) iCal secret URL
 *
 * Local dev:  export GCAL_SECRET_URL="..." and GCAL_NP_SECRET_URL="..." in ~/.profile or ~/.zshrc
 * CI/CD:      stored as GitHub Actions repository secrets
 *
 * The https://calendar.google.com/calendar/ical/fc24e0a73460cb68992e8143d4be670578499950ce37126e0a5bb499ebbf2130%40group.calendar.google.com/private-ff1cfb5684fef05660b5b12c786a151b/basic.ics and https://calendar.google.com/calendar/ical/neil.piper%40gmail.com/private-72628581e63fdcb02afbb8f98f25629c/basic.ics placeholders are substituted
 * at container startup by the post_start hook in run/includes/base.yaml.
 */
let config = {
    address: "0.0.0.0",   // listen on all interfaces so the browser on the TV can connect
    port: 8080,
    basePath: "/",
    ipWhitelist: [],       // empty = allow all IPs on the local network
    useHttps: false,

    language: "en",
    locale: "en-GB",
    logLevel: ["INFO", "LOG", "WARN", "ERROR"],
    timeFormat: 24,
    units: "metric",

    modules: [
        // ── Clock — local (UK) ─────────────────────────────────────────────
        {
            module: "clock",
            position: "top_center",
            config: {
                dateFormat: "dddd D MMMM",
                showPeriod: false
            }
        },

        // ── Clock — Melbourne, Australia ───────────────────────────────────
        {
            module: "clock",
            position: "top_right",
            header: "Melbourne, Australia",
            config: {
                timezone: "Australia/Melbourne",
                dateFormat: "ddd D MMM",
                showPeriod: false,
                displayType: "digital",
                showSunTimes: false,
                displayTime: true,
                analogSize: "0px"
            }
        },

        // ── Weather — current conditions, Twickenham UK ────────────────────
        {
            module: "weather",
            position: "top_left",
            header: "Twickenham",
            config: {
                weatherProvider: "openweathermap",
                type: "current",
                weatherEndpoint: "/weather",
                apiVersion: "2.5",
                lat: 51.4499,
                lon: -0.3373,
                apiKey: "${OPENWEATHER_API_KEY}",
                units: "metric",
                showWindDirection: false,
                showHumidity: false,
                showFeelsLike: false
            }
        },

        // ── Weather — 5-day forecast, Twickenham UK ────────────────────────
        {
            module: "weather",
            position: "top_left",
            header: "Forecast",
            config: {
                weatherProvider: "openweathermap",
                type: "forecast",
                weatherEndpoint: "/forecast",
                apiVersion: "2.5",
                lat: 51.4499,
                lon: -0.3373,
                apiKey: "${OPENWEATHER_API_KEY}",
                units: "metric",
                maxNumberOfDays: 2,
                showRainAmount: true,
                fade: false,
                colored: false,
                tableClass: "small"
            }
        },

        // ── Calendar data source (required by MMM-CalendarExt3) ────────────
        // Fetches events from both calendars and broadcasts them.
        // Placeholders are substituted at container startup by post_start.
        {
            module: "calendar",
            position: "top_left",
            config: {
                broadcastPastEvents: true,
                maximumEntries: 30,
                maximumNumberOfDays: 14,
                calendars: [
                    {
                        name: "family",
                        symbol: "calendar-alt",
                        color: "#5B89C8",
                        url: "${GCAL_SECRET_URL}"
                    },
                    {
                        name: "personal",
                        symbol: "calendar-alt",
                        color: "#E8A838",
                        url: "${GCAL_NP_SECRET_URL}"
                    }
                ]
            }
        },

        // ── MMM-CountEvents — countdown to key dates ───────────────────────
        { module: "MMM-CustomElementTime" },
        {
            module: "MMM-CountEvents",
            position: "top_center",
            classes: "small",
            config: {
                refresh: 1000 * 60 * 60, // update hourly
                unit: "day",             // show days only — keeps it compact
                numberOnly: true,        // show just the number
                events: [
                    {
                        title: "🎂 Birthday",
                        targetTime: "28 Jul 2026",
                        repeat: "yearly",
                        // only show within 60 days of the birthday
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60,
                    },
                    {
                        title: "🐣 Easter Holidays",
                        targetTime: "1 Apr 2027",
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60,
                    },
                    {
                        title: "☀️ Summer Holidays",
                        targetTime: "18 Jul 2026",
                        // only show within 60 days
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60,
                    },
                    {
                        title: "🎄 Christmas",
                        targetTime: "25 Dec 2026",
                        repeat: "yearly",
                        // only show within 60 days of Christmas
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60,
                    },
                ]
            }
        },

        // ── MMM-CalendarExt3 — visual week view with emoji titles ──────────
        {
            module: "MMM-CalendarExt3",
            position: "bottom_bar",
            title: "",
            config: {
                mode: "day",
                dayIndex: -1,
                weeksInView: 1,
                firstDayOfWeek: 1,
                locale: "en-GB",
                fontSize: "20px",
                eventHeight: "30px",
                maxEventLines: 8,
                showWeekNumber: false,
                useWeather: false,
                calendarSet: ["family", "personal"],
                // Prepend emoji to event title based on format:
                //   New format: "Y9 Subject Room"  e.g. "Y9 Biology Juno", "Whole School Assembly"
                //   Old format: slash codes        e.g. "9c/Gg2", "9YNE/Ma"
                eventTransformer: (event) => {
                    // ── Word-based subjects (new "Y{year} Subject Room" format) ──────
                    const wordSubjects = [
                        { keyword: "Assembly",             emoji: "🏫", label: "Assembly" },
                        { keyword: "Personal Development", emoji: "🌱", label: "Personal Dev" },
                        { keyword: "Wellbeing",            emoji: "🌿", label: "Wellbeing" },
                        { keyword: "Biology",              emoji: "🧬", label: "Biology" },
                        { keyword: "Chemistry",            emoji: "⚗️", label: "Chemistry" },
                        { keyword: "Physics",              emoji: "⚡", label: "Physics" },
                        { keyword: "Maths",                emoji: "➗", label: "Maths" },
                        { keyword: "English",              emoji: "📖", label: "English" },
                        { keyword: "Geography",            emoji: "🌍", label: "Geography" },
                        { keyword: "History",              emoji: "🏛️", label: "History" },
                        { keyword: "Art",                  emoji: "🎨", label: "Art" },
                        { keyword: "Drama",                emoji: "🎭", label: "Drama" },
                        { keyword: "Music",                emoji: "🎵", label: "Music" },
                        { keyword: "Physical Education",   emoji: "🏃", label: "PE" },
                        { keyword: "French",               emoji: "🇫🇷", label: "French" },
                        { keyword: "Spanish",              emoji: "🇪🇸", label: "Spanish" },
                        { keyword: "Computing",            emoji: "💻", label: "Computing" },
                        { keyword: "Science",              emoji: "🔬", label: "Science" },
                        { keyword: "Design Technology",    emoji: "🔧", label: "Design Tech" },
                        { keyword: "Design Tech",          emoji: "🔧", label: "Design Tech" },
                        { keyword: "Religious",            emoji: "🙏", label: "RE" },
                        { keyword: "Tutor",                emoji: "🏠", label: "Tutor Time" },
                        { keyword: "Business",             emoji: "💼", label: "Business" },
                        { keyword: "Psychology",           emoji: "🧠", label: "Psychology" },
                        { keyword: "Latin",                emoji: "🏺", label: "Latin" },
                        { keyword: "PE",                   emoji: "🏃", label: "PE" },
                        { keyword: "RE",                   emoji: "🙏", label: "RE" },
                    ];
                    // ── Old slash-code mappings (9c/Gg2, 9YNE/Ma etc.) ───────────────
                    const subjectCodes = [
                        { pattern: /\/Ma/i,   emoji: "➗", label: "Maths" },
                        { pattern: /\/En/i,   emoji: "📖", label: "English" },
                        { pattern: /\/Sc/i,   emoji: "🔬", label: "Science" },
                        { pattern: /\/Gg/i,   emoji: "🌍", label: "Geography" },
                        { pattern: /\/Hi/i,   emoji: "🏛️", label: "History" },
                        { pattern: /\/Fr/i,   emoji: "🇫🇷", label: "French" },
                        { pattern: /\/Sp/i,   emoji: "🇪🇸", label: "Spanish" },
                        { pattern: /\/Dt/i,   emoji: "🔧", label: "Design Tech" },
                        { pattern: /\/Dr/i,   emoji: "🎭", label: "Drama" },
                        { pattern: /\/Mu/i,   emoji: "🎵", label: "Music" },
                        { pattern: /\/Pe/i,   emoji: "🏃", label: "PE" },
                        { pattern: /\/Art/i,  emoji: "🎨", label: "Art" },
                        { pattern: /\/Ar/i,   emoji: "🎨", label: "Art" },
                        { pattern: /\/Re/i,   emoji: "🙏", label: "RE" },
                        { pattern: /\/Cs/i,   emoji: "💻", label: "Computing" },
                        { pattern: /\/Bs/i,   emoji: "💼", label: "Business" },
                        { pattern: /\/Ps/i,   emoji: "🧠", label: "Psychology" },
                        { pattern: /\/Ch/i,   emoji: "⚗️", label: "Chemistry" },
                        { pattern: /\/Ph/i,   emoji: "⚡", label: "Physics" },
                        { pattern: /\/Bi/i,   emoji: "🧬", label: "Biology" },
                        { pattern: /\/La/i,   emoji: "🏺", label: "Latin" },
                        { pattern: /\/Tt/i,   emoji: "🏠", label: "Tutor Time" },
                    ];
                    // ── General keyword mappings ─────────────────────────────────────
                    const keywords = [
                        // Subjects — matches "Maths - Prepare", "English - Prepare" etc.
                        { keyword: "Maths",                emoji: "➗" },
                        { keyword: "English",              emoji: "📖" },
                        { keyword: "Biology",              emoji: "🧬" },
                        { keyword: "Chemistry",            emoji: "⚗️" },
                        { keyword: "Physics",              emoji: "⚡" },
                        { keyword: "Geography",            emoji: "🌍" },
                        { keyword: "History",              emoji: "🏛️" },
                        { keyword: "Science",              emoji: "🔬" },
                        { keyword: "French",               emoji: "🇫🇷" },
                        { keyword: "Spanish",              emoji: "🇪🇸" },
                        { keyword: "Computing",            emoji: "💻" },
                        { keyword: "Drama",                emoji: "🎭" },
                        { keyword: "Music",                emoji: "🎵" },
                        { keyword: "Art",                  emoji: "🎨" },
                        { keyword: "Latin",                emoji: "🏺" },
                        { keyword: "Business",             emoji: "💼" },
                        { keyword: "Psychology",           emoji: "🧠" },
                        { keyword: "Design Technology",    emoji: "🔧" },
                        { keyword: "Design Tech",          emoji: "🔧" },
                        { keyword: "Religious",            emoji: "🙏" },
                        // General
                        { keyword: "Football",      emoji: "⚽" },
                        { keyword: "Swimming",      emoji: "🏊" },
                        { keyword: "Dinner",        emoji: "🍽️" },
                        { keyword: "Bedtime",       emoji: "🌙" },
                        { keyword: "Park",          emoji: "🌳" },
                        { keyword: "Sewing",        emoji: "🧵" },
                        { keyword: "Homework",      emoji: "📚" },
                        { keyword: "Dentist",       emoji: "🦷" },
                        { keyword: "Orthodontist",  emoji: "🦷" },
                        { keyword: "Doctor",        emoji: "🩺" },
                        { keyword: "Breakfast",     emoji: "🥣" },
                        { keyword: "Exercise",      emoji: "🏃" },
                        { keyword: "Playdate",      emoji: "🎮" },
                        { keyword: "School",        emoji: "🏫" },
                    ];

                    const title = event.title || "";

                    // ── "Y{year} Subject Room" or "Whole School ..." ─────────────────
                    const yearPrefix = title.match(/^(?:Y\d+|Whole School)\s+(.*)/i);
                    if (yearPrefix) {
                        const stripped = yearPrefix[1].trim();
                        for (const { keyword, emoji, label } of wordSubjects) {
                            if (stripped.toLowerCase().includes(keyword.toLowerCase())) {
                                event.title = emoji + " " + label;
                                return event;
                            }
                        }
                        event.title = "📅 " + stripped;
                        return event;
                    }

                    // ── Standalone homeroom entry like "9B" ──────────────────────────
                    if (/^\d+[A-Z]+$/.test(title.trim())) {
                        event.title = "🏠 " + title;
                        return event;
                    }

                    // ── Old slash-code format: 9c/Gg2, 9YNE/Ma etc. ─────────────────
                    for (const { pattern, emoji, label } of subjectCodes) {
                        if (pattern.test(title)) {
                            event.title = emoji + " " + label;
                            return event;
                        }
                    }

                    // ── General keyword fallback ─────────────────────────────────────
                    for (const { keyword, emoji } of keywords) {
                        if (title.toLowerCase().includes(keyword.toLowerCase())) {
                            event.title = emoji + " " + title;
                            break;
                        }
                    }
                    return event;
                }
            }
        },


        // ── Alert (required by some modules) ──────────────────────────────
        {
            module: "alert"
        },

        // ── Update notification (optional — remove if not wanted) ─────────
        {
            module: "updatenotification",
            position: "top_bar"
        },

    ]
};

if (typeof module !== "undefined") {
    module.exports = config;
}
