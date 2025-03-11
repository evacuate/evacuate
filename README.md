# Evacuate

`evacuate` is a TypeScript application that monitors seismic activity and posts earthquake information to a specified service. The application connects to a WebSocket API to receive earthquake data, processes this information, and posts it with relevant details using the AT Protocol API.

> This is a message from the developer for those who are using or considering deploying this application.
Please view it [here](https://gist.github.com/minagishl/68a4f9174c266115ffecbd68b33ab6fb).

## Features

- Connects to a WebSocket API to receive earthquake data.
- Processes seismic intensity and event codes.
- Posts formatted earthquake information to a service using the AT Protocol API.

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- pnpm (version 9 or higher)

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
   pnpm install
   ```

### Configuration

1. Copy the example configuration file:

    ```bash
    cp .env.example .env
    ```

2. Edit the `.env` file

### Scripts

- **Build**: Compile the TypeScript files to JavaScript

  ```bash
  pnpm build
  ```

- **Development**: Run the application in development mode with live reloading

  ```bash
  pnpm dev
  ```

- **Lint Code**: Lint code

  ```bash
  pnpm lint
  ```

### Usage

1. Ensure your `.env` file is correctly configured.
2. Run the application:

   ```bash
   pnpm start
   ```

3. The application will log in to the AT Protocol service and establish a WebSocket connection. It will then listen for earthquake data and post relevant information when an event is detected.

## Contributing

Contributions Welcome! You can contribute in the following ways.

- Create an issue - propose a new feature. Report a bug
- Pull Request - Fix a bug or typo Refactoring the code
- Share - Share your thoughts on blogs, Twitter, etc.

For more details, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Author

I proposed, facilitated, and developed the entire project.

- Minagishl ([@minagishl](https://github.com/minagishl))

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
