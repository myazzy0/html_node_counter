const CSS_SELECTOR_TARGET_NODE_LIST='.Product__link';
const CSS_SELECTOR_TARGET_NODE_NAME='p:nth-child(1)';
const CSS_SELECTOR_TARGET_NODE_NUM='p:nth-child(1) span:nth-child(2)';
const THRETHOLD_ANOMALY_NUMBER=3;

function isNormal(item) {
	return (item.num < THRETHOLD_ANOMALY_NUMBER);
}
function convertToTable(items){
	$table = $('<table></table>');
	$thead = $('<thead><th>商品名</th><th>個数</th></thead>');
	$tbody = $('<tdoby></tbody>')

	$table.append($thead);
	$table.append($tbody);

	items.forEach(item => {
		$tr = $('<tr></tr>');
		$tbody.append($tr);

		$th = $('<td></td>');
		$th.text(item.name);

		$td = $('<td></td>');
		$td.text(item.num);

		$tr.append($th);
		$tr.append($td);
	});

	return $table;
}
function sortByName(a,b){
	an = a.name;
	bn = b.name;
	return an.localeCompare(bn);
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
	    result.push({ name: current.name, num: current.num });
	  }
	  return result;
	}, []);
	return group;
}

$button = $('<button>ポチ</button>')
$('body').prepend($button);
$(document).ready(function(){

	$devField=$('<div id="devField"></div>')

        $button.click(function(){
		$devField.children().remove();
		console.log('start');

		//対象の親ノードを取ってくる
		let elements = $(CSS_SELECTOR_TARGET_NODE_LIST);
		console.log(elements);

		//jsonのitemを集める
		let items = collectItems(elements);
		console.log(items);
		
		//normalyとanomalyで分類
		const normaly = items.filter(x =>  isNormal(x));
		const anomaly = items.filter(x => !isNormal(x));
		console.log(normaly);
		console.log(anomaly);

		//集計をかける
		const sum_normaly = groupByName(normaly);
		console.log(items);
		console.log(sum_normaly);
		console.log(anomaly);

		//HTMLに整形しつつ、画面上部に表示する
		$button.after($devField);

		$devField.append('<h1>集計</h1>');
		$devField.append(convertToTable(sum_normaly.sort((a,b) => sortByName(a,b))));
		$devField.append('<h1>ハズレ値</h1>');
		$devField.append(convertToTable(anomaly.sort((a,b) => sortByName(a,b))));

		$devField.find('th').css('text-align', 'left');
		$devField.find('th,td').css({'border': '1px solid gray', 'padding': '4px'});
		$devField.find('h1').css({'background-color': '#b0c4de', 'margin-top': '10px'});
        });
});

