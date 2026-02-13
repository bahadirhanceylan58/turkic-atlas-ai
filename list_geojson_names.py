
import json

try:
    with open('public/data/raw-geo/world_1000.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    names = []
    if 'features' in data:
        for feature in data['features']:
            props = feature.get('properties', {})
            name = props.get('NAME')
            if name:
                names.append(name)
            else:
                names.append(f"NO_NAME (keys: {list(props.keys())})")
    
    print("Found names:")
    for n in sorted(names):
        print(f"- {n}")

except Exception as e:
    print(f"Error: {e}")
