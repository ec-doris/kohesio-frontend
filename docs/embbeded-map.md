# Embedding Kohesio Map

You can embed the kohesio map into your website, just use the code snippet bellow and customize using the parameters.

- Please use the parameter parentLocation=NAME_OF_YOUR_WEBSITE for us to understand from where the traffic is coming, this can be the name of the website or one key to identify your website

```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?parentLocation=NAME_OF_YOUR_WEBSITE"  width="800" height="800">
```

## Languages

The kohesio map supports all EU languages:

- French version
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/fr/map?parentLocation=NAME_OF_YOUR_WEBSITE"  width="800" height="800">
```

- Greek version
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/el/map?parentLocation=NAME_OF_YOUR_WEBSITE"  width="800" height="800">
```

## Parameters

You can customize the map visualization using the following parameters:

- mapRegion - To drill-down in a specific region into the map (default is empty, it means the whole Europe)
- heatScale - To see the map with a heat scale per region (default is false)
- hideProjectsNearBy - To hide the "Projects near me" button (default is false)
- coords - To show a specific popup in a certain coordinate (default is empty), this parameter depends on the mapRegion parameter 
- openProjectInner - To show the project detail inside the map window (default is false, it means the projects will open in a new tab window)
- project - It will open the project directly in a popup (default is empty). This parameter depends on the openProjectInner set to true
- clusterView - To show the projects in a cluster view (default is false) if not set, the projects will be shown in a region view
- cci - "Common Identification Code". It will take priority over the others parameters and will show only the coordinates for this particular cci
- fund - Fund this project was financed from (ex: https://linkedopendata.eu/entity/Q2504369)

## Example:

### Pass multiple CCI parameters with the name "cci"
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?cci=2014PL16M2OP005,2014PL16M2OP008"  width="800" height="800">
```

### Drill-down region
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?parentLocation=NAME_OF_YOUR_WEBSITE&mapRegion=Q2556199&coords=-8.3211792431454,40.1552222"  width="800" height="800">
```

### Drill-down region with coordinates selection
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?parentLocation=NAME_OF_YOUR_WEBSITE&mapRegion=Q2556199&coords=-8.3211792431454,40.1552222"  width="800" height="800">
```

### Drill-down into a region with heat scale
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?parentLocation=NAME_OF_YOUR_WEBSITE&?heatScale=true&mapRegion=Q2556137"  width="800" height="800">
```
## Filters
The map supports the following filters:
- keywords
- town
- country
- region
- projectCollection
- theme
- fund

```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?country=Belgium"  width="800" height="800">
```

### embed map with cluster view
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?clusterView=true"  width="800" height="800">
```
