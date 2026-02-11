# Guardian SOS Keychain - Arduino Hardware Guide

## 🔧 Hardware Components Required

### Essential Components:
1. **Arduino UNO R3** - Main microcontroller
2. **Push Button** - SOS trigger button
3. **Red LED** - Alert indicator
4. **Green LED** - Ready/status indicator
5. **Buzzer** (Active or Passive) - Audio feedback
6. **Resistors**:
   - 2x 220Ω (for LEDs)
   - 1x 10kΩ (pull-down for button)
7. **Breadboard** - For prototyping
8. **Jumper Wires** - Male-to-male
9. **USB Cable** - For programming and power
10. **Keychain Enclosure** (optional) - For final product

### Optional Components (for connectivity):
- **ESP8266 WiFi Module** - For internet connectivity
- **SIM800L GSM Module** - For cellular connectivity
- **GPS Module (NEO-6M)** - For location tracking
- **Battery Pack** (9V or Li-ion) - For portable operation

---

## 📐 Circuit Diagram

### Pin Connections:

```
Arduino UNO R3 Connections:
┌─────────────────────────────────────┐
│                                     │
│  Pin 2  ──→ SOS Button ──→ GND     │
│  Pin 11 ──→ Buzzer (+) ──→ GND     │
│  Pin 12 ──→ Green LED ──→ 220Ω ──→ GND
│  Pin 13 ──→ Red LED ──→ 220Ω ──→ GND
│                                     │
│  5V  ──→ Power Rail                │
│  GND ──→ Ground Rail                │
└─────────────────────────────────────┘
```

### Detailed Connections:

#### 1. SOS Button
```
Arduino Pin 2 ──→ Button Terminal 1
Button Terminal 2 ──→ GND
(Internal pull-up resistor enabled in code)
```

#### 2. Red LED (Alert Indicator)
```
Arduino Pin 13 ──→ Anode (+) of Red LED
Cathode (-) of Red LED ──→ 220Ω Resistor ──→ GND
```

#### 3. Green LED (Ready Indicator)
```
Arduino Pin 12 ──→ Anode (+) of Green LED
Cathode (-) of Green LED ──→ 220Ω Resistor ──→ GND
```

#### 4. Buzzer
```
Arduino Pin 11 ──→ Buzzer (+) Positive Terminal
Buzzer (-) Negative Terminal ──→ GND
```

---

## 🔌 Assembly Steps

### Step 1: Breadboard Setup
1. Place Arduino UNO on your workspace
2. Connect breadboard power rails to Arduino:
   - Arduino 5V → Breadboard (+) rail
   - Arduino GND → Breadboard (-) rail

### Step 2: Install Button
1. Insert push button into breadboard
2. Connect one terminal to Arduino Pin 2
3. Connect other terminal to GND rail
4. (Pull-up resistor is handled in software)

### Step 3: Install LEDs
1. **Green LED:**
   - Long leg (anode) → 220Ω resistor → Pin 12
   - Short leg (cathode) → GND rail

2. **Red LED:**
   - Long leg (anode) → 220Ω resistor → Pin 13
   - Short leg (cathode) → GND rail

### Step 4: Install Buzzer
1. Connect buzzer positive (+) to Pin 11
2. Connect buzzer negative (-) to GND rail

### Step 5: Double-Check Connections
- Verify all GND connections
- Check LED polarity (long leg = positive)
- Ensure button is properly connected

---

## 💻 Software Setup

### 1. Install Arduino IDE
- Download from: https://www.arduino.cc/en/software
- Install for your operating system

### 2. Upload Code
1. Open `guardian_keychain.ino` in Arduino IDE
2. Select **Tools → Board → Arduino UNO**
3. Select **Tools → Port → [Your COM Port]**
4. Click **Upload** button (→)
5. Wait for "Done uploading" message

### 3. Test the Device
1. Open **Tools → Serial Monitor**
2. Set baud rate to **9600**
3. You should see: "Guardian SOS Keychain Initialized"
4. Press the button to test SOS trigger

---

## 🎯 How It Works

### Normal Operation (Ready State):
- ✅ Green LED is ON
- 🔴 Red LED is OFF
- 🔇 Buzzer is silent
- Device is waiting for SOS trigger

