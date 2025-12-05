# Live Data Fetching Guide

This project fetches **real-time, accurate data** from external APIs instead of using static seed data.

## How It Works

The system automatically fetches live course and university data from:
- **RapidAPI** - Universities and Colleges API
- **OpenAlex** - Academic institutions database
- **Google Places API** - Location and place details

## Automatic Data Fetching

### On First Search
When a user searches for courses and the database is empty, the system automatically fetches popular courses from external APIs.

### On-Demand Fetching
Admins can trigger data fetching through API endpoints or scripts.

## Manual Data Fetching

### Using Scripts

```bash
# Fetch popular courses by category
npm run fetch-data popular

# Fetch courses from a specific country
npm run fetch-data country US
npm run fetch-data country CA
npm run fetch-data country GB

# Refresh existing courses with fresh data
npm run fetch-data refresh 100

# Search and fetch specific courses
npm run fetch-data search "Computer Science" CS CA
npm run fetch-data search "Artificial Intelligence" AI US
```

### Using API Endpoints (Admin Only)

All endpoints require admin authentication.

```bash
# Fetch courses with filters
POST /api/data/fetch
{
  "query": "Computer Science",
  "country": "US",
  "category": "CS",
  "limit": 50
}

# Fetch popular courses by category
POST /api/data/fetch-popular

# Fetch courses by country
POST /api/data/fetch-by-country
{
  "country": "CA",
  "limit": 20
}

# Refresh existing courses
POST /api/data/refresh
{
  "limit": 100
}
```

## Data Sources

### RapidAPI Universities API
- Provides university names, locations, websites
- Used as primary source for university data
- Requires RapidAPI subscription

### OpenAlex API
- Academic institutions database
- Provides research-focused institution data
- Free to use

### Google Places API
- Enriches courses with:
  - Precise coordinates
  - Photos
  - Ratings
  - Detailed place information
- Requires Google Cloud account

## Data Transformation

The system transforms raw API data into a standardized course format:

- **University Information**: Name, location, ranking, website
- **Course Details**: Name, description, duration, category
- **Fees**: Estimated based on country and category
- **Requirements**: Standardized education level, marks, IELTS/TOEFL
- **Job Outcomes**: Estimated salary and placement data

## Fee Estimation

Fees are estimated based on:
- Country (US, CA, GB, AU, etc.)
- Course category (AI, CS, MBA, Nursing, etc.)

Actual fees may vary. The system provides estimates based on typical ranges.

## Updating Data

### Automatic Updates
- Courses are updated when refreshed via admin panel
- Search results trigger fresh API calls if needed

### Manual Updates
Use the refresh endpoint or script to update existing courses:

```bash
npm run fetch-data refresh
```

## Best Practices

1. **Initial Setup**: Run `npm run fetch-data popular` to populate database
2. **Regular Updates**: Refresh data weekly/monthly to keep it current
3. **Country-Specific**: Fetch courses by country for better accuracy
4. **Rate Limits**: Be mindful of API rate limits

## API Rate Limits

- **RapidAPI**: Varies by subscription plan
- **OpenAlex**: Free tier available, generous limits
- **Google Places**: Pay-as-you-go, $200 free credit/month

## Troubleshooting

### No Courses Found
- Check API keys are set correctly
- Verify API subscriptions are active
- Check network connectivity
- Review logs for API errors

### Stale Data
- Run refresh command: `npm run fetch-data refresh`
- Check last update timestamp in course metadata

### API Errors
- Verify API keys in `.env` file
- Check API subscription status
- Review rate limit usage
- Check API service status

## Example Workflow

```bash
# 1. Initial setup - fetch popular courses
npm run fetch-data popular

# 2. Fetch specific country courses
npm run fetch-data country US
npm run fetch-data country CA

# 3. Search for specific courses
npm run fetch-data search "MBA" MBA US

# 4. Refresh data weekly
npm run fetch-data refresh 200
```

## Notes

- Data fetching happens asynchronously to avoid blocking requests
- Failed fetches are logged but don't crash the application
- Courses are deduplicated by external ID
- Existing courses are updated, not duplicated

