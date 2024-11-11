from supabase import create_client, Client
"""
This is a class testing the functionality of the supaBase API , and the ability to add data directly into the 
properties table. This is for testing purposes, before we then integrate with the govt api in order to add data
as required.

"""
class SupabaseAPI:
    def __init__(self, url: str, key: str):
        
        self.client: Client = create_client(url, key)

    def add_record(self, record: dict):
        try:
            # Insert the record into the 'properties' table.
            response = self.client.table('properties').insert(record).execute()

            if response.status_code == 201:
                print("Record inserted successfully.")
            else:
                print(f"Error inserting record: {response}")

            return response
        except Exception as e:
            print(f"An error occurred: {e}")
            return {"error": str(e)}

SUPABASE_URL = 'https://uwxfjkzsanrumlwhtjyt.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGZqa3pzYW5ydW1sd2h0anl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDkzNjIxNSwiZXhwIjoyMDQ2NTEyMjE1fQ.ItCnMHdeVOpnFUsRTwBZwWhEl_H87F3zpHMT9YFhfps'

if __name__ == "__main__":
    # Initialise supabase connection
    supabase_api = SupabaseAPI(SUPABASE_URL, SUPABASE_KEY)

    sample_record = {
        "lmk_key": "test-keys",
        "address": "12 Belfast Road",
        "postcode": "BT99DR",
        "current_energy_rating": "C",
        "property_type": "Flat",
        "inspection_date": "2024-11-07"
    }
    # this has already been ran and will not add a duplicate record - amend example to see output in table
    # Add new record
    response = supabase_api.add_record(sample_record)
    print(response)

   # Next steps: need to fix columns in line with what the API key for govt website is accessing, and match this to what columns we have in the properties table