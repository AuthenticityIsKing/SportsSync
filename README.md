# SportSync

SportSync is a full-stack web application that allows sports fans to generate and download personalized `.ics` calendar files for their favorite basketball and soccer teams, making it seamless to sync live match schedules directly to Apple Calendar, Google Calendar, or Outlook.

Built using a modern **React** frontend and a lightweight **FastAPI** backend, the platform leverages the **ESPN API** to fetch real-time game data and compile it on the fly into standard, platform-agnostic calendar streams.

## Key Features

- **Hierarchical Multi-Stage Filtering:** Seamlessly drill down from Sport ➔ League ➔ Team to find exactly who you want to follow.
- **Dynamic `.ics` Generation:** On-the-fly serialization compliant with the official RFC 5545 (iCalendar) specification.
- **Multi-Sport Aggregation:** Combine schedules for both soccer and basketball clubs into a single, clean calendar export.
- **Cross-Platform Compatibility:** Works natively across iOS, Android, macOS, and Windows calendar clients.

## Languages/Resources Used

- **Frontend:** React, HTML5, CSS3
- **Backend:** FastAPI, Python
- **Data Source:** ESPN API
