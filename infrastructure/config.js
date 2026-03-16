/* MagicMirror² config — Wallboard (AWS deployment)
 *
 * This file is committed and safe — no secrets are hardcoded.
 * GCAL_SECRET_URL is injected at runtime by ECS from AWS Secrets Manager.
 *
 * basePath is set to /ourwallboard/ to match the ALB path routing rule.
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
        // ── Clock ──────────────────────────────────────────────────────────
        {
            module: "clock",
            position: "top_center",
            config: {
                dateFormat: "dddd D MMMM",
                showPeriod: false
            }
        },

        // ── Family Calendar ────────────────────────────────────────────────
        {
            module: "calendar",
            header: "Family Schedule",
            position: "top_left",
            config: {
                maximumEntries: 20,
                maximumNumberOfDays: 7,
                displaySymbol: true,
                defaultSymbol: "calendar-alt",
                calendars: [
                    {
                        symbol: "calendar-alt",
                        color: "#5B89C8",
                        url: process.env.GCAL_SECRET_URL
                    }
                ],
                customEvents: [
                    { keyword: "School",        symbol: "🏫" },
                    { keyword: "Football",       symbol: "⚽" },
                    { keyword: "Swimming",       symbol: "🏊" },
                    { keyword: "Dinner",         symbol: "🍽️" },
                    { keyword: "Bedtime",        symbol: "🌙" },
                    { keyword: "Park",           symbol: "🌳" },
                    { keyword: "Sewing",         symbol: "🧵" },
                    { keyword: "Homework",       symbol: "📚" },
                    { keyword: "Dentist",        symbol: "🦷" },
                    { keyword: "Orthodontist",   symbol: "🦷" },
                    { keyword: "Doctor",         symbol: "🩺" },
                    { keyword: "Dr",             symbol: "🩺" },
                    { keyword: "Breakfast",      symbol: "🥣" },
                    { keyword: "Exercise",       symbol: "🏃" },
                    { keyword: "Playdate",       symbol: "🎮" }
                ]
            }
        },

        // ── Alert ─────────────────────────────────────────────────────────
        {
            module: "alert"
        }
    ]
};

if (typeof module !== "undefined") {
    module.exports = config;
}
