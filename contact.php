<?php
/* =========================================================
   Contact form handler — receives the form POST, sends an
   email to Adrita, and returns JSON {ok: true/false}.
   ========================================================= */

define('TO_EMAIL',   'adrita.khan@torontomu.ca');
define('TO_NAME',    'Adrita Khan');
define('SITE_NAME',  'adritakhan.com');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

/* ---- Read + sanitize ---- */
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');
$honey   = $_POST['website'] ?? ''; // honeypot — bots fill this, humans don't

/* ---- Validation ---- */
if ($honey !== '') {
    /* Silent discard for bots */
    echo json_encode(['ok' => true]);
    exit;
}

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

if (!$subject) { $subject = 'Message from ' . $name; }

/* ---- Build the email ---- */
$emailSubject = '[Portfolio] ' . $subject;

$body  = "You have a new message from your portfolio contact form.\n\n";
$body .= "Name:    {$name}\n";
$body .= "Email:   {$email}\n";
$body .= "Subject: {$subject}\n";
$body .= str_repeat('-', 40) . "\n\n";
$body .= $message . "\n\n";
$body .= str_repeat('-', 40) . "\n";
$body .= "Sent via " . SITE_NAME . "\n";

$headers  = "From: " . SITE_NAME . " <no-reply@" . SITE_NAME . ">\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

/* ---- Send ---- */
$sent = mail(TO_EMAIL, $emailSubject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Sorry, the message could not be sent. Please email me directly.']);
}