### SOS Triggered:
1. **User presses button**
2. **Device responds:**
   - Green LED turns OFF
   - Red LED starts BLINKING rapidly
   - Buzzer emits emergency beep pattern
   - Serial message sent: "SOS_ALERT"
3. **Alert continues** until cancelled

### Cancel SOS:
- Hold button for 2 seconds
- Device returns to ready state
- Confirmation beep plays

---

## 🌐 Adding WiFi Connectivity (Optional)

### Using ESP8266 Module:

#### Additional Connections:
```
ESP8266 → Arduino
VCC → 3.3V
GND → GND
TX → Pin 10 (Software Serial RX)
RX → Pin 9 (Software Serial TX)
```

#### Modified Code:
Add this to your Arduino sketch:
```cpp
#include <SoftwareSerial.h>

SoftwareSerial esp8266(10, 9); // RX, TX

void sendSOSToServer() {
  String url = "http://your-server.com/api/hardware/sos";
  
  esp8266.println("AT+CIPSTART=\"TCP\",\"your-server.com\",80");
  delay(2000);
  
  String postData = "{\"deviceId\":\"DEVICE_001\",\"latitude\":0.0,\"longitude\":0.0}";
  
  esp8266.println("AT+CIPSEND=" + String(postData.length()));
  delay(1000);
  esp8266.println(postData);
}
```

---

## 📦 Keychain Enclosure Design

### Recommended Dimensions:
- **Size:** 60mm x 40mm x 20mm
- **Material:** 3D printed ABS or PLA
- **Features:**
  - Hole for button access
  - LED light pipes for indicators
  - Buzzer sound holes
  - Keyring attachment point
  - USB port access for charging/programming

### 3D Printing Tips:
1. Use 20% infill for strength
2. Print with supports for overhangs
3. Sand and smooth edges
4. Consider adding a transparent window for LEDs

---

## 🔋 Power Options

### Option 1: USB Power (Development)
- Connect via USB cable
- Powered by computer or USB adapter
- Best for testing

### Option 2: Battery Power (Portable)
- **9V Battery:**
  - Connect to Arduino VIN and GND
  - Lasts 8-12 hours with normal use
  
- **Li-ion Battery (3.7V):**
  - Use with voltage regulator (5V output)
  - Rechargeable option
  - Lasts 24+ hours

### Option 3: Power Bank
- Connect via USB
- Most convenient for extended use
- Can recharge on the go

---

## 🧪 Testing Checklist

- [ ] Green LED lights up on power-on
- [ ] Startup beep plays correctly
- [ ] Button press triggers SOS
- [ ] Red LED blinks during SOS
- [ ] Emergency beep pattern plays
- [ ] Serial monitor shows "SOS_ALERT"
- [ ] Hold button cancels SOS
- [ ] Device returns to ready state
- [ ] All connections are secure
- [ ] No loose wires

---

## 🚀 Next Steps

1. **Test thoroughly** on breadboard
2. **Add WiFi/GSM module** for connectivity
3. **Integrate GPS** for location tracking
4. **Design and 3D print** enclosure
5. **Solder components** to perfboard for permanence
6. **Add battery** for portability
7. **Test in real scenarios**
8. **Deploy and monitor**

---

## 🛠️ Troubleshooting

### Issue: LEDs not lighting
- **Check:** LED polarity (long leg = positive)
- **Check:** Resistor connections
- **Check:** Pin assignments in code

### Issue: Button not responding
- **Check:** Button connections
- **Check:** Pull-up resistor configuration
- **Try:** Different button or pin

### Issue: Buzzer not working
- **Check:** Buzzer polarity
- **Check:** Pin 11 connection
- **Try:** Different buzzer (active vs passive)

### Issue: Upload fails
- **Check:** Correct board selected
- **Check:** Correct COM port
- **Try:** Different USB cable
- **Try:** Restart Arduino IDE

---

## 📞 Support

For issues or questions:
- GitHub: https://github.com/rkece/guardian-admin-portal
- Create an issue in the repository

---

**⚠️ Safety Note:** This is a prototype device. For production use, ensure proper testing, certifications, and compliance with local regulations.
