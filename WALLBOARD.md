# Wallboard — Visual Daily Timetable for Kids

## Project Summary

A self-hosted visual daily timetable displayed on a tablet or TV in the house, designed to help a young child with organisation and executive functions. The board shows the day/week schedule with icons or emojis against events so it is immediately readable without needing to unlock a device or read much text.

---

## Goal

- Always-on visual schedule accessible on a wall-mounted tablet or TV screen
- Events shown with icons/emojis mapped to activity types (e.g. School, Football, Bedtime)
- No interaction required from the child — just look at it
- Self-hosted at home, not reliant on a third-party cloud service

---

## Technology Decision

### Chosen: MagicMirror² via Docker

**Why MagicMirror²:**

- Open-source, actively maintained smart mirror / dashboard framework
- Modular — swap in/out feature modules without changing the core
- Designed to run on a TV or tablet browser as a full-screen URL
- Runs as a Docker container — easy to start, stop, update, and redeploy
- Large community, good module ecosystem

**Docker image in use:** [`karsten13/magicmirror`](https://hub.docker.com/r/karsten13/magicmirror) (unofficial but well-maintained image used by this repo)

**Relevant modules for this use case:**

| Module | Purpose |
|---|---|
| `MMM-Calendar` (built-in) | Shows calendar events from iCal / Google Calendar |
| [`MMM-CalendarExt3`](https://github.com/MMRIZE/MMM-CalendarExt3) | Rich daily/weekly visual calendar view — large tiles, better for kids |

Icon/emoji mapping is done in the MagicMirror config file — keywords in event titles (e.g. `School`, `Football`) can be mapped to emojis or icons in the module configuration.

### Rejected alternatives

| Option | Reason not chosen |
|---|---|
| Fossify Calendar | Android-native app — does not run as a web page or Docker container |
| Thruday / Google Calendar on tablet | Works as a quick start but tied to Google account, less customisable for visual display |

---

## Infrastructure

### Running scenario

This repo uses the `server` scenario: MagicMirror runs headlessly in Docker and exposes a web server. The dashboard is then viewed by pointing any browser on the local network to the server's IP and port.

**Default port:** `8080`  
**URL to view the board:** `http://<your-server-ip>:8080`

### Compose setup

The Docker Compose configuration is in `run/`:

```
run/
  compose.yaml          # Main compose file (uses `include` for modular optional services)
  .env                  # Environment variables — image tags, ports, volume paths, scenario
  includes/
    base.yaml           # Core MagicMirror service definition, volume and env defaults
    labwc.yaml          # Optional: Wayland compositor (for electron/GUI scenario only)
    mmpm.yaml           # Optional: MagicMirror Package Manager web UI
    watchtower.yaml     # Optional: Auto-update container images
    no.yaml             # Stub — disables an optional include
```

Key `.env` variables:

| Variable | Default | Purpose |
|---|---|---|
| `MM_SCENARIO` | `server` | `server` (headless+web), `electron` (local GUI), `client` (remote) |
| `MM_IMAGE` | `karsten13/magicmirror:latest` | Docker image to use |
| `MM_SERVER_PORTS` | `8080:8080` | Port exposed to the local network |
| `MM_DIR` | `/opt/magic_mirror` | Path inside the container |
| `VOLUME_CONFIG` | `../../mounts/config` | Local config folder mounted into container |
| `VOLUME_MODULES` | `../../mounts/modules` | Local modules folder |
| `VOLUME_CSS` | `../../mounts/css/custom.css` | Custom CSS overrides |

Configuration and modules live in `mounts/` on the host and are bind-mounted into the container, so edits take effect without rebuilding the image.

### Known deployment issue

`compose.yaml` uses the `include:` top-level key, which requires **Docker Compose v2.20.0+** (bundled with **Docker Desktop 4.22.0+**).

Running an older version gives:
```
validating compose.yaml: (root) Additional property include is not allowed
```

**Fix:** Update Docker Desktop. As of this writing the current release is 4.64.0, which includes a compatible Compose version.

---

## Configuration — MagicMirror

MagicMirror is configured via `mounts/config/config.js`. Key sections for the wallboard use case:

### Calendar module (built-in)

```js
{
    module: "calendar",
    header: "Schedule",
    position: "top_left",
    config: {
        calendars: [
            {
                symbol: "calendar",
                url: "https://calendar.google.com/calendar/ical/<your-id>/basic.ics"
            }
        ]
    }
}
```

Google Calendar public ICal URL (or any ICal-compatible feed) works here.

### Emoji/icon mapping

With `MMM-CalendarExt3` you can map event title keywords to emojis in config:

```js
symbolClass: {
    "School":    "🏫",
    "Football":  "⚽",
    "Dinner":    "🍽️",
    "Bedtime":   "🌙",
    "Swimming":  "🏊",
}
```

---

## To Do / Next Steps

- [ ] Update Docker Desktop to 4.22.0+ and verify `docker compose up -d` runs cleanly from `run/`
- [ ] Populate `mounts/config/config.js` with calendar source(s)
- [ ] Install and configure `MMM-CalendarExt3` for the large visual daily view
- [ ] Define emoji/icon keyword mappings for the child's regular activities
- [ ] Mount the tablet on the wall and set the browser to kiosk / always-on mode
- [ ] Test: confirm the timetable updates automatically when calendar events change

---

## References

- [MagicMirror² documentation](https://khassel.gitlab.io/magicmirror/) (this image's docs)
- [MagicMirror² official docs](https://docs.magicmirror.builders/)
- [karsten13/magicmirror Docker Hub](https://hub.docker.com/r/karsten13/magicmirror)
- [MMM-CalendarExt3 GitHub](https://github.com/MMRIZE/MMM-CalendarExt3)
