from rest_framework.throttling import UserRateThrottle
from django.core.cache import caches


class BurstRateThrottle(UserRateThrottle):
    scope = 'burst'

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'
