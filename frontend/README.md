# Frontend Modern UI

This project is a React frontend meant to connect heavily with the `interns_task/backend` API. 
It features a premium **Glassmorphism Design** combined with custom CSS gradients and robust context-based Auth State mapping. 

### Technologies Features
- React (bootstrapped with Vite)
- Context API (Observer Pattern) mapped to `AuthContext.jsx`
- Axios Interceptors (`api.js`) for invisible/automatic JWT Bearer header injection
- React Router DOM
- Custom `index.css` layout.

## 🚀 Running the App

Your backend MUST be running simultaneously on port `5000`.
Since we set up proxies within Vite, you will not face CORS issues.

```bash
cd frontend
npm install
npm run dev
```

The app will become available at `http://localhost:5173`.
Try logging in, creating a task, and watching the dashboard auto-sync!
