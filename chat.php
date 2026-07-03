<?php
/* =========================================================
   AI Chat Proxy — forwards messages to the Claude API.
   1. Copy config.example.php to config.php
   2. Add your real API key in config.php
      Get one at: https://console.anthropic.com/
   ========================================================= */

require_once __DIR__ . '/config.php';
define('CLAUDE_MODEL',   'claude-haiku-4-5-20251001');
define('MAX_TOKENS',     350);

/* ---- CORS: allow only your own domain in production ---- */
$allowed = $_SERVER['HTTP_HOST'] ?? '*';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

/* ---- Parse request ---- */
$input   = json_decode(file_get_contents('php://input'), true);
$message = isset($input['message']) ? trim($input['message']) : '';
$history = isset($input['history']) && is_array($input['history']) ? $input['history'] : [];

if (!$message) {
    http_response_code(400);
    echo json_encode(['error' => 'No message provided']);
    exit;
}

/* ---- System prompt — who Adrita is ---- */
$system = <<<SYSTEM
You are a friendly assistant embedded in Adrita Khan's personal portfolio website. Answer questions about Adrita and help visitors navigate her site. Be warm, concise (2–4 sentences), and accurate. Do not make up details.

About Adrita Khan:
• Based in Mississauga, Ontario, Canada.
• BSc (Hons) Computer Science graduate from Toronto Metropolitan University, graduated June 2026.
• Previously: HBSc Life Sciences (double major: Biology for Health Sciences + French Studies) at the University of Toronto, 2021.
• Software Engineer Fellow at Headstarter AI (Jul – Aug 2024) — built full-stack web apps with React, Next.js, and HTML/CSS.
• Founded Afsara's Elegant Jewellery in 2020. Find it on Facebook (facebook.com/afsarasejewellery) and Instagram (@afsarasejewellery).
• Research: literature review on Transformative Learning in science (BIO399); research report on girls' education in South Asia (EDS310).
• Led Facilitated Study Group sessions for FRE272Y at UofT.
• Vice President of Boss Women UTM (2020–2021) — women's empowerment club.
• Career goal: software engineer using AI to build tools for hospitals, learning environments, and the tech industry.
• Email: adrita.khan@torontomu.ca
• LinkedIn: https://www.linkedin.com/in/adrita-khan-8b1017208/
• GitHub: https://github.com/AdritaKhan1

Site pages: Home (index.html), About (about.html), Projects (projects.html), Experience (experience.html), Contact (contact.html).

If the visitor asks where to find something, point them to the right page. If you don't know something, say so honestly.
SYSTEM;

/* ---- Build message list (keep last 10 turns to limit tokens) ---- */
$messages = [];
$trimmed  = array_slice($history, -10);
foreach ($trimmed as $h) {
    if (isset($h['role'], $h['content']) &&
        in_array($h['role'], ['user', 'assistant'], true)) {
        $messages[] = ['role' => $h['role'], 'content' => (string) $h['content']];
    }
}
$messages[] = ['role' => 'user', 'content' => $message];

/* ---- Call the Claude API ---- */
$payload = json_encode([
    'model'      => CLAUDE_MODEL,
    'max_tokens' => MAX_TOKENS,
    'system'     => $system,
    'messages'   => $messages,
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: '          . CLAUDE_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 25,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);

if ($curlErr || $httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'AI service unavailable']);
    exit;
}

$data  = json_decode($response, true);
$reply = $data['content'][0]['text'] ?? 'Sorry, I could not generate a response right now.';

echo json_encode(['reply' => $reply]);
