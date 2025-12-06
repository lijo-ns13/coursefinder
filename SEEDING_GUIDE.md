# Database Seeding Guide

## Quick Start

To seed your database with comprehensive course data, run:

```bash
cd backend
npm run seed-comprehensive-clear
```

This will:
- Clear existing courses
- Generate **675+ courses** across all categories and countries
- Insert them into your database

## Available Seed Commands

### 1. Comprehensive Seed (Recommended)
```bash
npm run seed-comprehensive-clear
```
- **675 courses** across 15 categories
- **15 countries** covered
- All program levels (undergraduate, graduate, diploma)
- Realistic fees, rankings, and requirements

### 2. Comprehensive Seed (Keep Existing)
```bash
npm run seed-comprehensive
```
- Adds new courses without clearing existing ones
- Useful for adding more data incrementally

### 3. Accurate Seed (Small Dataset)
```bash
npm run seed-accurate
```
- **~18 courses** with detailed, accurate data
- Good for testing specific scenarios

### 4. Basic Seed (Minimal)
```bash
npm run seed
```
- **3 sample courses** for quick testing

## Course Distribution

After running comprehensive seed, you'll have:

### By Category (45 courses each):
- Engineering & Technology
- Health Sciences, Medicine, Nursing
- Business, Management & Economics
- Law, Politics, Social, Community Service
- Arts
- Sciences
- English For Academic Studies
- AI
- CS
- MBA
- Engineering
- Nursing
- Medicine
- Business
- Law

### By Country (45 courses each):
- Canada
- USA
- UK
- Australia
- Germany
- France
- Switzerland
- Ireland
- New Zealand
- Sweden
- Finland
- Netherlands
- Singapore
- Dubai
- Saudi Arabia

## Features

✅ **Realistic Data**: Fees, rankings, acceptance rates, IELTS requirements
✅ **Multiple Levels**: Undergraduate, Graduate, Diploma programs
✅ **Various Intakes**: Fall, Spring, Summer
✅ **Job Outcomes**: Salary data, placement rates
✅ **Complete Information**: Requirements, course content, descriptions

## Usage

After seeding, you can:

1. **Search by Category**: Filter by "Engineering", "Nursing", "MBA", etc.
2. **Search by Country**: Filter by "Canada", "USA", "UK", etc.
3. **Search by Level**: Filter by undergraduate, graduate, or diploma
4. **Use AI Recommendations**: Get personalized course suggestions

## Troubleshooting

### No courses found after seeding?

1. **Check MongoDB connection**: Ensure your `.env` file has correct `MONGODB_URI`
2. **Verify seed completed**: Check the console output for "Successfully inserted X courses"
3. **Check category names**: Use exact category names like "Engineering & Technology" or "Engineering"
4. **Try broader search**: Search without filters first to see all courses

### Want more courses?

Run the seed script multiple times (without `--clear` flag) or modify the script to generate more courses per category.

## Notes

- The comprehensive seed generates realistic but synthetic data
- Course names, universities, and details are generated programmatically
- All courses are marked with `source.api: 'comprehensive-seed'`
- You can mix seeded data with real API data from RapidAPI/OpenAlex

