  var Cache = new Object();
  function get(id)
  {
   return (Cache[id]) ? Cache[id] : Cache[id] = $(id);
  }


  function oblast_change(cb)
  {
   var url = 'scripts/address_selector/get_regions?oblast_id=' + cb.value;
   var region = get('region_id');
   fill_cb(region, url, 'region_row', region_change, 0);
   return true;
  }

  function region_change(cb)
  {
   var town = get('town_id');
   if (cb == null)
   { 
    town.innerHTML = '';
    town_change(null);
    return true;
   }
   var url = 'scripts/address_selector/get_towns?oblast_id=' + get('oblast_id').value + '&region_id=' + cb.value;
   fill_cb(town, url, 'town_row', town_change, 0);
   return true;
  }

  function town_change(cb)
  {
   var microregion = get('microregion_id');
   if (cb == null)
   { 
    microregion.innerHTML = '';
    microregion_change(null);
    return true;
   }
   var url = 'scripts/address_selector/get_microregions?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
             '&town_id=' + cb.value;
   fill_cb(microregion, url, 'microregion_row', microregion_change, 0);
   return true;
  }

  function microregion_change(cb)
  {
   var street = get('street_id');
   if (cb == null)
   { 
    street.innerHTML = '';
    street_change(null);
    return true;
   }
   var url = 'scripts/address_selector/get_streets?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
             '&town_id=' + get('town_id').value + '&microregion_id=' + cb.value;
   fill_cb(street, url, 'street_row', street_change, 0);
   return true;
  }

  function street_change(cb)
  {
   if (cb == null) return;
   var url = 'scripts/address_selector/get_admin_regions?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
             '&town_id=' + get('town_id').value + '&microregion_id=' + get('microregion_id').value + '&street_id=' + cb.value;
   var admin_region = get('admin_region_id');
   fill_cb(admin_region, url, 'admin_region_row', null, 0);
   return true;
  }

  function fill_cb(cb, url, div_id, func, val)
  {
    cb.innerHTML = '';
    cb.disable();
    var img = setup_wait_img(div_id);

    // Define the callbacks for the asyncRequest
    var callbacks = {
 
        success : function (o) 
           {
            // Process the JSON data returned from the server
            var list = [];
            try {
                list = o.responseJSON;
            }
            catch (x) {
                //alert("JSON Parse failed!");
                return;
            }

            // The returned data was parsed into an array of objects.
            // Add a P element for each received message
            if (list)
            {
              for (var i = 0, len = list.length; i < len; ++i)
              {
                var addr = list[i];
                var op = new Element('option'); //document.createElement('option');
                op.value = addr.address_id;
                op.innerHTML = addr.full_text;
                cb.appendChild(op);
              }
            }
            cb.enable();
            cb.value = val;
            img.remove();
            if (list) if (func != null) func(cb);
        },

        failure : function (o) 
        {
            //alert('Job bad');
            cb.enable();
            img.remove();
            //alert("Async call failed!");
            if (func != null) func(null);
        }
    }

    // Make the call to the server for JSON data
    new Ajax.Request(url,
         { method: 'get',
           onSuccess: callbacks.success,
           onFailure: callbacks.failure
         });
  }

  var init_arr = [37, 0, 0, 0, 0, 0];

  function init_addr(cb)
  {
    if (cb.id == 'oblast_id')
    {
     cb.value = init_arr[0];
     var region = get('region_id');
     var url = 'scripts/address_selector/get_regions?oblast_id=' + cb.value;
     fill_cb(region, url, 'region_row', init_addr, init_arr[1]);    
    }
    else if (cb.id == 'region_id')
    {
     var town = get('town_id');
     var url = 'scripts/address_selector/get_towns?oblast_id=' + get('oblast_id').value + '&region_id=' + cb.value;
     fill_cb(town, url, 'town_row', init_addr, init_arr[2]);
    }
    else if (cb.id == 'town_id')
    {
     var microregion = get('microregion_id');
     var url = 'scripts/address_selector/get_microregions?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
             '&town_id=' + cb.value;
     fill_cb(microregion, url, 'microregion_row', init_addr, init_arr[3]);
    }
    else if (cb.id == 'microregion_id')
    {
     var street = get('street_id');
     var url = 'scripts/address_selector/get_streets?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
               '&town_id=' + get('town_id').value + '&microregion_id=' + cb.value;
     fill_cb(street, url, 'street_row', init_addr, init_arr[4]);
    }
    else if (cb.id == 'street_id')
    {
      var url = 'scripts/address_selector/get_admin_regions?oblast_id=' + get('oblast_id').value + '&region_id=' + get('region_id').value +
             '&town_id=' + get('town_id').value + '&microregion_id=' + get('microregion_id').value + '&street_id=' + cb.value;
      var admin_region = get('admin_region_id');
      fill_cb(admin_region, url, 'admin_region_row', null, init_arr[5]);
    }
  }

