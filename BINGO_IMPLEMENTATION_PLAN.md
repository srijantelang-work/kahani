# Movie & TV Show Bingo Implementation Plan

## 🎯 **Overview**

Implement a fun, gamified bingo system for movies and TV shows that allows users to track common tropes and patterns while watching content. No points or rewards - just pure entertainment and discovery.

## 📋 **Core Features**

### **1. Bingo Card System**

- **5x5 grid** with 25 squares (24 tropes + 1 free center space)
- **Auto-marking** when users watch content
- **Multiple cards per genre** for replayability
- **Progress tracking** (lines, full card completion)
- **Share results** with friends

### **2. Card Categories**

#### **Movie Bingo Cards:**

- Action/Adventure
- Romantic Comedy
- Horror/Thriller
- Science Fiction
- Drama
- Comedy
- Mystery/Suspense
- Family/Kids
- Documentary
- Classic Films

#### **TV Show Bingo Cards:**

- Drama Series
- Comedy Series
- Crime/Detective
- Fantasy/Supernatural
- Reality TV
- Medical Drama
- Legal Drama
- Sci-Fi Series
- Teen Drama
- Sitcom

### **3. Navigation Integration**

- **New "Bingo" section** in navbar
- **Dropdown menu** with "Movie Bingo" and "TV Show Bingo"
- **Active card indicator** in navbar
- **Quick access** to current bingo progress

## 🏗️ **Technical Implementation**

### **Phase 1: Core Structure**

#### **1.1 Database Schema**

```sql
-- Bingo cards table
CREATE TABLE bingo_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'movie' or 'tv'
  genre VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bingo squares table
CREATE TABLE bingo_squares (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES bingo_cards(id),
  position INTEGER NOT NULL, -- 1-25 for grid position
  description VARCHAR(255) NOT NULL,
  is_free_space BOOLEAN DEFAULT false
);

-- User bingo progress table
CREATE TABLE user_bingo_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  card_id INTEGER REFERENCES bingo_cards(id),
  completed_squares INTEGER[] DEFAULT '{}',
  completed_lines INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

#### **1.2 Component Structure**

```
src/
├── components/
│   ├── bingo/
│   │   ├── BingoCard.tsx
│   │   ├── BingoSquare.tsx
│   │   ├── BingoGrid.tsx
│   │   ├── BingoCardSelector.tsx
│   │   ├── BingoProgress.tsx
│   │   └── BingoShare.tsx
│   └── layout/
│       └── Navigation.tsx (update)
├── pages/
│   ├── MovieBingo.tsx
│   └── TVShowBingo.tsx
├── hooks/
│   ├── useBingoCard.ts
│   ├── useBingoProgress.ts
│   └── useBingoCards.ts
├── types/
│   └── bingo.ts
└── utils/
    └── bingoUtils.ts
```

### **Phase 2: UI Components**

#### **2.1 BingoCard Component**

- **5x5 grid layout** with responsive design
- **Square states**: empty, marked, completed
- **Visual feedback** for marked squares
- **Progress indicators** for lines and full card
- **Hover effects** and animations

#### **2.2 BingoCardSelector Component**

- **Grid/list view** of available cards
- **Filter by category** (movie/TV)
- **Filter by genre**
- **Search functionality**
- **Card preview** with sample squares

#### **2.3 BingoProgress Component**

- **Progress bar** showing completion percentage
- **Line counter** (rows, columns, diagonals)
- **Completion time** tracking
- **Share button** for social media

### **Phase 3: Navigation Integration**

#### **3.1 Navbar Updates**

```tsx
// Updated Navigation component
<nav>
  {/* Existing nav items */}
  <div className="dropdown">
    <button>Bingo</button>
    <div className="dropdown-menu">
      <Link to="/movie-bingo">Movie Bingo</Link>
      <Link to="/tv-bingo">TV Show Bingo</Link>
    </div>
  </div>
