<?php
// Nordic Autos Contact Form Handler - GDPR Compliant
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : 'Generel henvendelse';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$consent = isset($_POST['consent']) ? $_POST['consent'] : '';

// Validate required fields
$errors = [];
if (empty($name)) $errors[] = 'Navn er påkrævet';
if (empty($email)) $errors[] = 'Email er påkrævet';
if (empty($message)) $errors[] = 'Besked er påkrævet';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Ugyldig email adresse';
if (empty($consent)) $errors[] = 'Du skal acceptere at vi kontakter dig';

// Check for spam (simple honeypot and basic validation)
$honeypot = isset($_POST['bot-field']) ? $_POST['bot-field'] : '';
if (!empty($honeypot)) {
    // This is likely spam - log but don't reveal
    error_log('Spam attempt detected from IP: ' . $_SERVER['REMOTE_ADDR']);
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Email configuration
$to = 'info@nordicautos.dk';
$email_subject = 'Ny henvendelse fra Nordic Autos hjemmeside';

// Create email content
$email_body = "Du har modtaget en ny henvendelse fra Nordic Autos hjemmesiden:\n\n";
$email_body .= "Navn: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Telefon: " . ($phone ?: 'Ikke angivet') . "\n";
$email_body .= "Emne: " . $subject . "\n\n";
$email_body .= "Besked:\n" . $message . "\n\n";
$email_body .= "---\n";
$email_body .= "Sendt fra: Nordic Autos kontaktformular\n";
$email_body .= "Tidspunkt: " . date('d-m-Y H:i:s') . "\n";
$email_body .= "GDPR: Brugeren har givet samtykke til kontakt\n";

// Email headers
$headers = array();
$headers[] = 'From: Nordic Autos Website <noreply@' . $_SERVER['HTTP_HOST'] . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// Send email
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // GDPR Compliant logging - minimal data, automatic cleanup
    $log_entry = date('Y-m-d H:i:s') . " - Email sent successfully\n";
    
    // Create log file if it doesn't exist
    $log_file = 'contact_log.txt';
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    
    // Auto-cleanup: Remove log entries older than 30 days (GDPR compliance)
    if (file_exists($log_file)) {
        $lines = file($log_file, FILE_IGNORE_NEW_LINES);
        $cutoff_date = date('Y-m-d', strtotime('-30 days'));
        $filtered_lines = array_filter($lines, function($line) use ($cutoff_date) {
            $line_date = substr($line, 0, 10);
            return $line_date >= $cutoff_date;
        });
        
        if (count($filtered_lines) < count($lines)) {
            file_put_contents($log_file, implode("\n", $filtered_lines) . "\n");
        }
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Tak for din besked! Vi kontakter dig snarest.',
        'gdpr_notice' => 'Dine oplysninger behandles i henhold til vores privatlivspolitik'
    ]);
} else {
    // Log error without personal data
    error_log('Email sending failed from contact form at ' . date('Y-m-d H:i:s'));
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Der opstod en fejl ved afsendelse. Prøv igen eller ring til os på +45 25 45 45 63.'
    ]);
}
?>