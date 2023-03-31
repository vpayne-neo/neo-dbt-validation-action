# neo-dbt-validation-action

This GitHub Action is designed to validate that your dbt SQL files have proper column documentation in a corresponding YAML file. It ensures that every column in your SQL files is documented in your YAML files as per the dbt documentation best practices. It helps maintain consistency and readability across your dbt project.

## Usage

```yaml
name: dbt-file-validation

on:
  pull_request:
    branches:
      - master

jobs:
  validate-dbt-model:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Get changed files
        id: files
        uses: jitterbit/get-changed-files@v1

      - name: Validate DBT model
        uses: vpayne-neo/neo-dbt-validation-action@main
        with:
          files: ${{ steps.files.outputs.all }}
```
