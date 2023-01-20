# Embedding Kohesio Map

You can embed the kohesio map into your website, just use the code snippet bellow and customize using the parameters.  

```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map"  width="800" height="800">
```

## Languages

The kohesio map supports all EU languages:

- French version
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/fr/map"  width="800" height="800">
```

- Greek version
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/el/map"  width="800" height="800">
```

## Parameters

You can customize the map visualization using the following parameters:

- mapRegion - To drill-down in a specific region into the map (default is empty, it means the whole Europe)
- heatScale - To see the map with a heat scale per region (default is false)
- hideProjectsNearBy - To hide the "Projects near me" button (default is false)
- coords - To show a specific popup in a certain coordinate (default is empty), this parameter depends on the mapRegion parameter 
- openProjectInner - To show the project detail inside the map window (default is false, it means the projects will open in a new tab window)
- project - It will open the project directly in a popup (default is empty). This parameter depends on the openProjectInner set to true

## Example:

### Drill-down region with coordinates selection
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?mapRegion=Q2556199&coords=-8.3211792431454,40.1552222"  width="800" height="800">
```

### Drill-down region with coordinates selection
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?mapRegion=Q2556199&coords=-8.3211792431454,40.1552222"  width="800" height="800">
```

### Drill-down into a region with heat scale
```html
<embed type="text/html" src="https://kohesio.ec.europa.eu/en/map?heatScale=true&mapRegion=Q2556137"  width="800" height="800">
```
