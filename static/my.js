var EntryTemplate = '';
var NextOffset = 0;

$j.get('static/entry.tmpl', function(data) { EntryTemplate = data; });


function MakeEntry(entry_data)
{
	if ('price' in entry_data && 'area_total' in entry_data)
	{
		entry_data.price_per_meter = (entry_data.price / entry_data.area_total).toFixed(1)		
	}

	return Mustache.to_html(EntryTemplate, entry_data)
}

function SearchSubmit(a, method)
{
	form = get('form');
	if (method != 'new')
	{
		form["start"].value = NextOffset;
	}

	query = form.serialize();
	$j.getJSON('search', query,
		function(data)
		{
			var entries = [];
			$j.each(data.entries, function (i, entry_data) { entries.push(MakeEntry(entry_data)) });
			elem = $j('.boards_table > tbody');
			if (method == 'more')
			{
				elem.append(entries);
			}
			else
			{
				elem.html(entries);
			}


			NextOffset = data.next_offset
		}
	);

 	return false;
}
