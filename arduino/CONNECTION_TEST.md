# Arduino UNO R3 Connection Test Guide

## ✅ Step 1: Check Physical Connection

### What to verify:
1. **USB Cable Connected:**
   - Arduino UNO R3 → USB port on your laptop
   - Use a **data cable** (not just a charging cable)

2. **Power LED:**
   - Look for a **green LED** on the Arduino board
   - It should be **ON** when connected
   - Located near the USB port

3. **L LED (Pin 13):**
   - Small LED labeled "L" on the board
   - May blink or stay on/off

---

## 🔍 Step 2: Detect Arduino Port

### Your Arduino is detected on: **COM7**

To verify in Device Manager:
1. Press `Win + X` → Select "Device Manager"
2. Expand "Ports (COM & LPT)"
3. Look for: **"USB Serial Device (COM7)"** or **"Arduino Uno (COM7)"**

✅ **If you see COM7** → Arduino is connected!
❌ **If you don't see it:**
   - Try a different USB cable
   - Try a different USB port
   - Restart your computer

---

## 💻 Step 3: Test with Arduino IDE

### A. Install Arduino IDE (if not installed)
1. Download: https://www.arduino.cc/en/software
2. Install the software
3. Launch Arduino IDE

### B. Configure Arduino IDE
1. **Select Board:**
   - Go to: `Tools → Board → Arduino AVR Boards → Arduino UNO`

2. **Select Port:**
   - Go to: `Tools → Port → COM7`
   - Should show: `COM7 (Arduino UNO)`

### C. Upload Test Sketch
1. **Open the test file:**
   - `File → Open → connection_test.ino`

2. **Click Upload:**
   - Click the **→** (Upload) button
   - Wait for "Done uploading" message

3. **Expected Output:**
   ```
   Sketch uses 1234 bytes (3%) of program storage space.
   Global variables use 234 bytes (11%) of dynamic memory.
   Done uploading.
   ```

---

## 📊 Step 4: Open Serial Monitor

1. **Open Serial Monitor:**
   - Click: `Tools → Serial Monitor`
   - Or press: `Ctrl + Shift + M`

2. **Set Baud Rate:**
   - Bottom right corner → Select **9600 baud**

3. **Expected Output:**
   ```
   ================================
     Arduino UNO R3 Connection Test
   ================================
   
   ✅ Arduino is connected!
   ✅ Serial communication working!
   
   You should see the built-in LED blinking...
   If you see this message, your Arduino is working perfectly!
   
   💡 LED ON
   🌑 LED OFF
   💡 LED ON
   🌑 LED OFF
   ```

4. **Watch the Board:**
   - The **L LED** (Pin 13) should **blink** every second
   - ON for 1 second → OFF for 1 second → repeat

---

## ✅ Success Indicators

If you see ALL of these, your Arduino is working perfectly:

- ✅ Green power LED is ON
- ✅ COM7 appears in Device Manager
- ✅ Upload completes without errors
- ✅ Serial Monitor shows messages
- ✅ L LED blinks on the board

---

## ❌ Troubleshooting

### Problem: "Port COM7 not found"
**Solutions:**
- Unplug and replug USB cable
- Try different USB port
- Restart Arduino IDE
- Check Device Manager for the port number

### Problem: "Upload failed" or "avrdude: stk500_recv(): programmer is not responding"
**Solutions:**
- Close Serial Monitor before uploading
- Press reset button on Arduino
- Select correct board (Arduino UNO)
- Select correct port (COM7)
- Try different USB cable

### Problem: "No serial output"
**Solutions:**
- Check baud rate is set to 9600
- Close and reopen Serial Monitor
- Re-upload the sketch
- Press reset button on Arduino

### Problem: "LED not blinking"
**Solutions:**
- Look for the small "L" LED near Pin 13
- Re-upload the sketch
- Try the built-in "Blink" example: `File → Examples → 01.Basics → Blink`

---

## 🎯 Quick Test Commands

### Check if Arduino is detected (Windows):
```powershell
wmic path Win32_SerialPort get DeviceID,Description
```

### Expected output:
```
DeviceID  Description
COM7      USB Serial Device
```

---

## 🚀 Next Steps

Once your Arduino is working:

1. ✅ **Test Complete** → Arduino is ready!
2. 📝 **Next:** Upload `guardian_keychain.ino`
3. 🔌 **Build:** Follow `HARDWARE_GUIDE.md` to build the SOS keychain
4. 🧪 **Test:** Test the SOS button functionality

---

## 📞 Still Having Issues?

If your Arduino still isn't working:

1. **Try the built-in Blink example:**
   - `File → Examples → 01.Basics → Blink`
   - This is the simplest test

2. **Check USB cable:**
   - Some cables are power-only
   - Try a different cable

3. **Update drivers:**
   - Windows may need CH340 or FTDI drivers
   - Download from Arduino website

4. **Test on different computer:**
   - Helps identify if it's a hardware or software issue

---

## ✨ Your Arduino Status

Based on detection:
- **Port:** COM7 ✅
- **Status:** Detected
- **Next:** Upload test sketch to verify

**Good luck! 🛠️**
