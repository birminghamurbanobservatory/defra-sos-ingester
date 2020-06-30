# defra-sos-ingester

Pulls in Defra data from its Sensor Observations Service (SOS). Intended to be run as a CronJob.


## Timeseries IDs

Getting the timeseries can be a bit of a manual process. For a given variable you can get a list of the stations that measure it and the associated ID. 

For example here is the request for [Nitrogen Monoxide](https://uk-air.defra.gov.uk/sos-ukair/api/v1/stations?expanded=true&phenomenon=38).

N.B. there can be more than one timeseries listed per station, although generally only one is active.


## Documentation

- [EU Standard Methods for monitoring and UK Approach](https://uk-air.defra.gov.uk/networks/monitoring-methods?view=eu-standards)

- [AURN](https://uk-air.defra.gov.uk/networks/network-info?view=aurn)

- UK Air's [Station Map](https://uk-air.defra.gov.uk/interactive-map)

- [List of variables](http://dd.eionet.europa.eu/vocabulary/aq/pollutant/view)

- [SOS Documentation](https://uk-air.defra.gov.uk/data/about_sos)

- Last reading from [Birmingham A4540 Roadside](https://uk-air.defra.gov.uk/data/site-data?f_site_id=BIRR&view=last_hour)

- [Birmingham A4540 Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=BIRR)

- Last reading from [Birmingham Ladywood](https://uk-air.defra.gov.uk/data/site-data?f_site_id=BMLD&view=last_hour)

- [Birmingham Ladywood Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=BMLD)

- Last reading from [Birmingham Acocks Green](https://uk-air.defra.gov.uk/data/site-data?f_site_id=AGRN&view=last_hour)

- [Acocks Green Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=AGRN)

