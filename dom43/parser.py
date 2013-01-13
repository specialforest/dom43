import itertools
import lxml.html
import os
import os.path
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime


def pairwise(iterable):
  a, b = itertools.tee(iterable)
  next(b, None)
  return zip(a, b)


def get_stripped_text(element):
  element.text.strip() if element.text else None


def safe_number(text):
  try:
    return float(text)
  except ValueError:
    return None


def remove_null_values(dictionary):
  return dict(filter(lambda item: item[1] != None, dictionary.items()))


def parse_entry(first, second):
  object = {}
  object["object"] = first.find_class("object")[0][1].text
  elem = first.find_class("planning")
  object["planning"] = elem[0][0].tail.strip() if elem else None
  object["address"] = first.find_class("address")[0][0].tail.strip()
  object["zone"] = first[1].text.strip()
  object["floor"] = first[2].text
  object["material"] = first[2][0].tail.strip() if first[2][0].tail else None
  if first[3].text:
    area_values = first[3].text.split('/')
    object["area_total"] = safe_number(area_values[0])
    object["area_living"] = safe_number(area_values[1])
    object["area_kitchen"] = safe_number(area_values[2])
    
  object["price"] = first[5][0].text.strip() if len(first[5]) > 0 and first[5][0].text else None
  object["number"] = second.find_class("number")[0][0].tail.strip()
  object["date"] = second.find_class("date")[0][0].tail.strip()
  elem = second.find_class("add_container")
  if elem:
    object["extra"] = elem[0][0].text
    object["contact"] = elem[0][1].text

  elem = first.find_class("photo")
  if elem and len(elem) > 0 and len(elem[0]) > 0:
    object["has_photo"] = True
    object["photo_count"] = int(re.search(r"^(\d+)", elem[0][0].text).group(1))

  return remove_null_values(object)


def parse_photo_list(entry_id):
  params = urllib.parse.urlencode({"b_id": entry_id})
  response = urllib.request.urlopen("http://www.dom43.ru/estate_base/view_photos?{0}".format(params))
  page = lxml.html.parse(response)
  links = page.xpath("//*[@id='photo_list']/li/img/@src")
  pattern = re.compile(r"p_id=(\d+)")
  return [int(pattern.search(link).group(1)) for link in links]


def download_photo(p_id):
  filename = "data/photos/photo{0}.jpg".format(p_id)
  if os.path.exists(filename): return
  params = urllib.parse.urlencode({"p_id": p_id})
  response = urllib.request.urlopen("http://www.dom43.ru/estate_base/photos/full_photo?{0}".format(params))
  with open(filename, "wb") as output:
    output.write(response.read())


def download_photos(photos):
  for id in photos:
    download_photo(id)


def parse_page(params):
  print("Requesting page")
  response = urllib.request.urlopen("http://www.dom43.ru/estate_base?{0}".format(params))
  #with open("page.html", "wb") as f:
  #  f.write(response.readall())

  print("Parsing page")
  page = lxml.html.parse(response)
  rows = page.xpath("//*[@id='search_results']/table/tr")
  entries = []
  for first, last in pairwise(rows):
    if not ("first" in first.attrib.get("class", "") and
      "last" in last.attrib.get("class", "")):
      continue

    try:
      object = parse_entry(first, last)
    except:
      print("Failed to parse entry:")
      print(lxml.html.tostring(first))
      print(lxml.html.tostring(last))
      raise

    entries.append(object)


  print("Processed {0} entries".format(len(entries)))
  return entries;
