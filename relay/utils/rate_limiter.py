import time
from collections import defaultdict
from typing import Dict, Tuple


class RateLimiter:
    def __init__(self):
        self._minute: Dict[str, list] = defaultdict(list)
        self._day: Dict[str, list] = defaultdict(list)

    def check(self, key: str, max_per_minute: int, max_per_day: int) -> Tuple[bool, str]:
        now = time.time()
        minute_ago = now - 60
        day_ago = now - 86400

        self._minute[key] = [t for t in self._minute[key] if t > minute_ago]
        self._day[key] = [t for t in self._day[key] if t > day_ago]

        if len(self._minute[key]) >= max_per_minute:
            return False, f"Rate limit exceeded: {max_per_minute} per minute"
        if len(self._day[key]) >= max_per_day:
            return False, f"Daily limit exceeded: {max_per_day} per day"

        self._minute[key].append(now)
        self._day[key].append(now)
        return True, ""


rate_limiter = RateLimiter()