// --------------- Ajax ComboBox --------------

  function setup_wait_img(element)
  {
    var img = new Element('img');//document.createElement('img');
    img.src = 'img/wait.gif';
    img.className = 'wait_img';
    $(element).insert(img, {position: 'after'});
    return img;
  }

  function change_type(cb, select_id)
  {
    var img;
    if (typeof select_id == "undefined")
    {
      select_id = "object_id";
      img = setup_wait_img('object_row');
    }
    var object_cb = $(select_id);
    object_cb.disable();
    new Ajax.Updater(object_cb, 'scripts/edit/get_objects_html?type_id:int='+cb.value,
       {method:'get', onSuccess: function(transport) {if (img) img.remove(); object_cb.enable()} });
    return true;
  }

var photo_count = 0;
function add_photo()
{
    var div = new Element('div'); //document.createElement('div');
    div.className = 'input';
    photo_count += 1;
    var id = "photo" + photo_count;
    var label = new Element('label'); //document.createElement('label');
    label.htmlFor = id;
    label.innerHTML = 'Фото №' + photo_count;
    div.appendChild(label);
    var input = new Element('input'); //document.createElement('input');
    input.id = id;
    input.name = 'photo';
    input.type = 'file';
    div.appendChild(input);
    $('photo_container').appendChild(div);
    return true;
}

// ------------------- Board Search -------------------

function setup_ok_img(element)
{
  var img = new Element('img');
  img.src = 'img/ok.png';
  img.className = 'ok_img';
  $(element).insert(img, {position: 'after'});
  return img;
}

var ac_microregion = null;
function changeMicroregionAcUrl()
{
   var url = 'scripts/address_selector/get_ac_microregions_cached?oblast_id=' + $('oblast_id').value + '&town_id=' + $('town_id').value;
   if (ac_microregion==null)
      ac_microregion = new Autocomplete('microregion', 
         { serviceUrl: url, 
           onSelect: function(value, data)
           {
             get('microregion_id').value = data;
             update_ok_img('microregion_id', 'microregion_row');
             changeStreetAcUrl();
           },
           onValueChange: function(value)
           {
             get('microregion_id').value = 0;
             update_ok_img('microregion_id', 'microregion_row');
             changeStreetAcUrl();
           }
         });
   if (ac_microregion.serviceUrl != url)
   {
     $('microregion').value = '';
     get('microregion_id').value = 0;
     ac_microregion.cachedResponse = [];
     ac_microregion.badQueries = [];
     ac_microregion.onValueChange();
     loadAdminRegions();
   }
   ac_microregion.serviceUrl = url;
}

var ac_street = null;
function changeStreetAcUrl()
{
   var url = 'scripts/address_selector/get_ac_streets_cached?oblast_id=' + $('oblast_id').value + '&town_id=' + $('town_id').value + 
             '&microregion_id=' + $('microregion_id').value;
   if (ac_street ==null)
      ac_street = new Autocomplete('street', 
         { serviceUrl: url, 
           onSelect: function(value, data)
           {
             get('street_id').value = data;
             update_ok_img('street_id', 'street_row');
           },
           onValueChange: function(value)
           {
             get('street_id').value = 0;
             update_ok_img('street_id', 'street_row');
           }
         });
   if (ac_street.serviceUrl != url)
   {
     $('street').value = '';
     get('street_id').value = 0;
     ac_street.cachedResponse = [];
     ac_street.badQueries = [];
     ac_street.onValueChange();
   }
   ac_street.serviceUrl = url;
}

function search_oblast_change(cb)
{
   var url = 'scripts/address_selector/get_towns?region_id=-1&oblast_id=' + cb.value;
   var town = get('town_id');
   update_ok_img('oblast_id', 'oblast_row');
   fill_cb(town, url, 'town_row', search_town_change, 0);
   return true;
}

function search_town_change(cb)
{
   update_ok_img('town_id', 'town_row');
   changeMicroregionAcUrl();
}

function search_object_change(cb)
{
   update_ok_img('object_id', 'object_row');
}

var ok_imgs = []
function update_ok_img(contr, row)
{
   var v = get(contr).value;
   if (v==null || v=='') v = '0';
   if (v!='0' && !ok_imgs[row]) ok_imgs[row] = setup_ok_img(row);
   else if (v=='0' && ok_imgs[row])
   {
    ok_imgs[row].remove();
    ok_imgs[row] = null;
   }
}

