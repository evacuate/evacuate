# Evacuate

`evacuate` is a TypeScript application that monitors seismic activity and posts earthquake information to a specified service. The application connects to a WebSocket API to receive earthquake data, processes this information, and posts it with relevant details using the AT Protocol API.

## Features

- Connects to a WebSocket API to receive earthquake data.
- Processes seismic intensity and event codes.
- Posts formatted earthquake information to a service using the AT Protocol API.

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- yarn (or yarn, although this project prefers yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/evacuate/evacuate.git
   ```

2. Navigate to the project directory:

   ```bash
   cd evacuate
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

### Configuration

Create a `.env` file in the root directory and add your credentials:

```
BLUESKY_EMAIL="user@example.com"
BLUESKY_PASSWORD="example"

MASTODON_URL="https://mastodon.social"
MASTODON_ACCESS_TOKEN="example"
```

### Scripts

- **Build**: Compile the TypeScript files to JavaScript

  ```bash
  yarn run build
  ```

- **Development**: Run the application in development mode with live reloading

  ```bash
  yarn run dev
  ```

- **Format Code**: Format code

  ```bash
  yarn run format
  ```

- **Lint Code**: Lint code

  ```bash
  yarn run lint
  ```

- **Start**: Run the application using compiled JavaScript

  ```bash
  yarn run start
  ```

- **Typecheck**: Check TypeScript types

  ```bash
  yarn run typecheck
  ```

### Usage

1. Ensure your `.env` file is correctly configured.
2. Run the application:

   ```bash
   yarn run start
   ```

3. The application will log in to the AT Protocol service and establish a WebSocket connection. It will then listen for earthquake data and post relevant information when an event is detected.

### Contributing

Contributions Welcome! You can contribute in the following ways.

- Create an issue - propose a new feature. Report a bug
- Pull Request - Fix a bug or typo Refactoring the code
- Share - Share your thoughts on blogs, Twitter, etc.

For more details, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

### Author

I proposed, facilitated, and developed the entire project.

- Minagishl ([@minagishl](https://github.com/minagishl))

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
