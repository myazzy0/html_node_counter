const CSS_SELECTOR_TARGET_NODE_LIST='tr';
const CSS_SELECTOR_TARGET_NODE_NAME='td:nth-child(1)';
const CSS_SELECTOR_TARGET_NODE_NUM='td:nth-child(2)';
const THRETHOLD_ANOMALY_NUMBER=4;

function isNormal(item) {
	return (item.num < THRETHOLD_ANOMALY_NUMBER);
}
function convertToTable(items){
	$table = $('<table></table>');

	$trs = $('<tr></tr>');
	$trn = $('<tr></tr>');
	$table.append($trs).append($trn);
	items.forEach(item => {

		$tds = $('<th></th>');
		$tds.text(item.size);
		$trs.append($tds);

		$tdn = $('<td></td>');
		$tdn.text(item.num);
		$trn.append($tdn);
	});

	return $table;
}
function toSortedJSON (items) {
    var o = {}, keys = Object.keys(items).sort((a,b) => sortByColor(a,b));
    keys.forEach(function(key){ o[key] = items[key]; }, items);
    return o;
};
function sortByName(a,b){
	an = a.name;
	bn = b.name;
	return an.localeCompare(bn);
}
function sortBySize(a,b){
	an = a.size;
	bn = b.size;
	return orderSizeCompare(an, bn);
}
function sortByColor(a,b){
	an = a;
	bn = b;
	return orderColorCompare(an, bn);
}
function orderSizeCompare(an, bn){
	let a = getSizeOrder(an);
	let b = getSizeOrder(bn);
	return a - b;
}
function orderColorCompare(an, bn){
	let a = getColorOrder(an);
	let b = getColorOrder(bn);
	return a - b;
}
function getColorOrder(key){
	console.log(key);
	return COLOR[key].order;
}
function getSizeOrder(key){
	return SIZE[key].order;
}
function collectItems(elements){
	let items = [];
	elements.each(function(i,e){
		$name=$(e).find(CSS_SELECTOR_TARGET_NODE_NAME);
		name=$name.text();
	
		$num=$(e).find(CSS_SELECTOR_TARGET_NODE_NUM);
		num=parseInt($num.text());
	
		items.push({'name': name, 'num': num});
	})
	return items;
}
function groupByName(items){
	 const group = items.reduce((result, current) => {
	  const element = result.find((p) => p.name === current.name);
	  if (element) {
	    element.num += current.num; // sum
	  } else {
	    result.push({ name: current.name, num: current.num, size: current.size});
	  }
	  return result;
	}, []);
	return group;
}
function groupBySize(items){
	 const group = items.reduce((result, current) => {
	  const element = result.find((p) => p.size === current.size);
	  if (element) {
	    element.num += current.num; // sum
	  } else {
	    result.push({ name: current.name, num: current.num });
	  }
	  return result;
	}, []);
	return group;
}
function groupByProduct(items) {
	let group = items.reduce((r, a) => {
		console.log("a", a);
		console.log('r', r);
		r[a.productName] = [...r[a.productName] || [], a];
		return r;
	}, {});
	return group;
}
function groupByColor(items) {
	let group = items.reduce((r, a) => {
		console.log("a", a);
		console.log('r', r);
		r[a.color] = [...r[a.color] || [], a];
		return r;
	}, {});
	return group;
}

const SIZE={
'SS' : {'order' : 1},
'S' :  {'order' : 10},
'M' :  {'order' : 20},
'2M' : {'order' : 30},
'3M' : {'order' : 40},
'4M' : {'order' : 50},
'L' :  {'order' : 60},
'LL' : {'order' : 70},
'2L' : {'order' : 80},
'3L' : {'order' : 90},
'4L' : {'order' : 100}
}
const COLOR={
'ブラック' : {'order' : 1},
'ライトグレー' : {'order' : 10},
'ウィンターブルー' : {'order' : 20},
'ディープレッド' : {'order' : 30},
'パールグレー' : {'order' : 40},
'ダスティピンク' : {'order' : 50},
'ネイビー' : {'order' : 60},
'ピンク' : {'order' : 70},
'アイボリー' : {'order' : 80},
'ボルドー' : {'order' : 90},
'アッシュブルー' : {'order' : 100},
'ローズピンク' : {'order' : 110},
'グリーン' : {'order' : 120}
}


