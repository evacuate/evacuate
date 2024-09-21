# Contribution Guide

Contributions are welcome! We would be happy to receive your cooperation. You can contribute in the following ways

- Create an issue - propose a new feature. Report a bug
- Pull Request - Fix a bug or typo Refactoring the code
- Share - Share your thoughts on blogs, Twitter, etc.

This project is still in its growth phase, but your contributions will make it a success!

## Code of Conduct

Please read our [Code of Conduct](docs/CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

1. Fork the repository.
2. Create a new branch from `develop` for your feature or bugfix.
3. Make your changes.
4. Commit your changes with a clear and descriptive commit message.
5. Push your changes to your fork.
6. Open a pull request against the `develop` branch of this repository.

## Installing dependencies

The `evacuate/evacuate` project uses [Yarn](https://yarnpkg.com/) as its package manager. Developers should install Yarn.

Then install the dependencies with the following command

```bash
yarn install
```

## Submitting Changes

1. Ensure your code follows the project's style guide.
2. Ensure all tests pass by running the test suite.
3. Update the documentation if necessary.
4. Open a pull request with a clear title and description of your changes.

## Running Tests

We use [Vitest](https://vitest.dev/) for testing. To run the tests, use the following command

```bash
yarn test
```

## Style Guide

- Follow the coding standards defined in the .editorconfig and biome.json files.
- Use Biome to format your code. To format the code, execute the following command

  ```bash
  yarn format
  ```

- Ensure your code is linted by running the following command

  ```bash
  yarn lint
  ```

## Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
