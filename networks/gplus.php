<?php

function count_gplus_likes($url)
{
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, "https://clients6.google.com/rpc");
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode(array(array(
			'method' => 'pos.plusones.get',
			'id' => 'p',
			'jsonrpc' => '2.0',
			'key' => 'p',
			'apiVersion' => 'v1',
			'params' => array(
				'nolog' => true,
				'id' => $url,
				'source' => 'widget',
				'userId' => '@viewer',
				'groupId' => '@self',
			)
		)
	)));
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
	$curl_results = curl_exec($curl);
	curl_close($curl);

	$json = json_decode($curl_results, true);
	if (isset($json[0]['result']['metadata']['globalCounts']['count'])) {
		return (int) $json[0]['result']['metadata']['globalCounts']['count'];
	} else {
		return null;
	}
}
