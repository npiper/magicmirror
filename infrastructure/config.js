/* MagicMirror² config — Wallboard (AWS deployment)
 *
 * This file is committed and safe — no secrets are hardcoded.
 * Secrets are injected at runtime by ECS from AWS Secrets Manager.
 * envsubst is run at container startup to substitute:
 *   ${GCAL_SECRET_URL}       — family calendar iCal URL
 *   ${GCAL_NP_SECRET_URL}    — Neil's personal calendar iCal URL
 *   ${OPENWEATHER_API_KEY}   — OpenWeatherMap API key
 */
let config = {
    address: "0.0.0.0",
    port: 8080,
    basePath: "/",
    ipWhitelist: [],
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
                showWindDirection: true,
                showWindDirectionAsArrow: true,
                showHumidity: true,
                showFeelsLike: true
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
                maxNumberOfDays: 3,
                showRainAmount: true,
                fade: false,
                colored: false,
                tableClass: "small"
            }
        },

        // ── Calendar data source (required by MMM-CalendarExt3) ────────────
        // Fetches events from both calendars and broadcasts them.
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
                unit: "day",
                numberOnly: true,
                events: [
                    {
                        title: "🐣 Easter Holidays",
                        targetTime: "25 Mar 2026"
                    },
                    {
                        title: "🎂 Birthday",
                        targetTime: "28 Jul 2026",
                        repeat: "yearly",
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60
                    },
                    {
                        title: "☀️ Summer Holidays",
                        targetTime: "18 Jul 2026",
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60
                    },
                    {
                        title: "🎄 Christmas",
                        targetTime: "25 Dec 2026",
                        repeat: "yearly",
                        ignoreBefore: 1000 * 60 * 60 * 24 * 60
                    }
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
                fontSize: "18px",
                eventHeight: "24px",
                maxEventLines: 12,
                showWeekNumber: false,
                useWeather: false,
                calendarSet: ["family", "personal"],
                // Prepend emoji to event title based on keyword or school subject code match.
                // School timetable codes follow the pattern: 9c/Gg2, 9YNE/Ma, 9y/Dr2 etc.
                // Subject is identified by the letters after the slash.
                eventTransformer: (event) => {
                    // School subject code mappings — matched against the code after the /
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
                    // General keyword mappings
                    const keywords = [
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
                        { keyword: "Dr",            emoji: "🩺" },
                        { keyword: "Breakfast",     emoji: "🥣" },
                        { keyword: "Exercise",      emoji: "🏃" },
                        { keyword: "Playdate",      emoji: "🎮" },
                        { keyword: "School",        emoji: "🏫" },
                    ];
                    const title = event.title || "";
                    // Standalone homeroom entry — just a form group like "9B" with no slash
                    if (/^\d+[A-Z]+$/.test(title.trim())) {
                        event.title = "🏠 " + title;
                        return event;
                    }
                    // Try school subject code first (pattern: digits+letters/SubjectCode+digits)
                    for (const { pattern, emoji, label } of subjectCodes) {
                        if (pattern.test(title)) {
                            event.title = emoji + " " + label;
                            return event;
                        }
                    }
                    // Fall back to keyword match
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

        // ── Alert ─────────────────────────────────────────────────────────
        {
            module: "alert"
        },

        // ── Update notification ───────────────────────────────────────────
        {
            module: "updatenotification",
            position: "top_bar"
        }
    ]
};

if (typeof module !== "undefined") {
    module.exports = config;
}
