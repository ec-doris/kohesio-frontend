# Kohesio Frontend

This project is the frontend of the Kohesio website (<https://kohesio.ec.europa.eu>)

## Local development (vscode)

You can setup the project on you local using vscode and the .devcontainer folder inside the container instead of install node and all the tools on your host.

After restart the project inside the container you propably need to do:

```sh
    npm install
```

You can setup the path for the API also in the file: /src/assets/config/config.json

To start the application use:

```sh
    npm run start
```

## Local development (devspace)

You can setup devspace in your local, the recipe is on devspace.yaml

Pre-requirement:

- [Rancher Desktop](https://rancherdesktop.io/)(recommended) or [Docker desktop](https://www.docker.com/products/docker-desktop/) + [K3d Cluster](https://k3d.io/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [DevSpace CLI](https://www.devspace.sh/)

Create a new cluster, if you don’t have one already (only for docker desktop version):

```sh
    k3d cluster create devspace
```

1. Clone project in your local:

```sh
    git clone https://github.com/ec-doris/kohesio-frontend.git
```

2. Create kohesio namespace
```bash
kubectl create ns kohesio
```
3. Create the certificate secret on kubernetes
```bash
kubectl create secret generic certificates-secret --from-file=tls.crt=./localhost.crt --from-file=tls.key=./localhost.key
```

4. Add line into the /etc/hosts file (host machine)
```bash
127.0.0.1     kohesio.local.europa.eu
```

5. After this you can go to the kohesio-frontend root directory and type:
```bash
devspace use namespace kohesio
devspace dev
```

- Wait for devspace starts and setup everything for you

6. Go to https://kohesio.local.europa.eu



## Angular Components

To develop the components, first we need to analyse if the component is simple enough to use pure ECL styles and new Angular Kohesio component, it means, a new component made by us inside this project.

However, if you realise that the component is too complex to handle all the features you can use Angular Material Components, trying also to align the look and feel with ECL Rules (Typography, Grid, Coulors, Spacing) see link bellow for documentation.

## Styling

All common style should go to styles.scss file, specially for pages. For the components and specific style you can keep in the component style file.

We are using include media project to facilitate the way that we work with responsive design.

Remember that for ECL we have the follow breakpoints (already defined on include media file):

```scss
$breakpoints: (
  extrasmall: 0,
  small: 480px,
  medium: 768px,
  large: 996px,
  extralarge: 1140px,
) !default;
```

## More

The project is based on Angular 13.2.0, Angular Material 13.2.2, Typescript 4.5.2.

We are using ECL to all look and feel, version 3.2.2.

For the map we are using pure leaflet version 1.6.0

## Internationalization



## Important Links

- ECL documentation: [https://ec.europa.eu/component-library/ec/harmonised-templates/page-header/group1/](https://ec.europa.eu/component-library/ec/harmonised-templates/page-header/group1/)
- ECL playground: [https://ec.europa.eu/component-library/playground/ec/](https://ec.europa.eu/component-library/playground/ec/)
- Angular Material: [https://material.angular.io/](https://material.angular.io/)
- Include media: [https://eduardoboucas.github.io/include-media/](https://eduardoboucas.github.io/include-media/)

