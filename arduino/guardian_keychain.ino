/*
 * Guardian SOS Keychain Device
 * Arduino UNO R3
 * 
 * Features:
 * - SOS Button for emergency alerts
 * - LED indicator for status
 * - Buzzer for audio feedback
 * - WiFi/GSM module for connectivity (optional)
 * 
 * Hardware Connections:
 * - SOS Button: Pin 2 (with pull-up resistor)
 * - LED (Red): Pin 13
 * - LED (Green): Pin 12
 * - Buzzer: Pin 11
 * - Optional: ESP8266/GSM module for internet connectivity
 */

// Pin Definitions
#define SOS_BUTTON_PIN 2
#define RED_LED_PIN 13
#define GREEN_LED_PIN 12
#define BUZZER_PIN 11

// Button state variables
int buttonState = 0;
int lastButtonState = 0;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool sosActive = false;

// Timing variables
unsigned long lastBlinkTime = 0;
unsigned long blinkInterval = 500;
bool ledState = false;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Initialize pins
  pinMode(SOS_BUTTON_PIN, INPUT_PULLUP);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Initial state - Green LED on (device ready)
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  Serial.println("Guardian SOS Keychain Initialized");
  Serial.println("Press button to trigger SOS alert");
  
  // Startup beep
  tone(BUZZER_PIN, 1000, 200);
  delay(200);
  tone(BUZZER_PIN, 1500, 200);
  delay(300);
}

void loop() {
  // Read button state with debouncing
  int reading = digitalRead(SOS_BUTTON_PIN);
  
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;
      
      // Button pressed (LOW because of pull-up)
      if (buttonState == LOW) {
        triggerSOS();
      }
    }
  }
  
  lastButtonState = reading;
  
  // Handle SOS active state (blinking LED and beeping)
  if (sosActive) {
    handleSOSState();
  }
}

void triggerSOS() {
  Serial.println("🚨 SOS TRIGGERED!");
  sosActive = true;
  
  // Turn off green LED
  digitalWrite(GREEN_LED_PIN, LOW);
  
  // Send SOS signal via Serial (can be read by connected device)
  Serial.println("SOS_ALERT");
  
  // Emergency beep pattern
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, 2000, 100);
    delay(150);
  }
  
  // If you have WiFi/GSM module, send HTTP request here
  // sendSOSToServer();
}

void handleSOSState() {
  // Blink red LED rapidly
  if (millis() - lastBlinkTime >= blinkInterval) {
    lastBlinkTime = millis();
    ledState = !ledState;
    digitalWrite(RED_LED_PIN, ledState);
    
    // Beep periodically
    if (ledState) {
      tone(BUZZER_PIN, 2500, 100);
    }
  }
  
  // Check if button is pressed again to cancel SOS
  if (digitalRead(SOS_BUTTON_PIN) == LOW) {
    delay(2000); // Hold for 2 seconds to cancel
    if (digitalRead(SOS_BUTTON_PIN) == LOW) {
      cancelSOS();
    }
  }
}

void cancelSOS() {
  Serial.println("SOS CANCELLED");
  sosActive = false;
  
  // Reset to ready state
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(GREEN_LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);
  
  // Confirmation beep
  tone(BUZZER_PIN, 1000, 500);
}

// Optional: Function to send SOS to server via WiFi/GSM
/*
void sendSOSToServer() {
  // Example for ESP8266 WiFi module
  // Send HTTP POST request to your backend
  // POST http://your-server.com/api/hardware/sos
  // Body: { "deviceId": "DEVICE_001", "latitude": 0.0, "longitude": 0.0 }
  
  Serial.println("Sending SOS to server...");
  // Implementation depends on your WiFi/GSM module
}
*/
