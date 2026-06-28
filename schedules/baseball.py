import urllib.request
import json
import datetime

class BaseballSchedule:
    duration_hours = 3
    sport = "baseball"

    def __init__(self, league, clubs, begin_date, end_date):
        self.league = league
        self.clubs = clubs
        self.begin_date = begin_date
        self.end_date = end_date
        self.match_url = "https://www.espn.com/mlb/game/_/gameId/"

    def get_events(self) -> list:
        url = f"https://site.api.espn.com/apis/site/v2/sports/baseball/{self.league}/scoreboard?dates={self.begin_date}-{self.end_date}&limit=1000"
        request = urllib.request.Request(url=url)
        response = urllib.request.urlopen(request)
        raw_data = json.loads(response.read().decode("utf-8"))["events"]

        if self.clubs[0] != "all":
            raw_data = [
                event for event in raw_data
                if any(club in event["shortName"] for club in self.clubs)
            ]

        return [
            {
                "name": event["name"],
                "start_time": datetime.datetime.fromisoformat(event["date"]),
                "duration_hours": self.duration_hours,
                "url": self.match_url + event["id"]
            }
            for event in raw_data
        ]