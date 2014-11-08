<?php

if(!@empty($_POST['email'])) {

    // $delay = mt_rand(1,10);
    // sleep($delay);

    $headers = array(
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'X-Mailer' => 'PHP/' . phpversion()
    );

    if(!@empty($_POST['from'])) {
        $from = $_POST['from'];
        $headers['From'] = "$from";
        $headers['Reply-To'] = "$from";
    }

    $email = $_POST['email'];

    $message = '';
    if(!@empty($_POST['message'])) {
        $message = str_replace("\n", '', $_POST['message']);
        $message = str_replace('\"', '"', $_POST['message']);
    }

    $subject = '';
    if(!@empty($_POST['subject'])) {
        $subject = $_POST['subject'];
    }

    $msgChunks = array();
    if(!@empty($_FILES['attachment'])) {
        switch($_FILES['attachment']['error']) {
            case 0:
                $filename=$_FILES['attachment']['name'];
                $tmpname=$_FILES['attachment']['tmp_name'];

                $boundary = md5(mt_rand());
                $content = fread(fopen($tmpname,"r"),filesize($tmpname));  
                $content = chunk_split(base64_encode($content));   

                $headers['Content-Type'] = "multipart/mixed; boundary=$boundary\r\n";
                $msgChunks[] = "--{$boundary}";
                $msgChunks[] = 'Content-Type: text/html; charset="iso-8859-1"';
                $msgChunks[] = "Content-Transfer-Encoding: 7bit\r\n";
                $msgChunks[] = "$message\r\n";

                if($fh = fopen($tmpname, 'rb')) {
                    $msgChunks[] = "--{$boundary}";
                    $msgChunks[] = "Content-Type: application/octet-stream; name=\"$filename\"";
                    $msgChunks[] = "Content-Description: $filename";

                    $size = filesize($tmpname);
                    $data = fread($fh, $size);
                    $data = chunk_split(base64_encode($data));

                    $msgChunks[] = "Content-Transfer-Encoding: base64";
                    $msgChunks[] = "Content-Disposition: attachment; filename=\"{$filename}\"; size={$size};\r\n";
                    $msgChunks[] = "$data\r\n";
                    $msgChunks[] = "--{$boundary}--";
                }
                
                $message = implode("\r\n", $msgChunks);
            break;
        }
    }

    $headerString = '';
    foreach($headers as $name => $value) {
        $value = trim($value);
        if(is_numeric($name) && $value != '') {
            $headerString .= "{$value}\r\n";
        }
        else {
            $headerString .= "{$name}: $value\r\n";
        }
    }

    $result = ($mailResult = mail($email, $subject, $message, $headerString)) ? 'good' : ' bad';
    $array = array('sent' => $result, 'email' => $email);
    echo json_encode($array);
    exit;
}

?>