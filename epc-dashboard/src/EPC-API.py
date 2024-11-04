import urllib.request
from urllib.parse import urlencode
import base64

# Populate token with the actual base64-encoded API token
token = "am9obm1jYXRhbW5leTAyQGdtYWlsLmNvbTozZDJmMGQzZTAyYWE3ZmU3MGQ1ZGEzODQ4NzdmMGM3YzZmNjQ5ZGYy"

headers = {
    'Accept': 'application/json',
    'Authorization': f'Basic {token}'
}

# Define base URL and query parameters
base_url = 'https://epc.opendatacommunities.org/api/v1/domestic/search'
query_params = {'local_authority': 'Liverpool'}

# Encode query parameters
encoded_params = urlencode(query_params)

# Append parameters to the base URL
full_url = f"{base_url}?{encoded_params}"

try:
    # Make the request with headers and error handling
    request = urllib.request.Request(full_url, headers=headers)
    with urllib.request.urlopen(request) as response:
        response_body = response.read().decode()  # Decode the response body

        # Save response to a text file
        with open('api_response.txt', 'w') as file:
            file.write(response_body)
        print("Response saved to api_response.txt")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.reason}")
except urllib.error.URLError as e:
    print(f"URL Error: {e.reason}")