function cleanzingName(item){
	let n = item.name;
	n = n.replaceAll(/[a-zA-Z][a-zA-Z][a-zA-Z]+/ig, '');
	n = n.replaceAll(/[,\(\)\ 　\.]/ig, '');
	n = n.replaceAll(/（[0-9]）/ig, '');
	item.cleansedName = n;
}
function collectSize(item){
	let tmpSize = '';
	Object.keys(SIZE).some(function(s){
		let n = item.cleansedName;

		if(!n.includes(s)){
			return;
		}
		if(s.length > tmpSize.length){
			tmpSize = s;
		}
	});
	item.size=tmpSize;
};
function collectColor(item){
	let tmpColor = '';
	Object.keys(COLOR).some(function(c){
		let n = item.cleansedName;

		if(!n.includes(c)){
			return;
		}
		if(c.length > tmpColor.length){
			tmpColor = c;
		}
	});
	item.color=tmpColor;
	console.log(item);
};
function collectProductName(item){
	let size = item.size;
	let color = item.color;
	
	let productName = item.cleansedName;
	productName = productName.replace(size, '');
	productName = productName.replace(color, '');
	item.productName = productName;
};

$button = $('<button>ポチ</button>')
$('body').prepend($button);
$(document).ready(function(){

	$devField=$('<div id="devField"></div>')

        $button.click(function(){
		$devField.children().remove();
		console.log('start');

		console.log('対象ノードを取得');
		let elements = $(CSS_SELECTOR_TARGET_NODE_LIST);
		console.log(elements);

		console.log('item収集');
		let items = collectItems(elements);

		console.log('属性分析');
		items.forEach(function(item){
			cleanzingName(item);
			collectSize(item);
			collectColor(item);
			collectProductName(item);
		});

		console.log('productでgroupBy');
		const itemsGroupedByProduct = groupByProduct(items);
		console.log(itemsGroupedByProduct);

		console.log('さらにcolorで分類');
		Object.keys(itemsGroupedByProduct).forEach(function(k){
			itemsGroupedByProduct[k] = groupByColor(itemsGroupedByProduct[k]);
		});
		console.log(itemsGroupedByProduct);

		console.log('normalyとanomalyで分類');
		const normaly = items.filter(x =>  isNormal(x));
		const anomaly = items.filter(x => !isNormal(x));
		console.log(normaly);
		console.log(anomaly);

		console.log('html整形');
		$button.after($devField);

		let $normalyContainer = $('<div id="normalyContainer"></div>');
		let $normalyHeader = $('<h1 id="normalyHeader">集計</h1>');
		$devField.append($normalyContainer.append($normalyHeader));

		$devField.append('<h1>以降オリジナル</h1>');
		console.log('=======');

		Object.keys(itemsGroupedByProduct).forEach(function(pkey){
			let p = itemsGroupedByProduct[pkey];
		        let $productBox = $('<div class="productBox"></div>');
		        let $productContainer = $('<div class="productContainer"></div>');
		        let $productHeader = $('<h2 class="productHeader"></h2>').text(pkey);
		        $normalyContainer.append($productBox.append($productHeader).append($productContainer));
			
			p = toSortedJSON(p);
			console.log(p);
			Object.keys(p).forEach(function(ckey){
				let c = p[ckey];
		        	let $colorContainer = $('<div class="colorContainer"></div>');
		        	let $colorHeader = $('<h3 class="colorHeader"></h3>').text(ckey);
		        	$productContainer.append($colorContainer.append($colorHeader));
				console.log(ckey);

				let normaly = c.filter(x =>  isNormal(x));
				let anomaly = c.filter(x => !isNormal(x));

				normaly.sort((a,b) => sortBySize(a,b));
				anomaly.sort((a,b) => sortBySize(a,b));
				console.log(normaly);
				$colorContainer.append(convertToTable(groupByName(normaly)));
				$colorContainer.append(convertToTable(anomaly).css('color','red'));
			});
		});

		$devField.find('h1').css({'font-size': '1.1rem', 'background-color': '#6495ed', 'margin-top': '10px'});
		$devField.find('h2').css({'font-size': '0.9rem', 'background-color': '#87cefa', 'margin-top': '10px'});
		$devField.find('h3').css({'font-size': '0.8rem', 'background-color': '#f5f5f5', 'margin-top': '10px'});
		$devField.find('th,td').css({'font-size': '0.8rem', 'border': '1px solid gray', 'padding': '4px'});
		$('.productContainer').css('display', 'flex');
		$('.productContainer').css({'border': '1px solid black'});
		$('.colorContainer').css({'border': '1px solid black'});

        });
});

