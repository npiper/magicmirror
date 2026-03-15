# MagicMirror² Wallboard

An open source modular smart mirror platform packed into a Docker image.
See [WALLBOARD.md](WALLBOARD.md) for a full description of the modules and features, and the upstream [documentation](https://khassel.gitlab.io/magicmirror/).

## Prerequisites

- **Docker Desktop 4.22.0+** (Docker Compose v2 with `include:` support)
- Two **Google Calendar secret iCal URLs** (one per calendar you want to display)

## Local Setup

### 1. Get your Google Calendar secret iCal URLs

For each Google Calendar you want to display:

1. Go to [calendar.google.com](https://calendar.google.com) → Settings (gear icon) → **Settings**
2. Select the calendar under **Settings for my calendars**
3. Scroll to **Integrate calendar** and copy the **Secret address in iCal format**

### 2. Create `run/.env`

Create the file `run/.env` (it is gitignored — your secrets will not be committed):

```dotenv
# Mandatory — paste your Google Calendar iCal URLs here
GCAL_SECRET_URL=https://calendar.google.com/calendar/ical/.../basic.ics
GCAL_NP_SECRET_URL=https://calendar.google.com/calendar/ical/.../basic.ics

# Optional — defaults shown below
MM_SCENARIO=server
MM_INIT=init
MM_SERVER_PORTS=80:8080
MM_MMPM=mmpm
MM_WATCHTOWER=
```

| Variable | Required | Description |
|---|---|---|
| `GCAL_SECRET_URL` | ✅ | Primary calendar iCal feed (e.g. family) |
| `GCAL_NP_SECRET_URL` | ✅ | Secondary calendar iCal feed (e.g. personal) |
| `MM_SCENARIO` | No | MagicMirror scenario (default: `server`) |
| `MM_INIT` | No | Initialisation mode (default: `init`) |
| `MM_SERVER_PORTS` | No | Host:container port mapping (default: `80:8080`) |
| `MM_MMPM` | No | Enable MMPM package manager; set to `mmpm` or leave empty |
| `MM_WATCHTOWER` | No | Enable Watchtower auto-updates; leave empty to disable |

### 3. Hardcode calendar URLs in `mounts/config/config.js`

> **Important**: MagicMirror² config is loaded as browser-side JavaScript, so `process.env` is unavailable at runtime. You must hardcode your iCal URLs directly in the file.

`mounts/config/` is gitignored so your real URLs will never be committed.

Edit `mounts/config/config.js` and replace the placeholder URLs in the `calendars:` array:

```js
{
  module: "calendar",
  config: {
    calendars: [
      {
        name: "personal",
        url: "https://calendar.google.com/calendar/ical/...personal-url.../basic.ics",
      },
      {
        name: "family",
        url: "https://calendar.google.com/calendar/ical/...family-url.../basic.ics",
      },
    ],
  },
},
```

### 4. Start MagicMirror²

```bash
cd run
docker compose up -d
```

Or use the convenience script from the repo root:

```bash
./run/start.sh
```

MagicMirror² is then available at **http://localhost**

### 5. MMPM Package Manager (optional)

If `MM_MMPM=mmpm` is set in your `.env`, the MMPM web UI is available at **http://localhost:7890**. MagicMirror² runs on port 80 (host) mapped to 8080 inside the container.

## Project Structure

```
magicmirror/
├── run/                        # Docker Compose definition and env config
│   ├── .env                    # Your local secrets (gitignored — create this)
│   ├── compose.yaml            # Top-level compose file
│   ├── start.sh                # Convenience start script
│   └── includes/               # Modular compose includes (base, server, mmpm…)
├── mounts/                     # Files bind-mounted into the container (gitignored)
│   ├── config/config.js        # MagicMirror config — hardcode calendar URLs here
│   └── modules/                # Third-party modules (e.g. MMM-CalendarExt3)
├── infrastructure/             # AWS architecture diagrams (PlantUML + SVG)
├── WALLBOARD.md                # Full feature and module documentation
└── README.md
```

---

*Upstream Docker image: [khassel/magicmirror](https://gitlab.com/khassel/magicmirror)*
