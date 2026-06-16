from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
from schedules.soccer import SoccerSchedule
from schedules.basketball import BasketballSchedule
from schedules.base import CalendarCreator
from fastapi.responses import FileResponse
app = FastAPI()


#setting permissions for the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_methods = ["*"],
    allow_headers = ["*"]
)

SCHEDULE_CLASSES = {
    "soccer": SoccerSchedule,
    "basketball": BasketballSchedule
}

@app.get("/teams/{sport}/{league}")
async def get_teams(sport: str, league: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams")
        data = response.json()
        teams = [
            {
                "name": team["team"]["displayName"],
                "abbreviation": team["team"]["abbreviation"]
            }
            for team in data["sports"][0]["leagues"][0]["teams"]
        ]
        return {"teams": sorted(teams, key = lambda t: t["name"])}

class ScheduleRequest(BaseModel):
    sport: str
    league:str
    teams: list[str]
    begin_date: str
    end_date: str

@app.post("/schedule")
def create_schedule(request: ScheduleRequest):
    # reformat dates from 2026-04-01 to 20260401
    begin = request.begin_date.replace("-", "")
    end = request.end_date.replace("-", "")

    ScheduleClass = SCHEDULE_CLASSES[request.sport]
    schedule = ScheduleClass(request.league, request.teams, begin, end)
    cal = CalendarCreator(schedule)
    cal.create_ics_file("calendar.ics")
    return FileResponse(
        path = "calendar.ics",
        filename = "calendar.ics",
        media_type = "text/calendar"
    )

