# ReviewLens Development Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **IBM Bob API Access** - Obtain from IBM Bob Dev Day Hackathon
- **Git** - For version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/reviewlens.git
   cd reviewlens
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `backend/.env` based on `.env.example`:
   ```bash
   cd ../backend
   cp ../.env.example .env
   ```
   
   Edit `.env` and add your IBM Bob credentials:
   ```env
   IBM_BOB_API_KEY=your_actual_api_key_here
   IBM_BOB_API_URL=your_actual_endpoint_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application

You need two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` and open automatically in your browser.

---

## 📁 Project Structure

```
reviewlens/
├── backend/                    # Node.js + Express API
│   ├── prompts/
│   │   └── reviewAnalyst.js   # IBM Bob prompt template
│   ├── services/
│   │   └── bobService.js      # IBM Bob API integration
│   ├── routes/
│   │   └── analyze.js         # API endpoints
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── PasteInput.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SentimentGauge.jsx
│   │   │   ├── PainPoints.jsx
│   │   │   ├── Praises.jsx
│   │   │   └── ActionPlan.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── ibm-bob-report/            # IBM Bob session exports
├── .env.example
├── .gitignore
├── README.md
└── DEVELOPMENT.md
```

---

## 🔧 Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `backend/`
   - Server auto-restarts with `--watch` flag (Node 18+)
   - Test endpoints with curl or Postman

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Vite hot-reloads automatically
   - Changes appear instantly in browser

### Testing the API

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Analyze Reviews:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "Great product! Fast shipping. Love it!"}'
```

---

## 🤖 IBM Bob Integration

### How It Works

1. User pastes reviews in frontend
2. Frontend sends POST request to `/api/analyze`
3. Backend builds structured prompt using `reviewAnalyst.js`
4. Backend calls IBM Bob API via `bobService.js`
5. IBM Bob returns JSON-formatted analysis
6. Backend validates and returns data to frontend
7. Frontend displays results in Dashboard

### Prompt Engineering

The core prompt is in `backend/prompts/reviewAnalyst.js`. Key features:

- **Schema-enforced output** - Forces JSON structure
- **Context-aware** - Handles mixed languages, emojis, informal text
- **Actionable insights** - Generates specific recommendations

### Customizing the Prompt

To modify the analysis behavior:

1. Edit `backend/prompts/reviewAnalyst.js`
2. Update the `createReviewAnalysisPrompt()` function
3. Test with sample reviews
4. Adjust based on IBM Bob's responses

---

## 🎨 Frontend Customization

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom theme** - Defined in `frontend/tailwind.config.js`
- **Global styles** - In `frontend/src/index.css`

### Adding New Components

1. Create component in `frontend/src/components/`
2. Import in parent component (usually `Dashboard.jsx` or `App.jsx`)
3. Pass props as needed
4. Style with Tailwind classes

### Color Scheme

Defined in `tailwind.config.js`:
- **Primary** - Blue (brand color)
- **Success** - Green (positive sentiment, praises)
- **Danger** - Red (negative sentiment, pain points)
- **Warning** - Yellow (medium priority items)

---

## 🐛 Troubleshooting

### Backend Issues

**"Missing required environment variables"**
- Ensure `.env` file exists in `backend/` directory
- Check that `IBM_BOB_API_KEY` and `IBM_BOB_API_URL` are set

**"IBM Bob API is not responding"**
- Verify IBM Bob API credentials are correct
- Check network connection
- Ensure IBM Bob service is available

**Port 3001 already in use**
- Change `PORT` in `backend/.env`
- Update `FRONTEND_URL` proxy in `frontend/vite.config.js`

### Frontend Issues

**"Cannot connect to server"**
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.js`

**Styles not loading**
- Run `npm install` in frontend directory
- Check that Tailwind is configured correctly
- Clear browser cache

**Components not rendering**
- Check browser console for errors
- Verify all imports are correct
- Ensure props are passed correctly

---

## 📦 Building for Production

### Backend

```bash
cd backend
npm start
```

For production, consider:
- Using PM2 or similar process manager
- Setting `NODE_ENV=production`
- Implementing rate limiting
- Adding request logging

### Frontend

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

To preview production build:
```bash
npm run preview
```

---

## 🚢 Deployment

### IBM Cloud Code Engine (Recommended)

1. **Build Docker images** (create Dockerfiles)
2. **Push to IBM Container Registry**
3. **Deploy to Code Engine**
4. **Configure environment variables**

### Alternative Platforms

- **Vercel** - Frontend only (serverless functions for backend)
- **Heroku** - Full-stack deployment
- **Railway** - Simple deployment with auto-scaling
- **DigitalOcean App Platform** - Managed deployment

---

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Paste short review text (< 100 chars)
- [ ] Paste long review text (> 10,000 chars)
- [ ] Paste mixed language reviews
- [ ] Paste reviews with emojis
- [ ] Test with empty input
- [ ] Test with special characters
- [ ] Verify sentiment score accuracy
- [ ] Check pain points extraction
- [ ] Verify praises extraction
- [ ] Review action plan relevance

### Sample Test Data

Create test files in `backend/test-data/`:
- `positive-reviews.txt`
- `negative-reviews.txt`
- `mixed-reviews.txt`
- `multilingual-reviews.txt`

---

## 📊 Performance Optimization

### Backend

- Implement caching for repeated analyses
- Add request rate limiting
- Optimize IBM Bob API calls
- Use connection pooling

### Frontend

- Lazy load Dashboard components
- Implement virtual scrolling for long lists
- Optimize bundle size with code splitting
- Add service worker for offline support

---

## 🔐 Security Considerations

1. **Never commit `.env` files**
2. **Validate all user input** (already implemented)
3. **Sanitize review text** before sending to IBM Bob
4. **Implement rate limiting** on API endpoints
5. **Use HTTPS in production**
6. **Set appropriate CORS policies**

---

## 📝 Git Workflow

### Branching Strategy

```bash
main          # Production-ready code
├── develop   # Integration branch
├── feature/* # New features
└── fix/*     # Bug fixes
```

### Commit Messages

Follow conventional commits:
```
feat: add sentiment gauge component
fix: resolve CORS issue in backend
docs: update README with setup instructions
style: format code with prettier
refactor: optimize IBM Bob service
```

---

## 🎯 Next Steps

### MVP Enhancements

- [ ] Add loading skeleton screens
- [ ] Implement error retry logic
- [ ] Add export to PDF functionality
- [ ] Create shareable report links
- [ ] Add dark mode support

### Future Features (Post-Hackathon)

- [ ] User authentication
- [ ] Save analysis history
- [ ] Compare multiple analyses
- [ ] Trend detection over time
- [ ] Direct Shopify/WooCommerce integration
- [ ] Multi-language UI support

---

## 📚 Resources

- [IBM Bob Documentation](https://www.ibm.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Express.js](https://expressjs.com)

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Contact: [your-email@example.com]

---

**Built with ❤️ for IBM Bob Dev Day Hackathon 2026**