function update_all_ok_imgs()
{
   update_ok_img('object_id', 'object_row');
   update_ok_img('oblast_id', 'oblast_row');
   update_ok_img('town_id', 'town_row');
   update_ok_img('microregion_id', 'microregion_row');
   update_ok_img('street_id', 'street_row');
   adminRegionClick(null);
   materialClick(null);
   planningClick(null);
   sanuzelClick(null);
}

function update_demand_ok_imgs()
{
   update_ok_img('object_id', 'object_row');
}

function loadAdminRegions()
{
   var url = 'scripts/address_selector/ajax_get_admin_regions?oblast_id=' + $('oblast_id').value + 
             '&town_id=' + $('town_id').value + '&microregion_id=' + $('microregion_id').value;
   var img = setup_wait_img(get('admin_region_img'));
   new Ajax.Request(url,
         { method: 'get',
           onSuccess: function(o)
             {
               get('admin_regions_row').innerHTML = o.responseText;
               img.remove();
               adminRegionClick(null);
             }
           ,
           onFailure: function(o)
             {
               //alert('Error');
               get('admin_regions_row').innerHTML = '';
               img.remove();
               adminRegionClick(null);
             }
         });
}

function adminRegionClick(chb)
{
  checkCheckList('admin_regions_row', 'admin_region_img');
}

function materialClick(chb)
{
  checkCheckList('search_maretial_row', 'materail_label');
  setAddonOk();
}

function planningClick(chb)
{
  checkCheckList('search_planning_row', 'planning_label');
  setAddonOk();
}

function sanuzelClick(chb)
{
  checkCheckList('search_sanuzel_row', 'sanuzel_label');
  setAddonOk();
}

function setAddonOk()
{
   var flag = false;
   if (ok_imgs['sanuzel_label']) flag = true;
   if (ok_imgs['planning_label']) flag = true;
   if (ok_imgs['materail_label']) flag = true;
   var img_cont = 'addon_legend';
   if (flag && !ok_imgs[img_cont]) ok_imgs[img_cont] = setup_ok_img(img_cont);
   else if (!flag && ok_imgs[img_cont])
   {
    ok_imgs[img_cont].remove();
    ok_imgs[img_cont] = null;
   }
}

function checkCheckList(id, img_cont)
{
   var list = get(id).childElements();
   var flag = false;
   for (l in list)
   {
    if (list[l].tagName!='LABEL') continue;
    var inputs = list[l].childElements();
    for (i in inputs)
    {
      if (inputs[i].tagName!='INPUT') continue;
      if (inputs[i].checked)
      {
        flag = true;
        break;
      }
      break;
    }
    if (flag) break;
   }
   if (flag && !ok_imgs[img_cont]) ok_imgs[img_cont] = setup_ok_img(img_cont);
   else if (!flag && ok_imgs[img_cont])
   {
    ok_imgs[img_cont].remove();
    ok_imgs[img_cont] = null;
   }
   return flag; 
}


function showAddon(el)
{
 var cont = get(el);
 if (cont.style.display == 'none') cont.style.display = '';
 else cont.style.display = 'none';
}

var boardPhotos = [];

function setPhoto(img, b_id, p_id, d, e1, e2, i)
{
 var new_p_id = p_id + d;
 if (new_p_id >= 0)
 {
  if (boardPhotos[b_id][new_p_id] && boardPhotos[b_id][new_p_id]>0)
  {
   var td = img.up('td.photo');
   var loadImg = setup_wait_img(td);
   img.src = 'photos/thumbnail?p_id=' + boardPhotos[b_id][new_p_id];
   img.writeAttribute('p_id', new_p_id);
   i.innerHTML = new_p_id+1;
  }
 }
 new_p_id += d;
 if (new_p_id<0 || !(boardPhotos[b_id][new_p_id] && boardPhotos[b_id][new_p_id]>0))
 {
  e1.style.visibility = 'hidden';
  e2.style.visibility = 'visible';
 }
 else
 {
  e1.style.visibility = 'visible';
  e2.style.visibility = 'visible';
 }
}

