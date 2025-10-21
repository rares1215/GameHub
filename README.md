# Mini GameHub API

**Mini GameHub API** is the backend for an application where users can express their opinions and thoughts about certain video games. The API is built and optimized so that users can leave comments and ratings for specific games, but only admins can add new games.

---

## **Description**

This API allows:

- User management and authentication via JWT.
- Creating, listing, updating, and deleting games (with admin permissions for modifications).
- Adding reviews for games, with ratings and comments, limited to a single review per user per game.
- Adding games to a 'Favorite' category (via toggle).
- Filtering, searching, and sorting games and reviews.
- Pagination for large results, optimizing performance.
- Potential support for caching to improve performance in the future.

---

## **Technologies Used**

- **Backend:** Django 5, Django REST Framework
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** PostgreSQL
- **Filtering and Searching:** Django Filter, DRF Search & Ordering
- **Pagination:** DRF Pagination
- **Frontend (coming soon...):** React.js + TailwindCSS (fullstack)

---

## **Main Endpoints**

- **Users & Auth**

  - `/api/register/` - Create account
  - `/api/token/` - Obtain JWT token
  - `/api/token/refresh/` - Refresh token
  - `/api/profile/` - Get authenticated user profile

- **Games**

  - `/api/games/` - List and create games (POST for admin)
  - `/api/games/<game_id>/` - Retrieve, Update, Delete game (Update/Delete for admin)

- **Reviews**

  - `/api/games/<game_id>/reviews/` - List and create reviews
  - `/api/reviews/<review_id>/` - Retrieve, Update, Delete review (update/delete only by owner)

- **Favorites**
  - `/api/favorites/` - List user favorites
  - `/api/games/<game_id>/favorite/` - Toggle favorite (add/remove game from favorites)

---

## **Advanced Features**

- **Ordering:** Games and reviews can be ordered by relevant data (e.g., release date, average rating, number of reviews).
- **Filtering:** Support for filtering games and reviews by various criteria (genre, developer, rating, etc.).
- **Searching:** Text search in title and developer.
- **Pagination:** Limits the number of results per page for optimal performance.
- **Performance:** Optimizations using `select_related` and `prefetch_related` to reduce SQL queries.

---

**The application will be a Full-Stack app. The API will continue to evolve (caching, throttling, etc.). This is a work in progress.**