</nav>
```

#### **3.2 Active Card Indicator**

- **Small badge** in navbar showing active card
- **Quick access** to current bingo progress
- **Progress percentage** display

### **Phase 4: Auto-Marking System**

#### **4.1 Content Detection**

- **Trope recognition** based on movie/show metadata
- **Genre-based** auto-marking
- **Manual marking** option for users
- **Confirmation dialogs** for uncertain matches

#### **4.2 Smart Detection Rules**

```typescript
// Example detection rules
const detectionRules = {
  action: {
    'car-chase': ['action', 'adventure'],
    explosion: ['action', 'thriller'],
    gunfight: ['action', 'crime'],
  },
  romance: {
    'meet-cute': ['romance', 'comedy'],
    'airport-scene': ['romance', 'drama'],
    'wedding-scene': ['romance', 'comedy'],
  },
  // ... more rules
}
```

## 📱 **User Experience Flow**

### **1. Getting Started**

1. **User clicks "Bingo"** in navbar
2. **Selects category** (Movie or TV Show)
3. **Chooses a card** from available options
4. **Card loads** with empty grid
5. **User starts watching** content

### **2. During Viewing**

1. **Auto-marking** happens in background
2. **Notifications** when squares are marked
3. **Progress updates** in real-time
4. **Line completion** celebrations
5. **Full card completion** celebration

### **3. Sharing & Social**

1. **Share button** appears on completion
2. **Social media integration** (Twitter, Facebook)
3. **Screenshot generation** of completed card
4. **Challenge friends** to try the same card

## 🎨 **Design Specifications**

### **Color Scheme**

- **Primary**: Red (#DC2626) - matches existing theme
- **Secondary**: Gray (#6B7280) - for unmarked squares
- **Success**: Green (#10B981) - for marked squares
- **Accent**: Yellow (#F59E0B) - for completed lines

### **Typography**

- **Card titles**: Bold, 18px
- **Square text**: Regular, 12px
- **Progress text**: Medium, 14px
- **Share text**: Regular, 16px

### **Animations**

- **Square marking**: Fade-in with scale effect
- **Line completion**: Pulse animation
- **Full card**: Confetti animation
- **Hover effects**: Subtle scale and glow

## 📊 **Data Management**

### **Initial Card Data**

```typescript
// Sample card data structure
const sampleCards = [
  {
    id: 1,
    title: 'Action Movie Bingo',
    category: 'movie',
    genre: 'action',
    squares: [
      'Car chase scene',
      'Explosion',
      'Hero gets injured but keeps fighting',
      // ... 22 more squares
    ],
  },
  // ... more cards
]
```

### **Progress Tracking**

- **Local storage** for offline progress
- **Database sync** when online
- **Backup/restore** functionality
- **Export progress** to JSON

## 🚀 **Implementation Timeline**

### **Week 1: Foundation**

- [ ] Database schema setup
- [ ] Basic component structure
- [ ] Navigation integration
- [ ] Initial card data

### **Week 2: Core Features**

- [ ] BingoCard component
- [ ] BingoCardSelector component
- [ ] Basic auto-marking system
- [ ] Progress tracking

### **Week 3: Polish & Testing**

- [ ] Animations and effects
- [ ] Social sharing
- [ ] Mobile responsiveness
- [ ] User testing

### **Week 4: Launch**

- [ ] Final testing
- [ ] Documentation
- [ ] User onboarding
- [ ] Analytics setup

## 🎯 **Success Metrics**

### **User Engagement**

- **Card completion rate**: Target 30%
- **Average time per card**: Target 2-3 weeks
- **Social sharing rate**: Target 15%
- **Return user rate**: Target 60%

### **Technical Metrics**

- **Page load time**: < 2 seconds
- **Auto-marking accuracy**: > 80%
- **Mobile performance**: 90+ Lighthouse score
- **Error rate**: < 1%

## 🔧 **Future Enhancements**

### **Phase 2 Features**

- **Custom bingo cards** (user-created)
- **Community challenges** (group bingo)
- **Seasonal cards** (holiday themes)
- **Advanced auto-marking** (AI-powered)

### **Phase 3 Features**

- **Bingo tournaments** (competitive play)
- **Achievement system** (completion badges)
- **Integration with watchlist** (automatic card selection)
- **Analytics dashboard** (personal bingo stats)

---

**Ready to start implementation?** This plan provides a solid foundation for a fun, engaging bingo system that will add a unique social element to your movie/TV show platform!
