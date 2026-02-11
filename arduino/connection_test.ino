/*
 * Arduino Connection Test
 * This simple sketch will help you verify your Arduino UNO R3 is connected and working
 * 
 * What it does:
 * 1. Blinks the built-in LED (Pin 13)
 * 2. Sends messages to Serial Monitor
 * 3. Confirms Arduino is responding
 */

void setup() {
  // Initialize serial communication at 9600 baud
  Serial.begin(9600);
  
  // Set built-in LED pin as output
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Wait for serial port to connect
  delay(1000);
  
  // Print startup messages
  Serial.println("================================");
  Serial.println("  Arduino UNO R3 Connection Test");
  Serial.println("================================");
  Serial.println("");
  Serial.println("✅ Arduino is connected!");
  Serial.println("✅ Serial communication working!");
  Serial.println("");
  Serial.println("You should see the built-in LED blinking...");
  Serial.println("If you see this message, your Arduino is working perfectly!");
  Serial.println("");
}

void loop() {
  // Blink LED ON
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("💡 LED ON");
  delay(1000);
  
  // Blink LED OFF
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("🌑 LED OFF");
  delay(1000);
}
