# evacuate

<!-- Service names must be lower case. -->

`evacuate` is a TypeScript application that monitors seismic activity and posts earthquake information to a specified service. The application connects to a WebSocket API to receive earthquake data, processes this information, and posts it with relevant details using the AT Protocol API.

## Features

- Connects to a WebSocket API to receive earthquake data.
- Processes seismic intensity and event codes.
- Posts formatted earthquake information to a service using the AT Protocol API.

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm (or yarn, although this project prefers npm)

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
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add your credentials:

```
EMAIL=user@example.com
PASSWORD=example
```

### Scripts

- **Build**: Compile the TypeScript files to JavaScript

  ```bash
  npm run build
  ```

- **Development**: Run the application in development mode with live reloading

  ```bash
  npm run dev
  ```

- **Format Code**: Format code with Prettier

  ```bash
  npm run format
  ```

- **Lint Code**: Lint code with ESLint

  ```bash
  npm run lint
  ```

- **Start**: Run the application using compiled JavaScript

  ```bash
  npm start
  ```

- **Typecheck**: Check TypeScript types

  ```bash
  npm run typecheck
  ```

### Usage

1. Ensure your `.env` file is correctly configured.
2. Run the application:

   ```bash
   npm run start
   ```

3. The application will log in to the AT Protocol service and establish a WebSocket connection. It will then listen for earthquake data and post relevant information when an event is detected.

### Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your fork.
4. Open a pull request to the main repository.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgements

- [AT Protocol API](https://github.com/atproto/api)
- [ws](https://github.com/websockets/ws)
