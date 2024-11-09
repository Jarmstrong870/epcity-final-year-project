import urllib.request
from urllib.parse import urlencode
import json
import csv

# Populate token with the actual base64-encoded API token
token = "am9obm1jYXRhbW5leTAyQGdtYWlsLmNvbTozZDJmMGQzZTAyYWE3ZmU3MGQ1ZGEzODQ4NzdmMGM3YzZmNjQ5ZGYy"

headers = {
    'Accept': 'application/json',
    'Authorization': f'Basic {token}'
}

# Define base URL and query parameters
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
query_params = {"local-authority": 'Liverpool'}  

# Encode query parameters
encoded_params = urlencode(query_params)

# Append parameters to the base URL
full_url = f"{base_url}?{encoded_params}"

# Define the column order
column_names = [
    "lmk-key", "address1", "address2", "address3", "postcode",
    "building-reference-number", "current-energy-rating", "potential-energy-rating",
    "current-energy-efficiency", "potential-energy-efficiency", "property-type",
    "built-form", "inspection-date", "local-authority", "constituency",
    "county", "lodgement-date", "transaction-type", "environment-impact-current",
    "environment-impact-potential", "energy-consumption-current", 
    "energy-consumption-potential", "co2-emissions-current", 
    "co2-emiss-curr-per-floor-area", "co2-emissions-potential", 
    "lighting-cost-current", "lighting-cost-potential", "heating-cost-current",
    "heating-cost-potential", "hot-water-cost-current", "hot-water-cost-potential",
    "total-floor-area", "energy-tariff", "mains-gas-flag", "floor-level",
    "flat-top-storey", "flat-storey-count", "main-heating-controls",
    "multi-glaze-proportion", "glazed-type", "glazed-area", "extension-count",
    "number-habitable-rooms", "number-heated-rooms", "low-energy-lighting",
    "number-open-fireplaces", "hotwater-description", "hot-water-energy-eff",
    "hot-water-env-eff", "floor-description", "floor-energy-eff", 
    "floor-env-eff", "windows-description", "windows-energy-eff",
    "windows-env-eff", "walls-description", "walls-energy-eff",
    "walls-env-eff", "secondheat-description", "sheating-energy-eff",
    "sheating-env-eff", "roof-description", "roof-energy-eff", 
    "roof-env-eff", "mainheat-description", "mainheat-energy-eff",
    "mainheat-env-eff", "mainheatcont-description", "mainheatc-energy-eff",
    "mainheatc-env-eff", "lighting-description", "lighting-energy-eff",
    "lighting-env-eff", "main-fuel", "wind-turbine-count", "heat-loss-corridor",
    "unheated-corridor-length", "floor-height", "photo-supply", 
    "solar-water-heating-flag", "mechanical-ventilation", "address",
    "local-authority-label", "constituency-label", "posttown",
    "construction-age-band", "lodgement-datetime", "tenure",
    "fixed-lighting-outlets-count", "low-energy-fixed-light-count", 
    "uprn", "uprn-source"
]

try:
    # Make the request with headers and error handling
    request = urllib.request.Request(full_url, headers=headers)
    with urllib.request.urlopen(request) as response:
        response_body = response.read().decode()  # Decode the response body

        # Parse the JSON response
        data = json.loads(response_body)

        # Check if data contains 'rows'
        if 'rows' in data:
            with open('epc_data.csv', mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.DictWriter(csv_file, fieldnames=column_names)
                writer.writeheader()  # Write the header row

                # Write each property's data to the CSV file
                for property in data['rows']:
                    # Print each local authority as a check
                    local_authority_value = property.get("local-authority", "N/A")
                    print(f"Local Authority: {local_authority_value}")

                    # Write the property row to the CSV
                    writer.writerow({key: property.get(key, "") for key in column_names})

            print("Data has been written to epc_data.csv")
        else:
            print("No data found in the response.")

except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")
