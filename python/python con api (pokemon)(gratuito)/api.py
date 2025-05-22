import requests
print(requests.__version__)

URL = "https://pokeapi.co/api/v2/pokemon/"

pokemon = input("escribe un pokemon")


response = requests.get(URL + pokemon)
data = response.json()



print(f"--------todos los movimientos de {pokemon}:---------")
for move in data["moves"]:
    print(move["move"]["name"])

print(f"--------tipo de {pokemon}:---------")
for type in data["types"]:
    print(type["type"]["name"])


