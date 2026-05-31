# Troubleshooting Guide - "Error: Failed to fetch events"

## Common Causes & Solutions

### 1. ❌ Backend Not Running
**Problem:** Backend server is not running on port 5000

**Solution:**
```bash
# From root directory, start backend
npm run dev:backend

# Or from backend directory
cd backend
npm run dev
```

**Verify:** Visit http://localhost:5000/health in your browser - you should see a JSON response

---

### 2. ❌ MongoDB Not Connected
**Problem:** Backend is running, but can't connect to MongoDB

**Symptoms:** Check backend console for:
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

**Option A: Start MongoDB Locally**
```bash
# If you have MongoDB installed
mongod

# On Windows
net start MongoDB
```

**Option B: Use MongoDB Atlas (Cloud)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-feedback
```

---

### 3. ❌ API Proxy Not Working
**Problem:** Frontend can't proxy requests to backend

**Symptoms:** Check browser Network tab in DevTools - the request fails

**Solution:**

Verify `frontend/vite.config.ts` has the correct proxy config:
```typescript
proxy: {
    '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
    }
}
```

Then restart the frontend dev server:
```bash
npm run dev:frontend
```

---

### 4. ❌ CORS Issue
**Problem:** Backend rejects requests from frontend

**Symptoms:** Browser console shows CORS error

**Solution:**

Make sure `backend/.env` has correct FRONTEND_URL:
```
FRONTEND_URL=http://localhost:5173
```

And restart backend:
```bash
npm run dev:backend
```

---

## Debugging Steps

### Step 1: Check Backend Health
```bash
# Open in browser or terminal
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2026-05-31T..."
}
```

### Step 2: Check Test Endpoint
```bash
# Open in browser or terminal
curl http://localhost:5000/test
```

Expected response:
```json
{
  "message": "Backend API is working",
  "mongoDBConnected": true/false
}
```

### Step 3: Check Events Endpoint
```bash
# Open in browser or terminal  
curl http://localhost:5000/events
```

Expected: `[]` or array of events (no error)

### Step 4: Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for logged messages like:
   ```
   Fetching events from /api/events...
   Response status: 200
   ```

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Retry the fetch
4. Look for the `/api/events` request
5. Check response status and body

---

## Quick Start Checklist

- [ ] MongoDB is running
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Browser console shows no errors
- [ ] `http://localhost:5000/health` returns success
- [ ] `backend/.env` has correct MongoDB URI
- [ ] `backend/.env` has `FRONTEND_URL=http://localhost:5173`
- [ ] Vite frontend proxy is configured correctly

---

## Still Having Issues?

1. **Check all console logs** - Browser AND Terminal/CMD
2. **Look at the specific error message** - It now shows detailed info
3. **Try the Retry button** in the error message on frontend
4. **Check firewall** - Make sure ports 5000 and 5173 are not blocked
5. **Try different port** if ports are in use:
   ```
   # backend/.env
   PORT=5001
   
   # frontend vite.config.ts - change proxy target to 5001
   ```

---

## Helpful Commands

```bash
# Install all dependencies fresh
npm run install-all

# Start everything
npm run dev

# Check if port is in use (Windows PowerShell)
netstat -ano | findstr :5000

# Kill process using a port (Windows)
taskkill /PID <PID> /F
```
