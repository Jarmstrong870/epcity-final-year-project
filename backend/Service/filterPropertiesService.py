import urllib.request
from urllib.parse import urlencode
import json
import pandas as pd
from dotenv import load_dotenv
import os

filters = ['current_energy_efficiency', 'property_type', 'number_habitable_rooms']        