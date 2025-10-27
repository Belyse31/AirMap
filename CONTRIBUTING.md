# Contributing to AirMap

Thank you for your interest in contributing to AirMap! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template**
3. **Include:**
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. **Check existing feature requests**
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guide
   - Add tests for new features
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new pollutant support"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/AirMap.git
cd AirMap

# Install dependencies
npm install
cd mock-server && npm install && cd ..

# Create environment file
cp .env.example .env

# Start development servers
npm run start:all
```

## Code Style

### JavaScript/React

- Use functional components and hooks
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep components small and focused

**Example:**
```javascript
/**
 * Calculate Air Quality Index for a pollutant
 * @param {string} pollutant - Pollutant type (pm25, pm10, co, no2)
 * @param {number} value - Measured value
 * @returns {Object} AQI data with index, label, and color
 */
export function calculateAQI(pollutant, value) {
  // Implementation
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Create custom components for repeated patterns
- Follow mobile-first approach
- Ensure accessibility (contrast, focus states)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add heatmap layer to live map
fix: resolve WebSocket reconnection issue
docs: update deployment guide
test: add tests for AQI calculation
```

## Testing

### Writing Tests

```javascript
import { describe, it, expect } from 'vitest';
import { calculateAQI } from '../airQuality';

describe('calculateAQI', () => {
  it('should calculate correct AQI for PM2.5', () => {
    const result = calculateAQI('pm25', 12);
    expect(result.aqi).toBe(50);
    expect(result.label).toBe('Good');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Documentation

- Update README.md for major features
- Add JSDoc comments for functions
- Update API documentation
- Include examples in docs

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
└── test/           # Test utilities
```

## Adding New Features

### Example: Adding a New Pollutant

1. **Update air quality utils**
   ```javascript
   // src/utils/airQuality.js
   const O3_BREAKPOINTS = [
     { min: 0, max: 54, aqiMin: 0, aqiMax: 50, label: 'Good', color: '#00e400' },
     // ... more breakpoints
   ];
   ```

2. **Update chart components**
   ```javascript
   // src/components/Charts/TimeSeriesChart.jsx
   const colors = {
     // ... existing
     o3: '#9333ea',
   };
   ```

3. **Add tests**
   ```javascript
   it('should calculate AQI for O3', () => {
     const result = calculateAQI('o3', 50);
     expect(result.label).toBe('Good');
   });
   ```

4. **Update documentation**
   - Add to README.md
   - Update API docs

## Review Process

1. **Automated checks** must pass (tests, linting)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Documentation** review
5. **Merge** when approved

## Getting Help

- **GitHub Discussions** for questions
- **Issues** for bugs and features
- **Discord/Slack** (if available) for real-time chat

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing to cleaner air! 🌍