function MovePhoto(e, d)
{
 var e1 = $(e);
 var e2;
 var i;
 if (d<0){ e2 = e1.next('div.next'); i = e1.next('div.counter').down('i'); }
 else { e2 = e1.previous('div.prev'); i = e1.previous('div.counter').down('i'); }
 var td = e1.up('table').down('td.photo');
 var img = td.down('img');
 var b_id = parseInt(img.readAttribute('b_id'));
 var p_id = parseInt(img.readAttribute('p_id'));
 if (boardPhotos[b_id])
 {
  setPhoto(img, b_id, p_id, d, e1, e2, i)
 }
 else
 {
   var url = 'scripts/photo/ajax_photo_list?b_id='+b_id;
   var wait_img = setup_wait_img(td);
   new Ajax.Request(url,
         { method: 'get',
           onSuccess: function(o)
             {
               var list = o.responseJSON;
               boardPhotos[b_id] = list;
               setPhoto(img, b_id, p_id, d, e1, e2, i);
             }
           ,
           onFailure: function(o)
             {
               //alert('Error');
               wait_img.remove();
             }
         });  
 }
 return false;
}

function ThumbLoaded(img)
{
  var wait = $(img).next('img.wait_img');
  while (wait)
  {
   wait.remove();
   wait = $(img).next('img.wait_img');
  }
}

function ShowFullPhoto(e, p_id)
{
 if (e.className == 'selected') return;
 var img = get('full_photo').down('img');
 img.src = 'photos/full_photo?p_id=' + p_id;
 var sel = get('photo_list').down('img.selected');
 if (sel) sel.className = '';
 e.className = 'selected';
}

function OpenFullPhoto(e)
{
 e = $(e);
 var b_id = parseInt(e.readAttribute('b_id'));
 var p_id = parseInt(e.readAttribute('p_id'));
 win = window.open('http://www.dom43.ru/estate_base/view_photos?b_id=' + b_id + '&p_id=' + p_id, 'view_photos',
       'location=no,width=820,height=720,top=0,scrollbars=yes,resizable=yes,status=no,toolbar=no');
 win.focus();
 return false;
}


function ClickResultPage(a)
{
 var href = a.href;
 href = href.replace('/trash', '');
 if (href.search('/demand')>0) href = href.replace('/estate_base/demand', '/estate_base/ajax_search_demand_results');
 else href = href.replace('/estate_base', '/estate_base/ajax_search_results');
 href = href.replace('#result', '');
 get('dom_overlay').show();
 get('loading1').show();
 get('loading2').show();
 new Ajax.Updater('result_container', href, {
     method: 'get',
     evalScripts: true,
     onComplete: ResultsLoaded
    });

 return false;
}


function ResultsLoaded()
{
 get('loading1').hide();
 get('loading2').hide();
 get('dom_overlay').hide();
 UpdateIEHover();
 AjaxUpdateKakaZones('http://www.dom43.ru/kaka', true);
 DisplayEditLink();
 UpdateTrashLinks();
}

function getBodyScrollTop()
{
    return self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
}

function getClientHeight()
{
  return document.documentElement.clientHeight; // document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight; 
}

function getClientCenterY()
{
    return parseInt(getClientHeight()/2)+getBodyScrollTop();
}


function CloseMap()
{
 get('precision').innerHTML = '';
 get('dom_overlay').onclick = null;
 get('yandex_map_container').hide();
 get('dom_overlay').hide();
 return false;
}

var yandex_map;

function ShowOnMap(a)
{
 var a = $(a);
 var td = a.up('td');
 var b_id = parseInt(td.readAttribute('b_id'));

 get('dom_overlay').show();
 get('dom_overlay').onclick = CloseMap;
 var top = getClientCenterY() - 260;
 get('yandex_map_container').style.top = top + 'px';
 get('yandex_map_container').show();

 var callback = function()
  {
      new Ajax.Request('scripts/board/ajax_get_info_for_map',
         { method: 'get',
           parameters: {'b_id':b_id},
           onSuccess: function(o)
             {
               var res = o.responseJSON;
               if (!res)
               {
                alert('К сожалению адрес из этого объявления не может быть отображён на карте');
                CloseMap();
                return false;
               }
               yandex_map.ShowAddress(res['address']);
             }
           ,
           onFailure: function(o)
             {
               alert('Произошла ошибка при загрузке данных с сервера. Попробуйте позднее.');
               CloseMap();
               return false;
             }
         });
   };

 if (yandex_map == null)
 {
   yandex_map = new GkYandexMap('yandex_map');
   yandex_map.cbPrecisionMsg = function(msg)
    {
     if (msg) get('precision').innerHTML = '<b>Точность результата:</b> ' + msg;
     else  get('precision').innerHTML = '';
    };
   yandex_map.cbNotFound = function()
    {
     alert("К сожалению адрес указанный в объявлении не найден");
     CloseMap();
    };
   yandex_map.Init(false, callback);
 }
 else callback();

 return false;
}
