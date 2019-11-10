# helm-notifier

helm-notifier is a web app that helps you work with Helm charts. The aim of the project is to make it easier to determine what is in a helm chart you are thinking about installing, compare changes between different versions of a helm chart, and get notified when new versions of a chart are released.

## Installation

No need! helm-notifier is provided free of charge at [https://helm-notifier.com](https://helm-notifier.com).

If you really want to run helm-notifier yourself, no problem! Just follow these steps:

1. Clone this repository

    ```sh
    git clone https://github.com/helm-notifier/helm-notifier.git
    cd helm-notifier
    ```

1. Run `npm install`

    ```sh
    npm install
    ```

1. Build and start the docker-compose stack

    ```sh
    docker-compose up -d --build
    ```

After a few seconds, helm-notifier will be running at [http://localhost:5000](http://localhost:5000)

## Contributing

Contributions are welcome! [Submit an Issue](https://github.com/helm-notifier/helm-notifier/issues) for bug reports and feature requests. [Submit a Pull Request](https://github.com/helm-notifier/helm-notifier/pulls) to contribute work to the codebase.

We're also active on [CloudPosse's Slack workspace](https://slack.cloudposse.com/). Come join in the fun!
