from ics import Calendar, Event
import datetime
class CalendarCreator:
    def __init__(self, schedule):
        self.events = schedule.get_events()

    def create_ics_file(self, filename="calendar.ics"):
        c = Calendar()
        for event_data in self.events:
            e = Event()
            e.name = event_data["name"]
            e.begin = event_data["start_time"]
            e.end = event_data["start_time"] + datetime.timedelta(hours=event_data["duration_hours"])
            e.description = event_data["url"]
            c.events.add(e)

        with open(filename, 'w') as file:
            file.writelines(c)