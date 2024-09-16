<?php

// List of IP addresses to exclude from the count
$exclude_ips = array(
  '1.2.3.4',
);

// Check if the IP address is in the exclude list
if (in_array($_SERVER['REMOTE_ADDR'], $exclude_ips)) {
  // Return data without updating the count
  $json_file = 'counter.json';
  if (file_exists($json_file)) {
    $data = json_decode(file_get_contents($json_file), true);
  } else {
    // Return initial data if the file does not exist
    $data = array(
      'start_date' => date('Y-m-d'), // カウント開始日を設定
      'total' => 0,
      'daily' => array()
    );
  }

  // Return the data as JSON
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}

$json_file = 'counter.json';
$data = array();

// Open the file for reading and writing
$fp = fopen($json_file, 'c+');
if (flock($fp, LOCK_EX)) {
  // Load the data
  $filesize = filesize($json_file);
  if ($filesize > 0) {
    $json_data = fread($fp, $filesize);
    $data = json_decode($json_data, true);
  } else {
    // Initialize the data
    $data = array(
      'start_date' => date('Y-m-d'), // カウント開始日を設定
      'total' => 0,
      'daily' => array()
    );
  }

  // Seek to the beginning of the file
  fseek($fp, 0);

  // Get today's date
  $today = date('Y-m-d');

  // Increment the total count
  $data['total'] += 1;

  // Increment the count for today
  if (isset($data['daily'][$today])) {
    $data['daily'][$today] += 1;
  } else {
    $data['daily'][$today] = 1;
  }

  // Delete old data
  $threshold = strtotime('-30 days');
  foreach ($data['daily'] as $date => $count) {
    if (strtotime($date) < $threshold) {
      unset($data['daily'][$date]);
    }
  }

  // Write the data back to the file
  ftruncate($fp, 0);
  fwrite($fp, json_encode($data));
  flock($fp, LOCK_UN);
} else {
  // Return an error if the file could not be locked
  header('HTTP/1.1 500 Internal Server Error');
  echo json_encode(array('error' => 'ファイルのロックに失敗しました。'));
  fclose($fp);
  exit;
}

// Close the file
fclose($fp);

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($data);
