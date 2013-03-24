import urllib.parse
from pymongo import Connection
from dom43 import parser


def remove_old_entries(entries, db_entries):
	numbers_to_indices = { entry['number']: index for index, entry in enumerate(entries) }
	selection = db_entries.find({'number': {'$in': list(numbers_to_indices.keys())}}, fields=['number'])
	old_entries_indices = map(lambda x: numbers_to_indices[x['number']], selection)
	for i in sorted(old_entries_indices, reverse=True):
		del entries[i]


def parse_pages(flats):
	parse_params = {
		'object_type': 0,
		'operation': 0,
		'oblast_id': 37,
		'town_id': 99511,
		'view': 'table'
	}

	offset = 0
	while True:
		parse_params['start'] = offset
		entries = parser.parse_page(urllib.parse.urlencode(parse_params))
		entries_parsed = len(entries)
		remove_old_entries(entries, flats)
		if not entries:
			break

		flats.insert(entries)
		print("Parsed {0} entries, added {1} new entries".format(entries_parsed, len(entries)))
		offset += entries_parsed


def main():
	with Connection('localhost', safe=True) as conn:
		db = conn.estate
		col = db.flats
		parse_pages(col)


if __name__ == '__main__':
	main()
