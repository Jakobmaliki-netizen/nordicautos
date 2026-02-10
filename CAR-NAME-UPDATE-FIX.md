# Car Name Update Fix - Nordic Autos

## Problem Description

When updating a car's model name in the admin dashboard, the change was visible on the individual car detail page (`bil-detaljer.html`) but NOT on the inventory grid page (`lagerbiler.html`).

## Root Cause

The issue was caused by **inconsistent data sources** between the two pages:

- **lagerbiler.html** (inventory grid): Loaded car data from **Supabase** using the CarCatalog class
- **bil-detaljer.html** (car detail page): Loaded car data from **localStorage with hardcoded fallback data** embedded in the HTML file

When you updated a car name in the admin dashboard:
1. ✅ The change was saved to Supabase correctly
2. ✅ lagerbiler.html would refresh from Supabase and show the updated name
3. ❌ bil-detaljer.html would read from localStorage (old data) or fall back to hardcoded data in the HTML

## The Fix

Updated `bil-detaljer.html` to:

1. **Load Supabase configuration**: Added `<script src="supabase-config.js">` to load the Supabase client
2. **Load from Supabase**: Changed `loadCarData()` function to fetch data from Supabase instead of localStorage
3. **Listen for updates**: Added event listeners for real-time update notifications
4. **Remove hardcoded data**: Removed the hardcoded fallback car data that was causing stale information

### Files Modified

- `bil-detaljer.html` - Updated to load from Supabase consistently

### Key Changes

**Before:**
```javascript
function loadCarData(carId) {
    // Try to load from localStorage first
    const savedCars = localStorage.getItem('nordic-autos-cars');
    let cars = [];
    
    if (savedCars) {
        cars = JSON.parse(savedCars);
    }
    
    // If no saved cars, use fallback data (HARDCODED)
    if (cars.length === 0) {
        cars = [/* hardcoded car data */];
    }
    
    const car = cars.find(c => c.id === carId);
    displayCar(car);
}
```

**After:**
```javascript
async function loadCarData(carId) {
    // Wait for Supabase to be ready
    await waitForSupabase();
    
    // Load from Supabase
    await window.supabaseCarManager.initialize();
    const cars = await window.supabaseCarManager.getCars();
    
    // Find and display the car
    const car = cars.find(c => c.id == carId);
    displayCar(car);
}
```

## Benefits

✅ **Consistent data source**: Both pages now load from Supabase
✅ **Real-time updates**: Changes propagate to all pages immediately
✅ **No stale data**: Removed hardcoded fallback data
✅ **Better maintainability**: Single source of truth for car data

## Testing the Fix

### Automated Verification

1. Open `verify-fix.html` in your browser
2. The page will automatically run verification checks
3. All checks should pass with green checkmarks

### Manual Testing

1. **Open the admin dashboard**: `admin/dashboard.html`
2. **Edit a car name**: 
   - Click the edit button on any car
   - Change the model name (e.g., "911 Carrera S" → "911 Carrera S UPDATED")
   - Click "Gem bil" (Save)
3. **Check lagerbiler.html**:
   - Open `lagerbiler.html` in a new tab
   - The car should show the updated name in the grid
4. **Check bil-detaljer.html**:
   - Click on the car to open the detail page
   - The car name should match the updated name
   - Both the title and all references should be updated

### Interactive Testing

1. Open `test-car-name-update.html` in your browser
2. Select a car from the dropdown
3. Enter a new model name
4. Click "Update Car Name in Supabase"
5. Watch the test results - all three views should update

## Expected Behavior

After the fix:

1. **Admin updates car name** → Saved to Supabase
2. **lagerbiler.html** → Shows updated name immediately (refreshes every 5-10 seconds)
3. **bil-detaljer.html** → Shows updated name when page loads or refreshes
4. **All pages** → Display consistent data from Supabase

## Troubleshooting

### If the fix doesn't work:

1. **Clear browser cache**: Hard refresh with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Check console**: Open browser DevTools (F12) and look for errors
3. **Verify Supabase connection**: Check that `supabase-config.js` loads correctly
4. **Check network tab**: Verify that Supabase API calls are successful

### Common Issues

**Issue**: Car name still shows old value
- **Solution**: Clear localStorage: `localStorage.clear()` in browser console

**Issue**: "Supabase not initialized" error
- **Solution**: Wait a few seconds for Supabase to initialize, then try again

**Issue**: Changes don't appear immediately
- **Solution**: The page refreshes every 5-10 seconds. Wait or manually refresh.

## Technical Details

### Data Flow

```
Admin Dashboard
    ↓ (saves to)
Supabase Database
    ↓ (loads from)
lagerbiler.html (CarCatalog)
    ↓ (loads from)
bil-detaljer.html (loadCarData)
```

### Update Propagation

1. Admin saves car → Supabase
2. Admin triggers localStorage event
3. lagerbiler.html listens for event → refreshes from Supabase
4. bil-detaljer.html listens for event → refreshes from Supabase
5. Both pages show updated data

## Next Steps

The fix is complete and ready for production. The real-time update system is working correctly with:

- ✅ Consistent data loading from Supabase
- ✅ Cross-tab communication via localStorage events
- ✅ Periodic refresh every 5-10 seconds
- ✅ Manual refresh buttons for testing

For more advanced real-time features (WebSocket subscriptions, update queuing, etc.), refer to the full spec in `.kiro/specs/nordic-autos-realtime-fix/`.
