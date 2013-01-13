import copy
import urllib
from bottle import *
from pymongo import Connection

from dom43 import parser


Flats = None


@route('/static/<filename>')
def static_handler(filename):
	return static_file(filename, root='static')


@route('/scripts/<path_tail:path>')
def scripts_handle(path_tail):
	url = 'http://www.dom43.ru/estate_base/scripts/' + path_tail + '?' + request.query_string
	print(url)

	response.content_type = 'text/plain'
	return urllib.request.urlopen(url)


@route('/search')
def search_handler():
	entries = parser.parse_page(request.query_string)

	global Flats
	numbers_to_indices = { entry['number']: index for index, entry in enumerate(entries) }
	selection = Flats.find({'number': {'$in': list(numbers_to_indices.keys())}}, fields=['number'])
	for i in selection:
		entries[numbers_to_indices[i['number']]]['old'] = True

	new_entries = [ e for e in entries if not e.get('old') ]
	if new_entries:
		Flats.insert(copy.deepcopy(new_entries))

	next_offset = int(request.query.get('start', 0)) + len(entries)
	return { 'entries': entries, 'next_offset': next_offset }


@route('/')
def main_handler():
	return static_file('main.html', root='templates')


with Connection('localhost', safe=True) as conn:
	db = conn.estate
	Flats = db.flats
	Flats.ensure_index('number', unique=True)
	run(host='localhost', port=80, debug=True)
